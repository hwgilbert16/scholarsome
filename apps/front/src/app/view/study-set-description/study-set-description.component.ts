import { Component, Input } from "@angular/core";
import { Card } from "@prisma/client";

@Component({
  selector: "scholarsome-study-set-description",
  templateUrl: "./study-set-description.component.html",
  styleUrls: ["./study-set-description.component.scss"]
})
export class StudySetDescriptionComponent {
  constructor() {}

  @Input() title: string;
  @Input() description: string;
  @Input() id: string;
  @Input() cards: Card[];
  @Input() private: boolean;
}
