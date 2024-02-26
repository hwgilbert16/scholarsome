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
import { QuizletExportModalComponent } from "./quizlet-export-modal/quizlet-export-modal.component";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { faFileExport, faShareFromSquare, faPencil, faSave, faCancel, faTrashCan, faClipboard, faStar, faQ, faFileCsv, faImages } from "@fortawesome/free-solid-svg-icons";
import { ConvertingService } from "../shared/http/converting.service";

@Component({
  selector: "scholarsome-study-set",
  templateUrl: "./study-set.component.html",
  styleUrls: ["./study-set.component.scss"]
})
export class StudySetComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly users: UsersService,
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly metaService: Meta,
    private readonly setsService: SetsService,
    private readonly convertingService: ConvertingService
  ) {}

  @ViewChild("spinner", { static: true }) spinner: ElementRef;
  @ViewChild("container", { static: true }) container: ElementRef;
  @ViewChild("editButton", { static: true }) editButton: ElementRef;
  @ViewChild("cardsContainer", { static: true, read: ViewContainerRef }) cardsContainer: ViewContainerRef;
  @ViewChild("privateCheck", { static: false }) privateCheck: ElementRef;
  @ViewChild("editDescription", { static: false }) editDescription: ElementRef;
  @ViewChild("editTitle", { static: false }) editTitle: ElementRef;

  @ViewChild("quizletExportModal") quizletExportModal: QuizletExportModalComponent;

  protected userIsAuthor = false;
  protected isEditing = false;
  protected setId: string | null;

  protected author: string;

  protected cards: ComponentRef<CardComponent>[] = [];
  protected set: Set;

  protected saveInProgress = false;
  protected ankiExportInProgress = false;
  protected csvExportInProgress = false;
  protected mediaExportInProgress = false;
  protected uploadTooLarge = false;
  protected deleteClicked = false;

  // to disable clipboard button in share dropdown on non https
  protected isHttps = true;

  protected readonly faQuestionCircle = faQuestionCircle;
  protected readonly faFileExport = faFileExport;
  protected readonly faShareFromSquare = faShareFromSquare;
  protected readonly faPencil = faPencil;
  protected readonly faSave = faSave;
  protected readonly faCancel = faCancel;
  protected readonly faTrashCan = faTrashCan;
  protected readonly faClipboard = faClipboard;
  protected readonly faStar = faStar;
  protected readonly faQ = faQ;
  protected readonly faFileCsv = faFileCsv;
  protected readonly faImages = faImages;

  protected readonly navigator = navigator;
  protected readonly window = window;

  async exportSetToAnkiApkg() {
    this.ankiExportInProgress = true;

    const file = await this.convertingService.exportSetToAnkiApkg(this.set.id);
    if (!file) {
      this.ankiExportInProgress = false;
      return;
    }

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(file);
    link.download = this.set.title + ".apkg";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    this.ankiExportInProgress = false;
  }

  async exportSetToCsv() {
    this.csvExportInProgress = true;

    const file = await this.convertingService.exportSetToCsv(this.set.id);
    if (!file) {
      this.csvExportInProgress = false;
      return;
    }

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(file);
    link.download = this.set.title + ".csv";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    this.csvExportInProgress = false;
  }

  async exportSetMedia() {
    this.mediaExportInProgress = true;

    const file = await this.convertingService.exportSetMedia(this.set.id);
    if (!file) {
      this.mediaExportInProgress = false;
      return;
    }

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(file);
    link.download = this.set.title + ".zip";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    this.mediaExportInProgress = false;
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
    isSaved: boolean;
    index?: number;
    originalIndex?: number;
    editingEnabled: boolean;
    upArrow?: boolean;
    downArrow?: boolean;
    trashCan?: boolean;
    term?: string;
    definition?: string;
  }) {
    const card = this.cardsContainer.createComponent<CardComponent>(CardComponent);

    card.instance.cardId = opts.id ? opts.id : "";
    card.instance.isSaved = opts.isSaved;
    card.instance.cardIndex = opts.index ? opts.index : this.cards.length;
    card.instance.originalIndex = opts.originalIndex ? opts.originalIndex : this.cards.length;
    card.instance.editingEnabled = opts.editingEnabled;
    card.instance.upArrow = opts.upArrow ? opts.upArrow : false;
    card.instance.downArrow = opts.downArrow ? opts.downArrow : false;
    card.instance.trashCan = opts.trashCan ? opts.trashCan : false;
    card.instance.term = opts.term ? opts.term : "";
    card.instance.definition = opts.definition ? opts.definition : "";

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

    card.instance.indexChangeEvent.subscribe((e) => {
      if (this.cards.length > 1) {
        this.cards.splice(e.newIndex, 0, this.cards.splice(card.instance.cardIndex, 1)[0]);

        this.cardsContainer.move(card.hostView, e.newIndex);
        card.instance.cardIndex = e.newIndex;

        this.updateCardIndices();
      }
    });

    card.instance.addCardEvent.subscribe(() => {
      this.addCard({ editingEnabled: true, isSaved: false });
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
    if (!this.set) return;

    this.saveInProgress = true;

    for (const card of this.cards) {
      if (card.instance.term.length < 1 || card.instance.definition.length < 1) {
        this.saveInProgress = false;
        return card.instance.notifyEmptyInput();
      }
    }

    for (const card of this.cards) {
      card.instance.editingEnabled = false;
    }

    this.set.description = this.editDescription.nativeElement.value;

    const updated = await this.setsService.updateSet({
      id: this.set.id,
      title: this.editTitle.nativeElement.value,
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

    if (updated === "tooLarge") {
      for (const card of this.cards) {
        card.instance.editingEnabled = true;
      }

      this.isEditing = true;
      this.uploadTooLarge = true;
      this.saveInProgress = false;
      return;
    }

    if (!updated) {
      for (const card of this.cards) {
        card.instance.editingEnabled = true;
      }

      this.isEditing = true;
      this.saveInProgress = false;
      return;
    }
    this.set = updated;

    this.cards = [];
    this.cardsContainer.clear();

    this.isEditing = false;
    this.saveInProgress = false;
    this.viewCards();
  }

  viewCards() {
    this.isEditing = false;

    // if viewCards is called because page is loading
    if (this.cards.length === 0) {
      this.cards = [];
      this.cardsContainer.clear();

      if (this.set) {
        // sort the cards by index
        for (const card of this.set.cards.sort((a, b) => {
          return a.index - b.index;
        })) {
          this.addCard({
            id: card.id,
            isSaved: true,
            index: card.index,
            editingEnabled: false,
            term: card.term,
            definition: card.definition
          });
        }
      }
    } else {
      // if viewCards is called because editing was canceled
      for (let i = this.cards.length - 1; i >= 0; i--) {
        if (!this.cards[i].instance.isSaved) {
          this.cards[i].destroy();
          this.cards.splice(i, 1);
          continue;
        }

        const index = this.set.cards.findIndex((c) => c.index === this.cards[i].instance.originalIndex);

        this.cards[i].instance.term = this.set.cards[index].term;
        this.cards[i].instance.definition = this.set.cards[index].definition;

        if (this.cards[i].instance.cardIndex !== this.cards[i].instance.originalIndex) {
          this.cards[i].instance.indexChangeEvent.emit({ newIndex: this.cards[i].instance.originalIndex });
        }

        this.cards[i].instance.editingEnabled = false;
      }

      this.updateCardIndices();
    }
  }

  async deleteSet() {
    await this.setsService.deleteSet(this.set.id);
    await this.router.navigate(["homepage"]);
  }

  async ngOnInit(): Promise<void> {
    this.setId = this.route.snapshot.paramMap.get("setId");
    if (!this.setId) {
      this.router.navigate(["404"]);
      return;
    }

    const set = await this.setsService.set(this.setId);
    if (!set) {
      this.router.navigate(["404"]);
      return;
    }

    this.titleService.setTitle(set.title + " Set — Scholarsome");

    let description = "Study the " + set.title + " set for free on Scholarsome — ";

    const firstThree = set.cards.slice(0, 3);

    for (const card of firstThree) {
      description += card.term.replace(/(\r\n|\n|\r)/gm, "") + " " + card.definition.replace(/(\r\n|\n|\r)/gm, "") + ". ";
    }

    this.metaService.addTag({ name: "description", content: description });

    const user = await this.users.myUser();

    this.set = set;

    if (user && user.id === set.authorId) this.userIsAuthor = true;

    if (window.location.href.slice(0, 5) !== "https") {
      this.isHttps = false;
    }

    this.spinner.nativeElement.remove();

    this.author = this.set.author.username;
    this.container.nativeElement.removeAttribute("hidden");

    this.viewCards();
  }
}
