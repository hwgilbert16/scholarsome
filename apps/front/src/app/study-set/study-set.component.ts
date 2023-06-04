import { Component, ComponentRef, ElementRef, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Set } from "@scholarsome/shared";
import { SetsService } from "../shared/http/sets.service";
import { CardComponent } from "../shared/card/card.component";
import { UsersService } from "../shared/http/users.service";
import { Meta, Title } from "@angular/platform-browser";

@Component({
  selector: "scholarsome-study-set",
  templateUrl: "./study-set.component.html",
  styleUrls: ["./study-set.component.scss"]
})
export class StudySetComponent implements OnInit {
  /**
   * @ignore
   */
  constructor(
    private readonly route: ActivatedRoute,
    private readonly sets: SetsService,
    private readonly users: UsersService,
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly metaService: Meta
  ) {}

  @ViewChild("spinner", { static: true }) spinner: ElementRef;
  @ViewChild("container", { static: true }) container: ElementRef;
  @ViewChild("editButton", { static: true }) editButton: ElementRef;
  @ViewChild("cardsContainer", { static: true, read: ViewContainerRef }) cardsContainer: ViewContainerRef;
  @ViewChild("privateCheck", { static: false }) privateCheck: ElementRef;
  @ViewChild("editDescription", { static: false }) editDescription: ElementRef;

  userIsAuthor = false;
  isEditing = false;
  setId: string | null;

  author: string;

  cards: ComponentRef<CardComponent>[] = [];
  set: Set;

  deleteClicked = false;

  cookieExists(name: string): boolean {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      if (cookie.includes(name)) {
        return true;
      }
    }

    return false;
  }

  updateCardIndices() {
    for (let i = 0; i < this.cards.length; i++) {
      this.cards[i].instance.cardIndex = i;

      this.cards[i].instance.upArrow = i !== 0;
      this.cards[i].instance.downArrow = this.cards.length - 1 !== i;
      this.cards[i].instance.trashCan = this.cards.length > 1;
    }
  }

  addCard(opts: {
    id?: string;
    index?: number;
    editingEnabled: boolean;
    upArrow?: boolean;
    downArrow?: boolean;
    trashCan?: boolean;
    term?: string;
    definition?: string;
  }) {
    const card = this.cardsContainer.createComponent<CardComponent>(CardComponent);

    card.instance.cardId = opts.id ? opts.id : "";
    card.instance.cardIndex = opts.index ? opts.index : this.cards.length;
    card.instance.editingEnabled = opts.editingEnabled;
    card.instance.upArrow = opts.upArrow ? opts.upArrow : false;
    card.instance.downArrow = opts.downArrow ? opts.downArrow : false;
    card.instance.trashCan = opts.trashCan ? opts.trashCan : false;
    card.instance.termValue = opts.term ? opts.term : "";
    card.instance.definitionValue = opts.definition ? opts.definition : "";

    card.instance.deleteCardEvent.subscribe((e) => {
      if (this.cardsContainer.length > 1) {
        this.cardsContainer.get(e)?.destroy();

        this.cards.splice(this.cards.map((c) => c.instance.cardIndex).indexOf(e), 1);

        this.updateCardIndices();
      }
    });

    card.instance.moveCardEvent.subscribe((e) => {
      if (this.cardsContainer.length > 1) {
        this.cards.splice(card.instance.cardIndex + e.direction, 0, this.cards.splice(card.instance.cardIndex, 1)[0]);

        this.cardsContainer.move(card.hostView, e.index + e.direction);
        card.instance.cardIndex = e.index + e.direction;

        this.updateCardIndices();
      }
    });

    this.cards.push(card);
    this.updateCardIndices();
  }

  editCards() {
    this.isEditing = true;

    for (const [i, card] of this.cards.entries()) {
      card.instance.editingEnabled = true;
      card.instance.cardIndex = i;

      card.instance.upArrow = i !== 0;
      card.instance.downArrow = this.cards.length - 1 !== i;
      card.instance.trashCan = this.cards.length > 1;
    }
  }

  async saveCards() {
    if (this.set) {
      for (const card of this.cards) {
        if (card.instance.term.length < 1 || card.instance.definition.length < 1) {
          return card.instance.notifyEmptyInput();
        }
      }

      this.isEditing = false;

      for (const card of this.cards) {
        card.instance.editingEnabled = false;
        card.instance.termValue = card.instance.term;
        card.instance.definitionValue = card.instance.definition;
      }

      this.set.description = this.editDescription.nativeElement.value;

      await this.sets.updateSet({
        id: this.set.id,
        description: this.editDescription.nativeElement.value,
        private: this.privateCheck.nativeElement.checked,
        cards: this.cards.map((c) => {
          return {
            id: c.instance.cardId,
            index: c.instance.cardIndex,
            term: c.instance.term,
            definition: c.instance.definition
          };
        })
      });
    }
  }

  viewCards() {
    this.isEditing = false;

    this.cards = [];
    this.cardsContainer.clear();

    if (this.set) {
      // sort the cards by index
      for (const card of this.set.cards.sort((a, b) => {
        return a.index - b.index;
      })) {
        this.addCard({
          id: card.id,
          index: card.index,
          editingEnabled: false,
          term: card.term,
          definition: card.definition
        });
      }
    }
  }

  async deleteSet() {
    await this.sets.deleteSet(this.set.id);
    await this.router.navigate(["homepage"]);
  }

  async ngOnInit(): Promise<void> {
    this.setId = this.route.snapshot.paramMap.get("setId");
    if (!this.setId) {
      this.router.navigate(["404"]);
      return;
    }

    const set = await this.sets.set(this.setId);
    if (!set) {
      this.router.navigate(["404"]);
      return;
    }

    this.titleService.setTitle(set.title + " — Scholarsome");

    let description = "Studying done the correct way on Scholarsome — ";

    const firstThree = set.cards.slice(0, 3);

    for (const card of firstThree) {
      description += card.term.replace(/(\r\n|\n|\r)/gm, "") + " " + card.definition.replace(/(\r\n|\n|\r)/gm, "") + ". ";
    }

    this.metaService.addTag({ name: "description", content: description });

    const user = await this.users.user("self");

    this.set = set;

    if (user && user.id === set.authorId) this.userIsAuthor = true;

    this.spinner.nativeElement.remove();

    this.author = this.set.author.username;
    this.container.nativeElement.removeAttribute("hidden");

    this.viewCards();
  }
}
