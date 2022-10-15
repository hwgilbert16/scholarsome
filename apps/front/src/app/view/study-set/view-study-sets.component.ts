import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import type { SetWithRelations } from "@scholarsome/api-interfaces";

@Component({
  selector: 'scholarsome-view-study-sets',
  templateUrl: './view-study-sets.component.html',
  styleUrls: ['./view-study-sets.component.scss'],
})
export class ViewStudySetsComponent implements OnInit {
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  @ViewChild('spinner', { static: true }) spinner: ElementRef;

  setId: string | null;

  title: string;
  author: string;

  async ngOnInit(): Promise<void> {
    this.setId = this.route.snapshot.paramMap.get('setId');

    const set = await lastValueFrom(this.http.get<SetWithRelations>('/api/sets/' + this.setId));

    this.spinner.nativeElement.remove();

    this.title = set.title;
    this.author = set.author.username;
    // this.container.nativeElement.removeAttribute('hidden');

    console.log(set.authorId);
  }
}
