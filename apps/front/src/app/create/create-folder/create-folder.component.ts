import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { faFolder, faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { Set } from "@scholarsome/shared";
import { SetsService } from "../../shared/http/sets.service";
import { FoldersService } from "../../shared/http/folders.service";
import { Router } from "@angular/router";

@Component({
  selector: "scholarsome-create-folder",
  templateUrl: "./create-folder.component.html",
  styleUrls: ["./create-folder.component.scss"]
})
export class CreateFolderComponent implements OnInit {
  constructor(
    private readonly setsService: SetsService,
    private readonly foldersService: FoldersService,
    private readonly router: Router
  ) {}

  @ViewChild("spinner", { static: true }) spinner: ElementRef;

  createFolderForm = new FormGroup({
    name: new FormControl("", Validators.required),
    description: new FormControl(""),
    color: new FormControl("#8338ff"),
    private: new FormControl(false),
    sets: new FormGroup({})
  });

  sets: Set[] = [];

  submitted = false;
  loading = true;

  protected readonly faFolder = faFolder;
  protected readonly faQuestionCircle = faQuestionCircle;

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

  async submit(form: FormGroup) {
    if (this.createFolderForm.invalid) {
      this.createFolderForm.markAllAsTouched();
      return;
    }

    this.createFolderForm.disable();
    this.submitted = true;
    this.createFolderForm.setErrors(null);

    // we know that these are valid
    /* eslint-disable */
    const name = (this.createFolderForm.get("name")!).value!;
    const description = (this.createFolderForm.get("description")!).value!;
    const color = (this.createFolderForm.get("color")!).value!;
    const isPrivate = (this.createFolderForm.get("private")!).value!;
    /* eslint-enable */

    const selectedSets: string[] = [];
    const sets = this.createFolderForm.controls.sets.controls as { [key: string]: AbstractControl };

    Object.keys(sets).forEach((set) => {
      if (sets[set].value) selectedSets.push(set);
    });

    const folder = await this.foldersService.createFolder({
      name,
      description,
      color,
      private: isPrivate,
      sets: selectedSets
    });

    if (folder) {
      await this.router.navigate(["/folder", folder.id]);
    } else {
      this.createFolderForm.enable();
      this.createFolderForm.setErrors({ httpError: true });
      this.submitted = false;
    }
  }

  async ngOnInit() {
    const sets = await this.setsService.mySets();

    if (sets) {
      const formSets = new FormGroup({});

      for (const set of sets) {
        formSets.addControl(set.id, new FormControl(false));
      }

      this.createFolderForm.setControl("sets", formSets);

      this.sets = sets;

      this.loading = false;
      this.spinner.nativeElement.remove();
    }
  }
}
