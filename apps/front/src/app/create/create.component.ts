import { Component, ComponentRef, OnInit, ViewChild } from '@angular/core';
import { CreateCardDirective } from "./create-card/create-card.directive";
import { CreateCardComponent } from "./create-card/create-card.component";

@Component({
  selector: 'scholarsome-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  @ViewChild(CreateCardDirective, { static: true }) cardList: CreateCardDirective;

  cards: { component: ComponentRef<CreateCardComponent>, index: number }[] = [];

  updateCardIndices() {
    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i - 1]) {
        this.cards[i].component.instance.cardIndex = this.cards[i - 1].component.instance.cardIndex + 1;
      }
    }
  }

  addCard() {
    const card = this.cardList.viewContainerRef.createComponent<CreateCardComponent>(CreateCardComponent);
    card.instance.cardIndex = this.cardList.viewContainerRef.length;

    card.instance.deleteCardEvent.subscribe(e => {
      if (this.cardList.viewContainerRef.length > 1) {
        this.cardList.viewContainerRef.get(e - 1)?.destroy();

        this.cards.splice(this.cards.map(c => c.index).indexOf(e), 1);

        this.updateCardIndices();
      }
    });

    card.instance.moveCardEvent.subscribe(e => {
      if (this.cardList.viewContainerRef.length > 1) {
        const arrIndex = this.cards.map(c => c.index).indexOf(e.index);
        const moveCard = this.cards[arrIndex];

        this.cardList.viewContainerRef.move(moveCard.component.hostView, (e.index - 1) + e.direction);
      }
    })

    this.cards.push({
      component: card,
      index: this.cardList.viewContainerRef.length
    });

    this.updateCardIndices();
  }

  ngOnInit() {
    this.addCard();
  }
}
