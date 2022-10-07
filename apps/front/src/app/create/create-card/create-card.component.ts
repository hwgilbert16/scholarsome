import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { AlertComponent } from "../../shared/alert/alert.component";

@Component({
  selector: 'scholarsome-create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.scss'],
})
export class CreateCardComponent {
  @Input() cardIndex: number;
  @Input() upArrow = true;
  @Input() downArrow = true;

  @Output() deleteCardEvent = new EventEmitter<number>();
  @Output() moveCardEvent = new EventEmitter<{ index: number, direction: number }>();

  @ViewChild('term', { static: false }) termElement: ElementRef;
  @ViewChild('definition', { static: false }) definitionElement: ElementRef;
  @ViewChild('inputsContainer', { static: false, read: ViewContainerRef }) inputsContainer: ViewContainerRef;

  get term() {
    return this.termElement.nativeElement.value;
  }

  get definition() {
    return this.definitionElement.nativeElement.value;
  }

  deleteCard() {
    this.deleteCardEvent.emit(this.cardIndex);
  }

  notifyEmptyInput() {
    const alert = this.inputsContainer.createComponent<AlertComponent>(AlertComponent);

    alert.instance.message = 'Both fields cannot be empty';
    alert.instance.type = 'danger';
    alert.instance.dismiss = true;
  }

  moveCard(direction: number) {
    this.moveCardEvent.emit({ index: this.cardIndex, direction });
  }
}
