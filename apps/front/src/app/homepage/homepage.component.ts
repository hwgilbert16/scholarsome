import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Set } from "@scholarsome/shared";

@Component({
  selector: "scholarsome-view",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.scss"]
})
export class HomepageComponent implements OnInit {
  /**
   * @ignore
   */
  constructor(private http: HttpClient) {}

  @ViewChild("cards", { static: true, read: ViewContainerRef }) cardContainer: ViewContainerRef;
  @ViewChild("container", { static: true }) container: ElementRef;

  @ViewChild("spinner", { static: true }) spinner: ElementRef;

  sets: Observable<Set[]>;

  async ngOnInit(): Promise<void> {
    this.sets = this.http.get<Set[]>("/api/sets/user/self");

    this.spinner.nativeElement.remove();
    this.container.nativeElement.removeAttribute("hidden");
  }
}
