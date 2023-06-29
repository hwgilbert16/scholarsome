import { Component, TemplateRef, ViewChild } from "@angular/core";
import { faQ } from "@fortawesome/free-solid-svg-icons";
import { NgForm } from "@angular/forms";
import { SetsService } from "../../shared/http/sets.service";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: "scholarsome-quizlet-import-modal",
  templateUrl: "./quizlet-import-modal.component.html",
  styleUrls: ["./quizlet-import-modal.component.scss"]
})
export class QuizletImportModalComponent {
  constructor(
    private readonly bsModalService: BsModalService,
    private readonly setsService: SetsService,
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

  protected readonly faQ = faQ;

  public open(): BsModalRef {
    this.modalRef = this.bsModalService.show(this.modal);
    return this.modalRef;
  }

  protected async submit(form: NgForm) {
    this.clicked = true;
    this.response = "";

    const exported = form.value["importSet"].substring(0, form.value["importSet"].length - 1).split(";");

    // need to add a regex check here to ensure pattern is valid

    if (exported.length < 1) {
      // quizletImportRes set to pattern indicates that the pattern is invalid
      this.response = "pattern";
      this.clicked = false;
      return;
    }

    const cards: { index: number; term: string; definition: string; }[] = [];

    for (let i = 0; i < exported.length; i++) {
      const split = exported[i].split("\t");

      cards.push({
        index: i,
        term: split[0],
        definition: split[1]
      });
    }

    const set = await this.setsService.createSet({
      title: form.value["title"],
      description: form.value["description"],
      private: form.value["privateCheck"] === true,
      cards: cards
    });

    if (set) {
      await this.router.navigate(["/study-set/" + set.id]);
    } else {
      this.response = "pattern";
      this.clicked = false;
      return;
    }
  }
}
