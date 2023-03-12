import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { AlertComponent } from "../alert/alert.component";

@Component({
  selector: 'scholarsome-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() editingEnabled = false;

  @Input() cardId: string;
  @Input() cardIndex: number;

  @Input() upArrow = true;
  @Input() downArrow = true;

  @Input() termValue?: string;
  @Input() definitionValue?: string;

  @Output() deleteCardEvent = new EventEmitter<number>();
  @Output() moveCardEvent = new EventEmitter<{ index: number, direction: number }>();

  @ViewChild('term', { static: false }) termElement: ElementRef;
  @ViewChild('definition', { static: false }) definitionElement: ElementRef;
  @ViewChild('inputsContainer', { static: false, read: ViewContainerRef }) inputsContainer: ViewContainerRef;

  get term(): string {
    return this.termElement.nativeElement.value;
  }

  get definition(): string {
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
    alert.instance.spacingClass = 'mt-4';
  }

  moveCard(direction: number) {
    this.moveCardEvent.emit({ index: this.cardIndex, direction });
  }
}
