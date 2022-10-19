import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import type { SetWithRelations } from "@scholarsome/api-interfaces";
import { StudySetCardComponent } from "./study-set-card/study-set-card.component";
import { SetsService } from "../../shared/http/sets.service";

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

  @ViewChild('cards', { static: true, read: ViewContainerRef }) cardsContainer: ViewContainerRef;

  title: string;
  author: string;
  setId: string | null;

  setLength: number;
  set: SetWithRelations | undefined;

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

    this.title = this.set.title;
    this.author = this.set.author.username;
    this.setLength = this.set.cards.length;
    this.container.nativeElement.removeAttribute('hidden');

    for (const card of this.set.cards) {
      const cardComponent = this.cardsContainer.createComponent<StudySetCardComponent>(StudySetCardComponent);

      cardComponent.instance.term = card.term;
      cardComponent.instance.definition = card.definition;
    }
  }
}
