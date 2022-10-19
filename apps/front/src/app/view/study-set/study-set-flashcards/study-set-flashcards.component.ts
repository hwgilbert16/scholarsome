import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'scholarsome-study-set-flashcards',
  templateUrl: './study-set-flashcards.component.html',
  styleUrls: ['./study-set-flashcards.component.scss'],
})
export class StudySetFlashcardsComponent implements OnInit {
  constructor() {}

  @ViewChild('spinner', { static: true }) spinner: ElementRef;

  ngOnInit(): void {
    this.spinner.nativeElement.remove();
  }

}
