import { Component, OnInit } from '@angular/core';
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

  setId: string | null;

  async ngOnInit(): Promise<void> {
    this.setId = this.route.snapshot.paramMap.get('setId');

    const set = await lastValueFrom(this.http.get<SetWithRelations>('/api/sets/' + this.setId));

    console.log(set);
  }
}
