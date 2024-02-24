import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FoldersService } from "../shared/http/folders.service";
import { Folder } from "@scholarsome/shared";
import { Set, Folder as PrismaFolder } from "@prisma/client";
import { ActivatedRoute, Router } from "@angular/router";
import { faFolder, faClone, faFolderTree, faPencil, faCancel, faSave } from "@fortawesome/free-solid-svg-icons";
import { UsersService } from "../shared/http/users.service";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { SetsService } from "../shared/http/sets.service";

@Component({
  selector: "scholarsome-folder",
  templateUrl: "./folder.component.html",
  styleUrls: ["./folder.component.scss"]
})
export class FolderComponent implements OnInit {
  constructor(
    private readonly foldersService: FoldersService,
    private readonly usersService: UsersService,
    private readonly setsService: SetsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    // to ensure that clicking on breadcrumbs work
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  @ViewChild("spinner", { static: true }) spinner: ElementRef;

  protected folder: Folder;
  protected folderId: string;
  protected folderPath: { name: string; id: string; }[] = [];

  protected subfolders: PrismaFolder[];
  protected folderSets: Set[] = [];

  protected userSets: Set[] = [];
  protected userFolders: Folder[] = [];

  protected saveForm = new FormGroup({
    name: new FormControl("", Validators.required),
    description: new FormControl(""),
    color: new FormControl(""),
    private: new FormControl(false),
    parentFolderId: new FormControl(""),
    sets: new FormGroup({}),
    subfolders: new FormGroup({})
  });
  protected saveInProgress = false;

  protected userIsAuthor = false;
  protected editing = false;
  protected editingLoading = false;
  protected loading = true;

  protected readonly faFolder = faFolder;
  protected readonly faClone = faClone;
  protected readonly faFolderTree = faFolderTree;
  protected readonly faPencil = faPencil;
  protected readonly faCancel = faCancel;
  protected readonly faSave = faSave;

  toggleSubfolderSelection(index: string) {
    if (this.saveForm.disabled) return;

    const folder = this.saveForm.controls.subfolders.get(index);
    if (!folder) return;

    folder.setValue(!folder.value);
  }

  isSubfolderSelected(index: string): boolean {
    const subfolder = this.saveForm.controls.subfolders.get(index);
    if (!subfolder) return false;

    return subfolder.value;
  }

  toggleSetSelection(index: string) {
    if (this.saveForm.disabled) return;

    const set = this.saveForm.controls.sets.get(index);
    if (!set) return;

    set.setValue(!set.value);
  }

  isSetSelected(index: string): boolean {
    const set = this.saveForm.controls.sets.get(index);
    if (!set) return false;

    return set.value;
  }

  async save() {
    this.saveForm.disable();
    this.saveInProgress = true;

    const selectedSets: string[] = [];
    const selectedSubfolders: string[] = [];

    const sets = this.saveForm.controls.sets.controls as { [key: string]: AbstractControl };

    Object.keys(sets).forEach((set) => {
      if (sets[set].value) selectedSets.push(set);
    });

    const subfolders = this.saveForm.controls.subfolders.controls as { [key: string]: AbstractControl };

    Object.keys(subfolders).forEach((subfolder) => {
      if (subfolders[subfolder].value) selectedSubfolders.push(subfolder);
    });

    // we know that these are valid
    /* eslint-disable */
    await this.foldersService.updateFolder({
      id: this.folder.id,
      name: this.saveForm.controls.name.value!,
      description: this.saveForm.controls.description.value!,
      color: this.saveForm.controls.color.value!,
      private: this.saveForm.controls.private.value!,
      subfolders: selectedSubfolders,
      sets: selectedSets
    });
    /* eslint-enable */

    await this.view();
    this.saveForm.enable();
  }

  async edit() {
    this.editing = true;
    this.editingLoading = true;

    const userSets = await this.setsService.mySets();
    const userFolders = await this.foldersService.myFolders();

    this.saveForm.controls.name.setValue(this.folder.name);
    this.saveForm.controls.description.setValue(this.folder.description);
    this.saveForm.controls.color.setValue(this.folder.color);
    this.saveForm.controls.private.setValue(this.folder.private);

    this.editingLoading = false;

    if (userSets && userSets.length > 0) {
      this.userSets = userSets;

      const formUserSets = new FormGroup({});

      for (const set of this.userSets) {
        formUserSets.addControl(
            set.id,
            new FormControl(this.folderSets.some((s) => s.id === set.id))
        );
      }

      this.saveForm.setControl("sets", formUserSets);
    }

    if (userFolders && userFolders.length > 0) {
      this.userFolders = userFolders.filter((f) => f.id !== this.folder.id);

      const formUserFolders = new FormGroup({});

      for (const folder of this.userFolders) {
        if (folder.id === this.folder.id) continue;

        formUserFolders.addControl(
            folder.id,
            new FormControl(this.subfolders.some((f) => f.id === folder.id))
        );
      }

      this.saveForm.setControl("subfolders", formUserFolders);
    }
  }

  async view() {
    this.folderPath = [];

    const folder = await this.foldersService.folder(this.folderId);
    if (!folder) {
      this.router.navigate(["404"]);
      return;
    }

    this.folder = folder;

    const user = await this.usersService.myUser();

    if (user && folder.authorId === user.id) {
      this.userIsAuthor = true;
    }

    let parentFolderId = folder.parentFolderId;

    this.folderPath.push({
      name: folder.name,
      id: folder.id
    });

    while (parentFolderId) {
      const parentFolder = await this.foldersService.folder(parentFolderId);

      if (parentFolder) {
        this.folderPath.push({
          name: parentFolder.name,
          id: parentFolder.id
        });

        parentFolderId = parentFolder.parentFolderId;
      } else {
        parentFolderId = "";
      }
    }

    this.folderPath = this.folderPath.reverse();

    this.editing = false;
    this.saveInProgress = false;
    this.userFolders = [];
    this.userSets = [];

    this.folderSets = folder.sets;
    this.subfolders = folder.subfolders;
  }

  async ngOnInit() {
    const folderId = this.route.snapshot.paramMap.get("folderId");
    if (!folderId) {
      this.router.navigate(["404"]);
      return;
    }

    this.folderId = folderId;

    await this.view();

    this.loading = false;
    this.spinner.nativeElement.remove();
  }
}
