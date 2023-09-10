import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LeitnerSetsService } from "../../shared/http/leitner-sets.service";
import { Card, LeitnerCard } from "@prisma/client";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "scholarsome-leitner-set-study-session",
  templateUrl: "./leitner-set-study-session.component.html",
  styleUrls: ["./leitner-set-study-session.component.scss"]
})
export class LeitnerSetStudySessionComponent implements OnInit {
  constructor(
    private readonly leitnerSetsService: LeitnerSetsService,
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
        this.sideText = this.cards[this.index].definition;
        this.side = "definition";
      } else {
        this.sideText = this.cards[this.index].term;
        this.side = "term";
      }
    }, 150);
  }

  nextCard(type: number) {

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

    // if this is the first study session
    if (leitnerSet.leitnerCards.filter((c) => c.box !== 1).length == 0) {
      this.cards = leitnerSet.leitnerCards.slice(0, halfOfCardsPerSession);
    } else {
      const newCards = leitnerSet.leitnerCards.filter((c) => c.box === 1);
      const seenCards = leitnerSet.leitnerCards.filter((c) => c.box > 1);

      if (newCards.length > halfOfCardsPerSession) {
        this.cards.push(...newCards.slice(0, halfOfCardsPerSession));
      } else if (newCards.length > 0) {
        this.cards.push(...newCards);
      }

      this.cards.push(...seenCards.slice(0, leitnerSet.cardsPerSession - halfOfCardsPerSession));
    }

    this.sideText = this.cards[0][leitnerSet.answerWith.toLowerCase() as keyof LeitnerCard] as string;
    this.currentCard = this.cards[0];
  }
}
