import { Component, ComponentRef, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import type { SetWithRelations } from "@scholarsome/api-interfaces";
import { StudySetCardComponent } from "./study-set-card/study-set-card.component";
import { SetsService } from "../../shared/http/sets.service";
import { Card } from '@prisma/client';
import { CreateCardComponent } from "../../create/study-set/create-card/create-card.component";

@Component({
  selector: 'scholarsome-view-study-sets',
  templateUrl: './view-study-sets.component.html',
  styleUrls: ['./view-study-sets.component.scss'],
})
export class ViewStudySetsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private sets: SetsService,
    private router: Router
  ) {}

  @ViewChild('spinner', { static: true }) spinner: ElementRef;
  @ViewChild('container', { static: true }) container: ElementRef;

  @ViewChild('editButton', { static: true }) editButton: ElementRef;

  @ViewChild('cardsContainer', { static: true, read: ViewContainerRef }) cardsContainer: ViewContainerRef;

  author: string;
  setId: string | null;

  cards: Card[] = [];
  editableCards: ComponentRef<CreateCardComponent>[] = [];

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

  viewCards() {
    this.editableCards = [];
    this.cards = [];
    this.cardsContainer.clear();

    if (this.set && this.set.cards) {
      for (const card of this.set.cards) {
        const cardComponent = this.cardsContainer.createComponent<StudySetCardComponent>(StudySetCardComponent);

        cardComponent.instance.term = card.term;
        cardComponent.instance.definition = card.definition;

        this.cards.push(card);
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

    this.spinner.nativeElement.remove();

    this.author = this.set.author.username;
    this.container.nativeElement.removeAttribute('hidden');

    this.viewCards();
  }
}
