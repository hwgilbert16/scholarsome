import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Set } from "@scholarsome/shared";
import { SetsService } from "../shared/http/sets.service";

@Component({
  selector: "scholarsome-view",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.scss"]
})
export class HomepageComponent implements OnInit {
  /**
   * @ignore
   */
  constructor(
    private readonly http: HttpClient,
    private readonly setsService: SetsService
  ) {}

  @ViewChild("cards", { static: true, read: ViewContainerRef }) cardContainer: ViewContainerRef;
  @ViewChild("container", { static: true }) container: ElementRef;

  @ViewChild("spinner", { static: true }) spinner: ElementRef;

  sets: Set[];

  async ngOnInit(): Promise<void> {
    const sets = await this.setsService.sets("self");
    if (sets) {
      this.sets = sets.sort((a, b) => {
        return new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf();
      });
    }

    this.spinner.nativeElement.remove();
    this.container.nativeElement.removeAttribute("hidden");
  }
}
