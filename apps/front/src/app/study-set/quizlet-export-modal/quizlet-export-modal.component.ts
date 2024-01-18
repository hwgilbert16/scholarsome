import { Component, TemplateRef, ViewChild } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { faQ } from "@fortawesome/free-solid-svg-icons";
import { NgForm } from "@angular/forms";
import { Set } from "@scholarsome/shared";
import { ConvertingService } from "../../shared/http/converting.service";

@Component({
  selector: "scholarsome-quizlet-export-modal",
  templateUrl: "./quizlet-export-modal.component.html",
  styleUrls: ["./quizlet-export-modal.component.scss"]
})
export class QuizletExportModalComponent {
  constructor(
    private readonly bsModalService: BsModalService,
    private readonly convertingService: ConvertingService
  ) {
    this.bsModalService.onHide.subscribe(() => {
      this.clicked = false;
      this.error = false;
    });
  }

  @ViewChild("modal") modal: TemplateRef<HTMLElement>;

  protected clicked = false;
  protected error = false;

  protected set: Set;

  protected modalRef?: BsModalRef;

  protected readonly faQuestionCircle = faQuestionCircle;
  protected readonly faQ = faQ;

  public open(set: Set): BsModalRef {
    this.modalRef = this.bsModalService.show(this.modal);
    this.set = set;

    return this.modalRef;
  }

  public async submit(form: NgForm) {
    this.clicked = true;
    this.error = false;

    const sideDiscriminator = form.controls["sideDiscriminator"].value;
    const cardDiscriminator = form.controls["cardDiscriminator"].value;

    const file = await this.convertingService.exportSetToQuizletTxt(
        this.set.id,
        sideDiscriminator,
        cardDiscriminator
    );

    if (!file) {
      this.error = true;
      return;
    }

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(file);
    link.download = this.set.title + ".txt";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    this.clicked = false;
    this.modalRef?.hide();
  }
}
