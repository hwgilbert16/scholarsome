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
      this.cards[i].component.instance.cardIndex = i;
      this.cards[i].index = i;

      this.cards[i].component.instance.upArrow = i !== 0;
      this.cards[i].component.instance.downArrow = this.cards.length - 1 !== i;
    }
  }

  addCard() {
    const card = this.cardList.viewContainerRef.createComponent<CreateCardComponent>(CreateCardComponent);
    card.instance.cardIndex = this.cardList.viewContainerRef.length - 1;

    card.instance.deleteCardEvent.subscribe(e => {
      if (this.cardList.viewContainerRef.length > 1) {
        this.cardList.viewContainerRef.get(e)?.destroy();

        this.cards.splice(this.cards.map(c => c.index).indexOf(e), 1);

        this.updateCardIndices();
      }
    });

    card.instance.moveCardEvent.subscribe(e => {
      if (this.cardList.viewContainerRef.length > 1) {
        const cardIndex = this.cards.map(c => c.index).indexOf(e.index);

        this.cardList.viewContainerRef.move(this.cards[cardIndex].component.hostView, e.index + e.direction);

        this.cards[this.cards.map(c => c.index).indexOf(e.index + e.direction)].index = e.index;
        this.cards[cardIndex].index = e.index + e.direction;

        this.cards.sort((a, b) => a.index - b.index);

        this.updateCardIndices();
      }
    });

    this.cards.push({
      component: card,
      index: this.cardList.viewContainerRef.length - 1
    });

    this.updateCardIndices();
  }

  ngOnInit() {
    this.addCard();
  }
}
