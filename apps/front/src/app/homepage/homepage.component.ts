import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { User } from "@scholarsome/shared";
import { Meta, Title } from "@angular/platform-browser";
import { UsersService } from "../shared/http/users.service";

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
    private readonly usersService: UsersService,
    private readonly titleService: Title,
    private readonly metaService: Meta
  ) {
    this.titleService.setTitle("Homepage — Scholarsome");
    this.metaService.addTag({ name: "description", content: "Scholarsome is the way studying was meant to be. No monthly fees or upsells to get between you and your study tools. Just flashcards." });
  }

  @ViewChild("container", { static: true }) container: ElementRef;
  @ViewChild("spinner", { static: true }) spinner: ElementRef;

  user: User;

  async ngOnInit(): Promise<void> {
    const user = await this.usersService.myUser();
    if (user) {
      this.user = user;

      this.user.sets.forEach((s) => {
        s.updatedAt = new Date(s.updatedAt);
      });
      this.user.sets = this.user.sets.sort((a, b) => {
        return new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf();
      });
    }

    this.spinner.nativeElement.remove();
    this.container.nativeElement.removeAttribute("hidden");
  }
}
