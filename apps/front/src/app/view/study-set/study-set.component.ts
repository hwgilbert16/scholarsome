import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'scholarsome-study-set',
  templateUrl: './study-set.component.html',
  styleUrls: ['./study-set.component.scss'],
})
export class StudySetComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  setId: string | null;

  ngOnInit(): void {
    this.setId = this.route.snapshot.paramMap.get('setId');
  }
}
