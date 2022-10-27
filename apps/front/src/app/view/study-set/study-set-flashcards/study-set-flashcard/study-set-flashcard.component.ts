import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'scholarsome-study-set-flashcard',
  templateUrl: './study-set-flashcard.component.html',
  styleUrls: ['./study-set-flashcard.component.scss']
})
export class StudySetFlashcardComponent {
  constructor() {}

  @Input() term: string;
  @Input() definition: string;

  // @ViewChild('body', { static: true }) body: ElementRef;
}
