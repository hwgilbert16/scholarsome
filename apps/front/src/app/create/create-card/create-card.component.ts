import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'scholarsome-create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.scss'],
})
export class CreateCardComponent {
  @Input() cardIndex: number;
  @Output() deleteCardEvent = new EventEmitter<number>();
  @Output() moveCardEvent = new EventEmitter<any>();

  deleteCard() {
    this.deleteCardEvent.emit(this.cardIndex);
  }

  moveCard(direction: number) {
    this.moveCardEvent.emit({ index: this.cardIndex, direction });
  }
}
