import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { FoldersService } from "../../shared/http/folders.service";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
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
    private readonly titleService: Title
  ) {
    this.titleService.setTitle("Create a folder — Scholarsome");
  }

  @ViewChild("spinner", { static: true }) spinner: ElementRef;

  createFolderForm = new FormGroup({
    name: new FormControl("", Validators.required),
    description: new FormControl(""),
    color: new FormControl("#8338ff"),
    private: new FormControl(false),
    parentFolderId: new FormControl(""),
    sets: new FormGroup({})
  });

  sets: Set[] = [];
  folders: Folder[] = [];

  submitted = false;
  loading = true;

  protected readonly faFolderPlus = faFolderPlus;
  protected readonly faQuestionCircle = faQuestionCircle;

  toggleFolderSelection(index: string) {
    if (this.createFolderForm.disabled) return;

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
    const sets = this.createFolderForm.controls.sets.controls as { [key: string]: AbstractControl };

    Object.keys(sets).forEach((set) => {
      if (sets[set].value) selectedSets.push(set);
    });

    // we know that these are valid
    /* eslint-disable */
    const folder = await this.foldersService.createFolder({
      name: this.createFolderForm.controls.name.value!,
      description: this.createFolderForm.controls.description.value!,
      color: this.createFolderForm.controls.color.value!,
      private: this.createFolderForm.controls.private.value!,
      parentFolderId: this.createFolderForm.controls.parentFolderId.value!,
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
      const formSets = new FormGroup({});

      if (user.sets.length > 0) {
        for (const set of user.sets) {
          formSets.addControl(set.id, new FormControl(false));
        }
      }

      this.createFolderForm.setControl("sets", formSets);

      this.sets = user.sets;
      this.folders = user.folders;

      this.loading = false;
      this.spinner.nativeElement.remove();
    }
  }
}
