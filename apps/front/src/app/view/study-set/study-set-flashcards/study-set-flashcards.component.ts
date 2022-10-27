import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { SetsService } from "../../../shared/http/sets.service";
import {ActivatedRoute, Router} from "@angular/router";
import { StudySetFlashcardComponent } from "./study-set-flashcard/study-set-flashcard.component";

@Component({
  selector: 'scholarsome-study-set-flashcards',
  templateUrl: './study-set-flashcards.component.html',
  styleUrls: ['./study-set-flashcards.component.scss'],
})
export class StudySetFlashcardsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private sets: SetsService,
    private router: Router
  ) {}

  @ViewChild('spinner', { static: true }) spinner: ElementRef;
  @ViewChild('container', { static: true, read: ViewContainerRef }) container: ViewContainerRef;

  async ngOnInit(): Promise<void> {
    const setId = this.route.snapshot.paramMap.get('setId');
    if (!setId) {
      await this.router.navigate(['404']);
      return;
    }

    const set = await this.sets.set(setId);
    if (!set) {
      await this.router.navigate(['404']);
      return;
    }

    this.spinner.nativeElement.remove();
    this.container.element.nativeElement.removeAttribute('hidden');

    for (const card of set.cards) {
      const cardComponent = this.container.createComponent<StudySetFlashcardComponent>(StudySetFlashcardComponent);
      cardComponent.instance.term = card.term;
      cardComponent.instance.definition = card.definition;
    }
  }

}
