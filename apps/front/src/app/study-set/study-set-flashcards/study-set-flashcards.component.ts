import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { SetsService } from "../../shared/http/sets.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Card } from "@prisma/client";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { faShuffle } from "@fortawesome/free-solid-svg-icons";
import { Meta, Title } from "@angular/platform-browser";

@Component({
  selector: "scholarsome-study-set-flashcards",
  templateUrl: "./study-set-flashcards.component.html",
  styleUrls: ["./study-set-flashcards.component.scss"]
})
export class StudySetFlashcardsComponent implements OnInit {
  /**
   * @ignore
   */
  constructor(
    private readonly route: ActivatedRoute,
    private readonly sets: SetsService,
    private readonly router: Router,
    public readonly modalService: BsModalService,
    private readonly titleService: Title,
    private readonly metaService: Meta
  ) {}

  modalRef?: BsModalRef;

  @ViewChild("spinner", { static: true }) spinner: ElementRef;
  @ViewChild("container", { static: true }) container: ElementRef;
  @ViewChild("flashcard", { static: true }) flashcard: ElementRef;
  @ViewChild("controlbar", { static: true }) controlbar: ElementRef;

  @ViewChild("settings") settings: TemplateRef<HTMLElement>;

  cards: Card[];

  setId: string | null;

  shufflingEnabled = false;
  answer = "Definition";
  side = "Term";
  index = 0;

  faShuffle = faShuffle;
  flip = false;

  updateIndex() {
    this.controlbar.nativeElement.children[1].textContent = `${this.index + 1}/${this.cards.length}`;
  }

  shuffleCards() {
    this.shufflingEnabled = !this.shufflingEnabled;
    if (this.shufflingEnabled) {
      this.cards = this.cards.sort(() => 0.5 - Math.random());
    }

    this.index = 0;
    this.updateIndex();

    if (this.side === "Term") {
      this.flashcard.nativeElement.children[0].textContent = this.cards[this.index].term;
    } else {
      this.flashcard.nativeElement.children[0].textContent = this.cards[this.index].definition;
    }
  }

  flipCard() {
    this.flip = !this.flip;

    if (this.side === "Term") {
      this.flashcard.nativeElement.children[0].textContent = this.cards[this.index].definition;
      this.side = "Definition";
    } else {
      this.flashcard.nativeElement.children[0].textContent = this.cards[this.index].term;
      this.side = "Term";
    }
  }

  changeCard(direction: number) {
    this.index += direction;
    this.updateIndex();

    if (this.answer === "Definition") {
      this.side = "Term";
    } else {
      this.side = "Definition";
    }

    this.flashcard.nativeElement.children[0].textContent =
      this.answer === "Definition" ? this.cards[this.index].term : this.cards[this.index].definition;
  }

  async ngOnInit(): Promise<void> {
    this.setId = this.route.snapshot.paramMap.get("setId");
    if (!this.setId) {
      await this.router.navigate(["404"]);
      return;
    }

    const set = await this.sets.set(this.setId);
    if (!set) {
      await this.router.navigate(["404"]);
      return;
    }

    this.titleService.setTitle(set.title + " — Scholarsome");
    this.metaService.addTag({ name: "description", content: "Begin studying flashcards " + set.title + " study set on Scholarsome. Improve your memorization skills by taking a quiz." });

    // sort the cards by index
    this.cards = set.cards.sort((a, b) => {
      return a.index - b.index;
    });

    this.spinner.nativeElement.remove();
    this.container.nativeElement.removeAttribute("hidden");

    this.updateIndex();
    this.flashcard.nativeElement.children[0].textContent = this.cards[0].term;
  }
}
