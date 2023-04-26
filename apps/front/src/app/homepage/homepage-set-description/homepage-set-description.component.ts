import { Component, Input } from "@angular/core";
import { Card } from "@prisma/client";

@Component({
  selector: "scholarsome-homepage-set-description",
  templateUrl: "./homepage-set-description.component.html",
  styleUrls: ["./homepage-set-description.component.scss"]
})
export class HomepageSetDescriptionComponent {
  constructor() {}

  @Input() title: string;
  @Input() description: string;
  @Input() id: string;
  @Input() cards: Card[];
  @Input() private: boolean;
}
