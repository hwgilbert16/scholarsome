import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'scholarsome-study-set-card',
  templateUrl: './study-set-card.component.html',
  styleUrls: ['./study-set-card.component.scss'],
})
export class StudySetCardComponent {
  constructor() {}

  @Input() title: string;
  @Input() description: string;
  @Input() id: string;
}
