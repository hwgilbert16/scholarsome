import { Component, ComponentRef, OnInit, ViewChild } from '@angular/core';
import { CreateCardDirective } from "./create-card/create-card.directive";
import { CreateCardComponent } from "./create-card/create-card.component";
import {
  textSpanIntersectsWithPosition
} from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";

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
      // if (this.cards[i].index === 0) {
      //   this.cards[i].component.instance.cardIndex = 0;
      // } else {
      //   this.cards[i].component.instance.cardIndex = this.cards[i - 1].index + 1;
      //   this.cards[i].index = this.cards[i - 1].index + 1;
      // }
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
        const swappedIndex = this.cards.map(c => c.index).indexOf(e.index + e.direction);

        this.cardList.viewContainerRef.move(this.cards[cardIndex].component.hostView, e.index + e.direction);

        const f = this.cards.splice(cardIndex, swappedIndex)[0];
        this.cards.splice(swappedIndex, 0, f);

        this.cards[swappedIndex].index = e.index;
        this.cards[cardIndex].index = e.index + e.direction;

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
