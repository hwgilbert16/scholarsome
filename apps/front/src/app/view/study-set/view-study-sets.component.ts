import { Component, ComponentRef, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import type { SetWithRelations } from "@scholarsome/api-interfaces";
import { StudySetCardComponent } from "./study-set-card/study-set-card.component";
import { SetsService } from "../../shared/http/sets.service";
import { Card } from '@prisma/client';
import { CreateCardComponent } from "../../create/study-set/create-card/create-card.component";
import { CardComponent } from "../../shared/card/card.component";
import { UsersService } from "../../shared/http/users.service";

@Component({
  selector: 'scholarsome-view-study-sets',
  templateUrl: './view-study-sets.component.html',
  styleUrls: ['./view-study-sets.component.scss']
})
export class ViewStudySetsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private sets: SetsService,
    private users: UsersService,
    private router: Router
  ) {}

  @ViewChild('spinner', { static: true }) spinner: ElementRef;
  @ViewChild('container', { static: true }) container: ElementRef;

  @ViewChild('editButton', { static: true }) editButton: ElementRef;

  @ViewChild('cardsContainer', { static: true, read: ViewContainerRef }) cardsContainer: ViewContainerRef;

  userIsAuthor = false;
  editing = false;

  setId: string | null;
  author: string;

  cards: ComponentRef<CardComponent>[] = [];

  set: SetWithRelations | null;

  cookieExists(name: string): boolean {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      if (cookie.includes(name)) {
        return true;
      }
    }

    return false;
  }

  updateCardIndices() {
    for (let i = 0; i < this.cards.length; i++) {
      this.cards[i].instance.cardIndex = i;

      this.cards[i].instance.upArrow = i !== 0;
      this.cards[i].instance.downArrow = this.cards.length - 1 !== i;
    }
  }

  addCard(opts: {
    index: number;
    editingEnabled: boolean;
    upArrow: boolean;
    downArrow: boolean;
    term: string;
    definition: string;
  }) {
    const card = this.cardsContainer.createComponent<CardComponent>(CardComponent);

    card.instance.cardIndex = opts.index;
    card.instance.editingEnabled = opts.editingEnabled;
    card.instance.upArrow = opts.upArrow;
    card.instance.downArrow = opts.downArrow;
    card.instance.termValue = opts.term;
    card.instance.definitionValue = opts.definition;

    card.instance.deleteCardEvent.subscribe(e => {
      if (this.cardsContainer.length > 1) {
        this.cardsContainer.get(e)?.destroy();

        this.cards.splice(this.cards.map(c => c.instance.cardIndex).indexOf(e), 1);

        this.updateCardIndices();
      }
    });

    card.instance.moveCardEvent.subscribe(e => {
      if (this.cardsContainer.length > 1) {
        this.cards.splice(card.instance.cardIndex + e.direction, 0, this.cards.splice(card.instance.cardIndex, 1)[0]);

        this.cardsContainer.move(card.hostView, e.index + e.direction);
        card.instance.cardIndex = e.index + e.direction;

        this.updateCardIndices();
      }
    });

    this.cards.push(card);
  }

  editCards() {
    this.editing = true;

    for (const [i, card] of this.cards.entries()) {
      card.instance.editingEnabled = true;
      card.instance.cardIndex = i;

      card.instance.deleteCardEvent.subscribe(e => {
        if (this.cardsContainer.length > 1) {
          this.cardsContainer.get(e)?.destroy();

          this.cards.splice(this.cards.map(c => c.instance.cardIndex).indexOf(e), 1);

          this.updateCardIndices();
        }
      });

      card.instance.moveCardEvent.subscribe(e => {
        if (this.cardsContainer.length > 1) {
          this.cards.splice(card.instance.cardIndex + e.direction, 0, this.cards.splice(card.instance.cardIndex, 1)[0]);

          this.cardsContainer.move(card.hostView, e.index + e.direction);
          card.instance.cardIndex = e.index + e.direction;

          this.updateCardIndices();
        }
      });

      card.instance.upArrow = i !== 0;
      card.instance.downArrow = this.cards.length - 1 !== i;
    }
  }

  viewCards() {
    this.editing = false;

    this.cards = [];
    this.cardsContainer.clear();

    if (this.set) {
      for (const card of this.set.cards) {
        const cardComponent = this.cardsContainer.createComponent<CardComponent>(CardComponent);

        cardComponent.instance.termValue = card.term;
        cardComponent.instance.definitionValue = card.definition;

        this.cards.push(cardComponent);
      }
    }
  }

  async ngOnInit(): Promise<void> {
    this.setId = this.route.snapshot.paramMap.get('setId');
    if (!this.setId) {
      await this.router.navigate(['404']);
      return;
    }

    this.set = await this.sets.set(this.setId);
    if (!this.set) {
      await this.router.navigate(['404']);
      return;
    }

    if (this.cookieExists('authenticated')) {
      const user = await this.users.user('self');

      if (user && user.id === this.set.author.id) {
        this.userIsAuthor = true;
      }
    }

    this.spinner.nativeElement.remove();

    this.author = this.set.author.username;
    this.container.nativeElement.removeAttribute('hidden');

    this.viewCards();
  }
}
