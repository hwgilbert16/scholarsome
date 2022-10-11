import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { StudySetCardComponent } from "./study-set-card/study-set-card.component";
import { Set } from "@prisma/client";

@Component({
  selector: 'scholarsome-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  constructor(private http: HttpClient) {}

  @ViewChild('cards', { static: true, read: ViewContainerRef }) cardContainer: ViewContainerRef;

  async ngOnInit(): Promise<void> {
    const sets: Set[] = Object.values(await lastValueFrom(this.http.get('/api/sets/user/self')));

    for (const set of sets) {
      const setCard = this.cardContainer.createComponent<StudySetCardComponent>(StudySetCardComponent);

      setCard.instance.title = set.title;
      setCard.instance.description = set.description ? set.description : '';
      setCard.instance.id = set.id;
    }
  }
}
