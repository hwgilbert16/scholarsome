import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "scholarsome-notfound",
  templateUrl: "./notfound.component.html",
  styleUrls: ["./notfound.component.scss"]
})
export class NotfoundComponent {
  constructor(
    private readonly titleService: Title
  ) {
    this.titleService.setTitle("Not found — Scholarsome");
  }
}
