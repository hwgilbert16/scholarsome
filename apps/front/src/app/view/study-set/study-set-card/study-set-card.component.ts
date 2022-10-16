import { Component, Input } from '@angular/core';

@Component({
  selector: 'scholarsome-study-set-card',
  templateUrl: './study-set-card.component.html',
  styleUrls: ['./study-set-card.component.scss'],
})
export class StudySetCardComponent {
  constructor() {}

  @Input() term: string;
  @Input() definition: string;
}
