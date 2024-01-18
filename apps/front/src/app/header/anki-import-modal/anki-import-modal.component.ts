import { Component, TemplateRef, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { ConvertingService } from "../../shared/http/converting.service";

@Component({
  selector: "scholarsome-anki-import-modal",
  templateUrl: "./anki-import-modal.component.html",
  styleUrls: ["./anki-import-modal.component.scss"]
})
export class AnkiImportModalComponent {
  constructor(
    private readonly bsModalService: BsModalService,
    private readonly convertingService: ConvertingService,
    private readonly router: Router
  ) {
    this.bsModalService.onHide.subscribe(() => {
      this.file = null;
      this.response = "";
      this.clicked = false;
    });
  }

  @ViewChild("modal") modal: TemplateRef<HTMLElement>;

  protected submitted = false;
  protected uploading = false;
  protected clicked = false;
  protected response: string;
  protected file: File | null = null;

  protected modalRef?: BsModalRef;
  protected readonly faQuestionCircle = faQuestionCircle;

  public open(): BsModalRef {
    this.modalRef = this.bsModalService.show(this.modal);
    return this.modalRef;
  }

  protected async submit(form: NgForm) {
    this.clicked = true;
    this.response = "";
    this.submitted = false;

    if (!this.file) return;

    setTimeout(() => {
      if (this.response !== "incompatible" && !this.submitted) this.uploading = true;
    }, 3000);

    const set = await this.convertingService.importSetFromAnkiApkg({
      title: form.value["title"],
      description: form.value["description"],
      private: form.value["privateCheck"] === true,
      file: this.file
    });

    if (set) {
      this.router.navigate(["/study-set/" + set.id]);
      this.uploading = false;
      this.clicked = false;
      this.file = null;
      this.submitted = true;
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
