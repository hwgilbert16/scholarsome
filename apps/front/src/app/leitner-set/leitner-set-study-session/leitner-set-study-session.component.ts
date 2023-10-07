import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LeitnerSetsService } from "../../shared/http/leitner-sets.service";
import { LeitnerCard } from "@scholarsome/shared";
import { DomSanitizer } from "@angular/platform-browser";
import { Card } from "@prisma/client";
import { LeitnerCardsService } from "../../shared/http/leitner-cards.service";

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
  // What the user answers with
  protected answer: "definition" | "term";

  // Whether the page has been loaded
  loaded = false;

  // The current index
  protected index = 0;
  // The current card
  protected currentCard: LeitnerCard;
  // The current side being shown
  protected side: string;
  // The text being shown to the user
  protected sideText = "";
  // Displayed in bottom right showing the progress
  protected remainingCards = "";

  // Whether the card has been flipped or not
  protected flipped = false;
  // Whether the first flip interaction has been made
  // needed to prevent animation classes from being applied until first click
  protected flipInteraction = false;

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
    await this.leitnerCardsService.updateLeitnerCard({
      cardId: this.currentCard.cardId,
      box: this.currentCard.box + 1,
      learned: true
    });
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

    this.loaded = true;
    leitnerSet.leitnerCards = leitnerSet.leitnerCards.sort(() => 0.5 - Math.random());

    const halfOfCardsPerSession = Math.floor((leitnerSet.cardsPerSession / 2));

    // if there is an existing study session started today
    if (
      leitnerSet.studySession &&
      (new Date(leitnerSet.studySession.startedAt).toDateString() == new Date().toDateString())
    ) {
      for (const learnedCard of leitnerSet.studySession.learnedCards) {
        this.cards.push(learnedCard.leitnerCard);
      }
    // if a study session has not already been started
    } else {
      const newCards = leitnerSet.leitnerCards.filter((c) => c.box === 1);
      const seenCards = leitnerSet.leitnerCards.filter((c) => c.box > 1);

      if (newCards.length > halfOfCardsPerSession) {
        this.cards.push(...newCards.slice(0, halfOfCardsPerSession));
      } else if (newCards.length > 0) {
        this.cards.push(...newCards);
      }

      this.cards.push(...seenCards.slice(0, leitnerSet.cardsPerSession - halfOfCardsPerSession));

      await this.leitnerSetsService.updateLeitnerSet({
        setId: leitnerSet.setId,
        unlearnedCards: this.cards.map((c) => c.cardId)
      });
    }

    this.sideText = this.cards[0].card[leitnerSet.answerWith.toLowerCase() as keyof Card] as string;
    this.currentCard = this.cards[0];
  }
}
