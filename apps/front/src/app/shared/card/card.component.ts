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

    /*
    all this does here is set the toolbar buttons of the quill editor to have a tab index of -1

    as far as I can tell there's no good way to do this other than a custom toolbar which is more effort than it's worth
    or this way by just manually setting all the buttons to have the tab index

    for some reason this needs to be wrapped in a setTimeout for the querySelector to successfully find the elements in the dom

    will rewrite this code at some point - it's trash currently - but I'm more concerned about usability
     */
    this.bsModalService.onShown.subscribe(() => {
      setTimeout(() => {
        const editors = this.elementRef.nativeElement.ownerDocument.querySelectorAll("quill-editor");

        const buttons = [
          ...editors[0].querySelectorAll("button"),
          ...editors[0].querySelectorAll("[role=\"button\"]"),
          ...editors[1].querySelectorAll("button"),
          ...editors[1].querySelectorAll("[role=\"button\"]")
        ];

        for (const button of buttons) {
          button.tabIndex = -1;
        }
      }, 0);
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

    // this.renderer.listen("document", "keydown", (event: KeyboardEvent) => {
    //   if (event.key === "Tab") {
    //     console.log(this.elementRef.nativeElement.ownerDocument.querySelectorAll("quill-editor")[0].querySelectorAll("button"));
    //     event.preventDefault();
    //   }
    // });
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
