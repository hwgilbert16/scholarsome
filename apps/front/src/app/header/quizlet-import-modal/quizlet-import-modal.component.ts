import { Component, TemplateRef, ViewChild } from "@angular/core";
import { faQ } from "@fortawesome/free-solid-svg-icons";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { ConvertingService } from "../../shared/http/converting.service";

@Component({
  selector: "scholarsome-quizlet-import-modal",
  templateUrl: "./quizlet-import-modal.component.html",
  styleUrls: ["./quizlet-import-modal.component.scss"]
})
export class QuizletImportModalComponent {
  constructor(
    private readonly bsModalService: BsModalService,
    private readonly convertingService: ConvertingService,
    private readonly router: Router
  ) {
    this.bsModalService.onHide.subscribe(() => {
      this.clicked = false;
      this.response = "";
    });
  }

  @ViewChild("modal") modal: TemplateRef<HTMLElement>;

  protected clicked = false;
  protected response: string;

  protected modalRef?: BsModalRef;

  protected readonly faQuestionCircle = faQuestionCircle;
  protected readonly faQ = faQ;

  public open(): BsModalRef {
    this.modalRef = this.bsModalService.show(this.modal);
    return this.modalRef;
  }

  protected async submit(form: NgForm) {
    this.clicked = true;
    this.response = "";

    const set = await this.convertingService.importSetFromQuizletTxt({
      title: form.value["title"],
      description: form.value["description"],
      private: form.value["privateCheck"] === true,
      sideDiscriminator: form.value["termDefinitionDiscriminator"],
      cardDiscriminator: form.value["rowDiscriminator"],
      set: form.value["set"]
    });

    if (set) {
      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate(["/study-set", set.id]);
      });
    } else {
      this.response = "pattern";
      this.clicked = false;
      return;
    }
  }
}
