import {
  Component,
  ComponentRef,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Set } from "@scholarsome/shared";
import { SetsService } from "../shared/http/sets.service";
import { CardComponent } from "../shared/card/card.component";
import { UsersService } from "../shared/http/users.service";
import { Meta, Title } from "@angular/platform-browser";
import { faChartLine, faGamepad } from "@fortawesome/free-solid-svg-icons";
import { Card } from "@prisma/client";

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

  protected userIsAuthor = false;
  protected isEditing = false;
  protected setId: string | null;

  protected author: string;

  protected scrollIndex = 1;

  protected cards: Card[];
  protected cardComponents: ComponentRef<CardComponent>[] = [];
  protected set: Set;

  protected uploadTooLarge = false;

  protected deleteClicked = false;

  protected scrollObserver: IntersectionObserver;

  protected readonly faChartLine = faChartLine;
  protected readonly faGamepad = faGamepad;

  updateCardIndices() {
    for (let i = 0; i < this.cardComponents.length; i++) {
      this.cardComponents[i].instance.cardIndex = i;

      this.cardComponents[i].instance.upArrow = i !== 0;
      this.cardComponents[i].instance.downArrow = this.cardComponents.length - 1 !== i;
      this.cardComponents[i].instance.trashCan = this.cardComponents.length > 1;
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
    card.instance.cardIndex = opts.index ? opts.index : this.cardComponents.length;
    card.instance.editingEnabled = opts.editingEnabled;
    card.instance.upArrow = opts.upArrow ? opts.upArrow : false;
    card.instance.downArrow = opts.downArrow ? opts.downArrow : false;
    card.instance.trashCan = opts.trashCan ? opts.trashCan : false;
    card.instance.termValue = opts.term ? opts.term : "";
    card.instance.definitionValue = opts.definition ? opts.definition : "";

    card.instance.deleteCardEvent.subscribe((e) => {
      if (this.cardsContainer.length > 1) {
        this.cardsContainer.get(e)?.destroy();

        this.cardComponents.splice(this.cardComponents.map((c) => c.instance.cardIndex).indexOf(e), 1);

        this.updateCardIndices();
      }
    });

    card.instance.moveCardEvent.subscribe((e) => {
      if (this.cardsContainer.length > 1) {
        this.cardComponents.splice(card.instance.cardIndex + e.direction, 0, this.cardComponents.splice(card.instance.cardIndex, 1)[0]);

        this.cardsContainer.move(card.hostView, e.index + e.direction);
        card.instance.cardIndex = e.index + e.direction;

        this.updateCardIndices();
      }
    });

    card.instance.addCardEvent.subscribe(() => {
      this.addCard({ editingEnabled: true });
    });

    this.cardComponents.push(card);
    this.updateCardIndices();
  }

  editCards() {
    this.isEditing = true;

    for (const [i, card] of this.cardComponents.entries()) {
      card.instance.editingEnabled = true;
      card.instance.cardIndex = i;

      card.instance.upArrow = i !== 0;
      card.instance.downArrow = this.cardComponents.length - 1 !== i;
      card.instance.trashCan = this.cardComponents.length > 1;
    }
  }

  async saveCards() {
    if (this.set) {
      for (const card of this.cardComponents) {
        if (card.instance.term.length < 1 || card.instance.definition.length < 1) {
          return card.instance.notifyEmptyInput();
        }
      }

      this.isEditing = false;

      for (const card of this.cardComponents) {
        card.instance.editingEnabled = false;
        card.instance.termValue = card.instance.term;
        card.instance.definitionValue = card.instance.definition;
      }

      this.set.description = this.editDescription.nativeElement.value;

      const updated = await this.sets.updateSet({
        id: this.set.id,
        description: this.editDescription.nativeElement.value,
        private: this.privateCheck.nativeElement.checked,
        cards: this.cardComponents.map((c) => {
          return {
            id: c.instance.cardId,
            index: c.instance.cardIndex,
            term: c.instance.term,
            definition: c.instance.definition
          };
        })
      });

      if (updated === "tooLarge") {
        this.uploadTooLarge = true;
        return;
      }
      if (!updated) return;
      this.set = updated;

      for (let i = 0; i < updated.cards.length; i++) {
        this.cardComponents[i].instance.cardId = updated.cards[i].id;
      }

      this.viewCards();
    }
  }

  scrollCards() {
    this.scrollIndex++;
    this.cards = this.set.cards.slice(0, this.scrollIndex * 20);
    console.log(this.cards);
    this.viewCards();
  }

  viewCards() {
    this.isEditing = false;

    this.cardComponents = [];
    this.cardsContainer.clear();

    for (const card of this.cards) {
      this.addCard({
        id: card.id,
        index: card.index,
        editingEnabled: false,
        term: card.term,
        definition: card.definition
      });

      if (this.cardComponents.length === 15 * this.scrollIndex) {
        this.scrollObserver = new IntersectionObserver((entries)=>{
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.scrollObserver.disconnect();
              this.scrollCards();
            }
          });
        });

        this.scrollObserver.observe(this.cardComponents[14 * this.scrollIndex].location.nativeElement);
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
    this.set.cards = this.set.cards.sort((a, b) => {
      return a.index - b.index;
    });

    if (user && user.id === set.authorId) this.userIsAuthor = true;

    this.spinner.nativeElement.remove();

    this.author = this.set.author.username;
    this.container.nativeElement.removeAttribute("hidden");

    this.cards = this.set.cards.slice(0, 20);
    this.viewCards();
  }
}
