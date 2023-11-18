import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import { AlertComponent } from "../alert/alert.component";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { DomSanitizer } from "@angular/platform-browser";
import { ViewportScroller } from "@angular/common";
import { DeviceDetectorService } from "ngx-device-detector";

@Component({
  selector: "scholarsome-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"]
})
export class CardComponent implements OnInit, AfterViewInit {
  constructor(
    private readonly bsModalService: BsModalService,
    private readonly vps: ViewportScroller,
    private readonly deviceService: DeviceDetectorService,
    private readonly renderer: Renderer2,
    private readonly elementRef: ElementRef,
    public readonly sanitizer: DomSanitizer
  ) {}

  @Input() editingEnabled = false;

  @Input() cardId: string;
  @Input() cardIndex: number;

  @Input() upArrow = true;
  @Input() downArrow = true;
  @Input() trashCan = true;

  @Input() termValue?: string;
  @Input() definitionValue?: string;

  @Output() addCardEvent = new EventEmitter();
  @Output() deleteCardEvent = new EventEmitter<number>();
  @Output() moveCardEvent = new EventEmitter<{ index: number, direction: number }>();

  @ViewChild("card", { static: false }) cardElement: Element;
  @ViewChild("term", { static: false }) termElement: ElementRef;
  @ViewChild("definition", { static: false }) definitionElement: ElementRef;
  @ViewChild("inputsContainer", { static: false, read: ViewContainerRef }) inputsContainer: ViewContainerRef;

  @ViewChild("editModal") modal: TemplateRef<HTMLElement>;

  // these two vars exist so that we can prevent the main card
  // from updating while a card is being edited
  protected mainTerm: string;
  protected mainDefinition: string;

  protected isMobile = false;

  protected modalRef?: BsModalRef;
  protected readonly faPenToSquare = faPenToSquare;

  ngOnInit() {
    this.mainTerm = this.termValue ? this.termValue : "";
    this.mainDefinition = this.definitionValue ? this.definitionValue : "";

    this.isMobile = this.deviceService.isMobile();
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

    // scroll to bottom of cards list
    if (this.editingEnabled) {
      this.vps.scrollToPosition([0, document.body.scrollHeight]);
    }

    // open the edit modal when new cards are added
    if (
      this.editingEnabled &&
      !this.termValue &&
      !this.definitionValue &&
      (this.upArrow || this.downArrow)
    ) {
      this.openEditModal();
    }
  }

  get term(): string {
    return this.mainTerm;
  }

  get definition(): string {
    return this.mainDefinition;
  }

  openEditModal() {
    this.modalRef = this.bsModalService.show(this.modal, { class: "modal-xl" });
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
