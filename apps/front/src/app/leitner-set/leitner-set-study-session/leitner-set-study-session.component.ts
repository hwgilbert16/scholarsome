import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LeitnerSetsService } from "../../shared/http/leitner-sets.service";
import { LeitnerCard } from "@scholarsome/shared";
import { DomSanitizer } from "@angular/platform-browser";
import { Card } from "@prisma/client";
import { LeitnerCardsService } from "../../shared/http/leitner-cards.service";
import { LeitnerIncrements } from "@scholarsome/shared";
import { faCake, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "scholarsome-leitner-set-study-session",
  templateUrl: "./leitner-set-study-session.component.html",
  styleUrls: ["./leitner-set-study-session.component.scss"]
})
export class LeitnerSetStudySessionComponent implements OnInit {
  constructor(
    private readonly leitnerSetsService: LeitnerSetsService,
    private readonly leitnerCardsService: LeitnerCardsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly sanitizer: DomSanitizer
  ) {}

  protected cards: LeitnerCard[] = [];

  // The ID of the study set this Leitner set corresponds to,
  // NOT the ID of the Leitner set
  protected setId: string | null;

  // Whether the page has been loaded
  loaded = false;

  // The current index
  protected index = 0;
  protected initialLearntCards = 0;
  // Number of learnt cards in the current study session
  // Initialized to the length of the learned cards array
  protected learntCards = 0;
  // Number of cards to be learnt per study session
  protected cardsPerSession = 0;
  // The current side being shown
  protected side: string;
  // The text being shown to the user
  protected sideText = "";
  // The default side shown to the user
  protected answerWith: "definition" | "term";

  // Whether the card has been flipped or not
  protected flipped = false;
  // Whether the first flip interaction has been made
  // needed to prevent animation classes from being applied until first click
  protected flipInteraction = false;

  protected readonly faCake = faCake;

  flipCard() {
    this.flipInteraction = true;
    this.flipped = !this.flipped;

    // delayed to occur when text is the least visible during animation
    setTimeout(() => {
      if (this.side === "term") {
        this.sideText = this.cards[this.index].card.definition;
        this.side = "definition";
      } else {
        this.sideText = this.cards[this.index].card.term;
        this.side = "term";
      }
    }, 150);
  }

  async nextCard(type: number) {
    let newBox;
    this.learntCards++;

    if (type === -1 && this.cards[this.index].box > 1) {
      newBox = this.cards[this.index].box - 1;
    } else if (type === 1 && this.cards[this.index].box < 8) {
      newBox = this.cards[this.index].box + 1;
    } else {
      newBox = this.cards[this.index].box;
    }

    await this.leitnerCardsService.updateLeitnerCard({
      cardId: this.cards[this.index].cardId,
      box: newBox,
      learned: true,
      // need to add date addition here
      due: new Date(new Date().setDate(new Date().getDate() + LeitnerIncrements["BOX_" + newBox as keyof typeof LeitnerIncrements]))
    });

    this.index++;

    if (this.index !== this.cards.length) this.sideText = this.cards[this.index].card[this.answerWith as keyof Card] as string;
  }

  async ngOnInit(): Promise<void> {
    this.setId = this.route.snapshot.paramMap.get("setId");
    if (!this.setId) {
      this.router.navigate(["404"]);
      return;
    }

    const leitnerSet = await this.leitnerSetsService.leitnerSet(this.setId);
    if (!leitnerSet) {
      this.router.navigate(["404"]);
      return;
    }

    this.cardsPerSession = leitnerSet.cardsPerSession;
    this.answerWith = leitnerSet.answerWith.toLowerCase() === "definition" ? "definition" : "term";

    leitnerSet.leitnerCards = leitnerSet.leitnerCards.sort(() => 0.5 - Math.random());

    // if there is an existing study session started today
    if (
      leitnerSet.studySession &&
      ((new Date().getTime() - new Date(leitnerSet.studySession.startedAt).getTime()) / 36e5) < 24
    ) {
      if (leitnerSet.studySession.unlearnedCards.length === 0) {
        this.router.navigate(["study-set/" + this.setId]);
        return;
      }

      for (const unlearnedCards of leitnerSet.studySession.unlearnedCards) {
        this.cards.push(unlearnedCards.leitnerCard);
      }

      this.learntCards = leitnerSet.studySession.learnedCards.length;
      this.initialLearntCards = leitnerSet.studySession.learnedCards.length;

    // if it is the first study session
    } else if (leitnerSet.leitnerCards.filter((c) => c.box === 1).length === leitnerSet.leitnerCards.length) {
      const newCards = leitnerSet.leitnerCards.filter((c) => c.box === 1);
      this.cards.push(...newCards.slice(0, leitnerSet.cardsPerSession));

      await this.leitnerSetsService.updateLeitnerSet({
        setId: leitnerSet.setId,
        unlearnedCards: this.cards.map((c) => c.cardId),
        studySessionStartedAt: new Date()
      });
    // if this is not the first study session
    } else {
      const halfOfCardsPerSession = Math.floor((leitnerSet.cardsPerSession / 2));

      const newCards = leitnerSet.leitnerCards.filter((c) => c.box === 1);
      const existingCards = leitnerSet.leitnerCards.filter((c) =>
        Math.abs(new Date().getTime() - new Date(c.due).getTime()) / 36e5 < 30
      );

      if (newCards.length > halfOfCardsPerSession) {
        this.cards.push(...newCards.slice(0, halfOfCardsPerSession));
      } else if (newCards.length > 0) {
        this.cards.push(...newCards);
      }

      this.cards.push(...existingCards.slice(0, leitnerSet.cardsPerSession - halfOfCardsPerSession));
    }

    this.side = leitnerSet.answerWith.toLowerCase();
    this.sideText = this.cards[this.index].card[leitnerSet.answerWith.toLowerCase() as keyof Card] as string;

    this.loaded = true;
  }
}
