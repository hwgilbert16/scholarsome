import { Component, TemplateRef, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { SetsService } from "../../shared/http/sets.service";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: "scholarsome-anki-import-modal",
  templateUrl: "./anki-import-modal.component.html",
  styleUrls: ["./anki-import-modal.component.scss"]
})
export class AnkiImportModalComponent {
  constructor(
    private readonly bsModalService: BsModalService,
    private readonly setsService: SetsService,
    private readonly router: Router
  ) {
    this.bsModalService.onHide.subscribe(() => {
      this.file = null;
      this.response = "";
      this.clicked = false;
    });
  }

  @ViewChild("modal") modal: TemplateRef<HTMLElement>;

  protected uploading = false;
  protected clicked = false;
  protected response: string;
  protected file: File | null = null;

  protected modalRef?: BsModalRef;

  public open(): BsModalRef {
    this.modalRef = this.bsModalService.show(this.modal);
    return this.modalRef;
  }

  protected async submit(form: NgForm) {
    this.clicked = true;
    this.response = "";

    if (!this.file) return;

    setTimeout(() => {
      if (this.response !== "incompatible") this.uploading = true;
    }, 3000);

    const set = await this.setsService.createSetFromApkg({
      title: form.value["title"],
      description: form.value["description"],
      private: form.value["privateCheck"] === true,
      file: this.file
    });

    if (set) {
      this.router.navigate(["/study-set/" + set.id]);
    } else {
      this.response = "incompatible";
      this.clicked = false;
      this.file = null;
      this.uploading = false;
      return;
    }
  }

  protected onFileUpload(event: Event): void {
    const files = (event.target as HTMLInputElement).files;

    if (files) {
      this.file = files[0];
    }
  }
}
