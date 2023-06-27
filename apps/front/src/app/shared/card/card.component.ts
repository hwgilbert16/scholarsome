import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input, OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import { AlertComponent } from "../alert/alert.component";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { AngularEditorConfig } from "@kolkov/angular-editor";

@Component({
  selector: "scholarsome-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"]
})
export class CardComponent implements OnInit, AfterViewInit {
  constructor(private readonly bsModalService: BsModalService) {}

  @Input() editingEnabled = false;

  @Input() cardId: string;
  @Input() cardIndex: number;

  @Input() upArrow = true;
  @Input() downArrow = true;
  @Input() trashCan = true;

  @Input() termValue?: string;
  @Input() definitionValue?: string;

  @Output() deleteCardEvent = new EventEmitter<number>();
  @Output() moveCardEvent = new EventEmitter<{ index: number, direction: number }>();

  @ViewChild("term", { static: false }) termElement: ElementRef;
  @ViewChild("definition", { static: false }) definitionElement: ElementRef;
  @ViewChild("inputsContainer", { static: false, read: ViewContainerRef }) inputsContainer: ViewContainerRef;
  // @ViewChild("editModal", { static: false, read: TemplateRef }) editModal: TemplateRef<any>;

  // these two vars exist so that we can prevent the main card
  // from updating while a card is being edited
  protected mainTerm: string;
  protected mainDefinition: string;

  protected readonly editorConfig: AngularEditorConfig = {
    editable: true,
    height: "20vh",
    sanitize: true,
    fonts: [
      { class: "sans-serif", name: "Sans Serif" }
    ],
    toolbarHiddenButtons: [
      [
        "strikeThrough",
        "justifyLeft",
        "justifyCenter",
        "justifyRight",
        "justifyFull",
        "indent",
        "outdent",
        "heading",
        "fontName"
      ],
      [
        "fontSize",
        "backgroundColor",
        "link",
        "unlink",
        "toggleEditorMode"
      ]
    ]
  };

  protected modalRef?: BsModalRef;
  protected readonly faPenToSquare = faPenToSquare;

  ngOnInit() {
    this.mainTerm = this.termValue ? this.termValue : "";
    this.mainDefinition = this.definitionValue ? this.definitionValue : "";
  }

  ngAfterViewInit() {
    /*
    these two subscriptions here are to prevent the main card from updating
    while the card is being edited

    otherwise it's distracting to see changes in the background while typing
     */
    this.bsModalService.onShow.subscribe(() => {
      this.mainTerm = String(this.mainTerm) as string;
      this.mainDefinition = String(this.mainDefinition) as string;
    });

    this.bsModalService.onHide.subscribe(() => {
      this.mainTerm = this.termValue ? this.termValue : "";
      this.mainDefinition = this.definitionValue ? this.definitionValue : "";
    });

    // this.bsModalService.onShow.subscribe(() => {
    //   const test = this.editModal.createEmbeddedView({});
    //   test.detectChanges();
    //   console.log(test.rootNodes[1]);
    // })
    // const test = this.editModal.createEmbeddedView({});
    // test.detectChanges();
    // console.log(test.rootNodes[1].querySelectorAll(`[title="Undo"]`)[0] as HTMLElement);
  }

  get term(): string {
    return this.mainTerm;
  }

  get definition(): string {
    return this.mainDefinition;
  }

  openModal(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.bsModalService.show(template, { class: "modal-xl" });
  }

  deleteCard() {
    this.deleteCardEvent.emit(this.cardIndex);
  }

  notifyEmptyInput() {
    const alert = this.inputsContainer.createComponent<AlertComponent>(AlertComponent);

    alert.instance.message = "Both fields cannot be empty";
    alert.instance.type = "danger";
    alert.instance.dismiss = true;
    alert.instance.spacingClass = "mt-4";
  }

  moveCard(direction: number) {
    this.moveCardEvent.emit({ index: this.cardIndex, direction });
  }
}
