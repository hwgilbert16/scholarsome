import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import type { SetWithRelations } from "@scholarsome/api-interfaces";
import { StudySetCardComponent } from "./study-set-card/study-set-card.component";

@Component({
  selector: 'scholarsome-view-study-sets',
  templateUrl: './view-study-sets.component.html',
  styleUrls: ['./view-study-sets.component.scss'],
})
export class ViewStudySetsComponent implements OnInit {
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  @ViewChild('spinner', { static: true }) spinner: ElementRef;
  @ViewChild('container', { static: true }) container: ElementRef;

  @ViewChild('cards', { static: true, read: ViewContainerRef }) cardsContainer: ViewContainerRef;

  title: string;
  author: string;

  setLength: number;
  set: SetWithRelations;

  async ngOnInit(): Promise<void> {
    const setId = this.route.snapshot.paramMap.get('setId');

    const set = await lastValueFrom(this.http.get<SetWithRelations>('/api/sets/' + setId));

    this.spinner.nativeElement.remove();

    this.title = set.title;
    this.author = set.author.username;
    this.setLength = set.cards.length;
    this.set = set;
    this.container.nativeElement.removeAttribute('hidden');

    for (const card of set.cards) {
      const cardComponent = this.cardsContainer.createComponent<StudySetCardComponent>(StudySetCardComponent);

      cardComponent.instance.term = card.term;
      cardComponent.instance.definition = card.definition;
    }
  }
}
