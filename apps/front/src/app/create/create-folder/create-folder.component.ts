import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { faClone, faFolderPlus, faArrowUp, faFolderTree } from "@fortawesome/free-solid-svg-icons";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { FoldersService } from "../../shared/http/folders.service";
import { Router } from "@angular/router";
import { Meta, Title } from "@angular/platform-browser";
import { UsersService } from "../../shared/http/users.service";
import { Set, Folder } from "@prisma/client";

@Component({
  selector: "scholarsome-create-folder",
  templateUrl: "./create-folder.component.html",
  styleUrls: ["./create-folder.component.scss"]
})
export class CreateFolderComponent implements OnInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly foldersService: FoldersService,
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly metaService: Meta
  ) {
    this.titleService.setTitle("Create a folder — Scholarsome");
    this.metaService.addTag({ name: "description", content: "Create a new Scholarsome folder to contain your study sets. Scholarsome is the way studying was meant to be." });
  }

  @ViewChild("spinner", { static: true }) spinner: ElementRef;

  createFolderForm = new FormGroup({
    name: new FormControl("", Validators.required),
    description: new FormControl(""),
    color: new FormControl("#8338ff"),
    private: new FormControl(false),
    parentFolderId: new FormControl(""),
    sets: new FormGroup({}),
    subfolders: new FormGroup({})
  });

  sets: Set[] = [];
  folders: Folder[] = [];

  submitted = false;
  loading = true;

  protected readonly faClone = faClone;
  protected readonly faArrowUp = faArrowUp;
  protected readonly faFolderPlus = faFolderPlus;
  protected readonly faQuestionCircle = faQuestionCircle;
  protected readonly faFolderTree = faFolderTree;

  toggleSubfolderSelection(index: string) {
    if (this.createFolderForm.disabled) return;
    if (this.createFolderForm.controls.parentFolderId.value === index) {
      this.toggleParentFolderSelection(index);
    }

    const folder = this.createFolderForm.controls.subfolders.get(index);
    if (!folder) return;

    folder.setValue(!folder.value);
  }

  isSubfolderSelected(index: string): boolean {
    const subfolder = this.createFolderForm.controls.subfolders.get(index);
    if (!subfolder) return false;

    return subfolder.value;
  }

  toggleParentFolderSelection(index: string) {
    if (this.createFolderForm.disabled) return;
    if (this.isSubfolderSelected(index)) {
      this.toggleSubfolderSelection(index);
    }

    if (this.createFolderForm.controls.parentFolderId.value === index) {
      this.createFolderForm.controls.parentFolderId.setValue("");
    } else {
      this.createFolderForm.controls.parentFolderId.setValue(index);
    }
  }

  toggleSetSelection(index: string) {
    if (this.createFolderForm.disabled) return;

    const set = this.createFolderForm.controls.sets.get(index);
    if (!set) return;

    set.setValue(!set.value);
  }

  isSetSelected(index: string): boolean {
    const set = this.createFolderForm.controls.sets.get(index);
    if (!set) return false;

    return set.value;
  }

  async submit() {
    if (this.createFolderForm.invalid) {
      this.createFolderForm.markAllAsTouched();
      return;
    }

    this.createFolderForm.disable();
    this.submitted = true;
    this.createFolderForm.setErrors(null);

    const selectedSets: string[] = [];
    const selectedSubfolders: string[] = [];

    const sets = this.createFolderForm.controls.sets.controls as { [key: string]: AbstractControl };

    Object.keys(sets).forEach((set) => {
      if (sets[set].value) selectedSets.push(set);
    });

    const subfolders = this.createFolderForm.controls.subfolders.controls as { [key: string]: AbstractControl };

    Object.keys(subfolders).forEach((subfolder) => {
      if (subfolders[subfolder].value) selectedSubfolders.push(subfolder);
    });

    // we know that these are valid
    /* eslint-disable */
    const folder = await this.foldersService.createFolder({
      name: this.createFolderForm.controls.name.value!,
      description: this.createFolderForm.controls.description.value!,
      color: this.createFolderForm.controls.color.value!,
      private: this.createFolderForm.controls.private.value!,
      parentFolderId: this.createFolderForm.controls.parentFolderId.value!,
      subfolders: selectedSubfolders,
      sets: selectedSets
    });
    /* eslint-enable */

    if (folder) {
      await this.router.navigate(["/folder", folder.id]);
    } else {
      this.createFolderForm.enable();
      this.createFolderForm.setErrors({ httpError: true });
      this.submitted = false;
    }
  }

  async ngOnInit() {
    const user = await this.usersService.myUser();

    if (user) {
      if (user.sets.length > 0) {
        const formSets = new FormGroup({});

        for (const set of user.sets) {
          formSets.addControl(set.id, new FormControl(false));
        }

        this.createFolderForm.setControl("sets", formSets);
      }

      if (user.folders.length > 0) {
        const formSubfolders = new FormGroup({});

        for (const folder of user.folders) {
          formSubfolders.addControl(folder.id, new FormControl(false));
        }

        this.createFolderForm.setControl("subfolders", formSubfolders);
      }

      this.sets = user.sets;
      this.folders = user.folders;

      this.loading = false;
      this.spinner.nativeElement.remove();
    }
  }
}
