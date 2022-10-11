import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'scholarsome-view-study-sets',
  templateUrl: './view-study-sets.component.html',
  styleUrls: ['./view-study-sets.component.scss'],
})
export class ViewStudySetsComponent implements OnInit {
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  setId: string | null;

  ngOnInit(): void {
    this.setId = this.route.snapshot.paramMap.get('setId');
  }
}
