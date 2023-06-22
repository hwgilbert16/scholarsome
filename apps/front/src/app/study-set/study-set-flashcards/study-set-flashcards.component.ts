import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { SetsService } from "../../shared/http/sets.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Card } from "@prisma/client";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { faShuffle, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { Meta, Title } from "@angular/platform-browser";
import { NgForm } from "@angular/forms";

@Component({
  selector: "scholarsome-study-set-flashcards",
  templateUrl: "./study-set-flashcards.component.html",
  styleUrls: ["./study-set-flashcards.component.scss"]
})
export class StudySetFlashcardsComponent implements OnInit, AfterViewInit, OnDestroy {
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

  @ViewChild("spinner", { static: true }) spinner: ElementRef;
  @ViewChild("container", { static: true }) container: ElementRef;
  @ViewChild("flashcard", { static: true }) flashcard: ElementRef;
  @ViewChild("controlbar", { static: true }) controlbar: ElementRef;

  @ViewChild("flashcardsConfig") configModal: TemplateRef<HTMLElement>;
  @ViewChild("completedRound") roundCompletedModal: TemplateRef<HTMLElement>;

  protected cards: Card[];
  protected setId: string | null;

  protected shufflingEnabled = false;
  protected flashcardsMode: "traditional" | "progressive";

  // Array of the IDs of known cards for progressive mode
  protected knownCardIndices: number[] = [];
  // Whether the user is between rounds
  protected roundCompleted = false;

  // What the user answers with
  protected answer: "definition" | "term";
  // The current index
  protected index = 0;

  // The current side being shown
  protected side: string;
  // The text being shown to the user
  protected sideText = "";
  // Displayed in bottom right showing the progress
  protected remainingCards = "";

  // Whether the card has been flipped or not
  protected flipped = false;
  // Whether the first flip interaction has been made
  protected flipInteraction = false;

  protected modalRef?: BsModalRef;
  protected window = window;
  protected faShuffle = faShuffle;
  protected faThumbsUp = faThumbsUp;

  updateIndex() {
    this.remainingCards = `${this.index + 1}/${this.cards.length}`;
  }

  shuffleCards() {
    this.shufflingEnabled = !this.shufflingEnabled;
    if (this.shufflingEnabled) {
      this.cards = this.cards.sort(() => 0.5 - Math.random());
    }

    this.index = 0;
    this.updateIndex();

    if (this.side === "term") {
      this.sideText = this.cards[this.index].term;
    } else {
      this.sideText = this.cards[this.index].definition;
    }
  }

  flipCard(type?: string) {
    if (!type) {
      this.flipInteraction = true;
      this.flipped = !this.flipped;
    }

    if (this.side === "term") {
      this.sideText = this.cards[this.index].definition;
      this.side = "definition";
    } else {
      this.sideText = this.cards[this.index].term;
      this.side = "term";
    }
  }

  changeCard(direction: number) {
    if (this.index === this.cards.length - 1 && this.flashcardsMode === "progressive") {
      this.roundCompleted = true;
      this.modalRef = this.modalService.show(this.roundCompletedModal, { backdrop: false, ignoreBackdropClick: true, animated: false, class: "modal-dialog-centered" });

      this.cards.filter((c) => !this.knownCardIndices.includes(c.index.valueOf()));
      this.index = 0;
      this.updateIndex();

      this.sideText = this.cards[0][this.side as keyof Card] as string;

      return;
    }
    this.index += direction;
    this.flipInteraction = false;
    this.flipped = false;
    this.updateIndex();

    if (this.answer === "definition") {
      this.side = "term";
    } else {
      this.side = "definition";
    }

    this.sideText =
      this.answer === "definition" ? this.cards[this.index].term : this.cards[this.index].definition;
  }

  beginFlashcards(form: NgForm) {
    this.flashcardsMode = form.value["flashcards-type"];
    this.answer = form.value["answer-with"];
    this.side = form.value["answer-with"] === "definition" ? "term" : "definition";

    this.sideText = this.cards[0][this.side as keyof Card] as string;

    this.modalRef?.hide();
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

    this.updateIndex();
  }

  ngAfterViewInit(): void {
    this.modalRef = this.modalService.show(this.configModal, { backdrop: false, ignoreBackdropClick: true, animated: false, class: "modal-dialog-centered" });
  }

  ngOnDestroy(): void {
    this.modalRef?.hide();
  }
}
