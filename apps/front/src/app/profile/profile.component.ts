import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UsersService } from "../shared/http/users.service";
import { Meta, Title } from "@angular/platform-browser";
import { User } from "@scholarsome/shared";

@Component({
  selector: "scholarsome-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly metaService: Meta
  ) {}

  @ViewChild("spinner", { static: true }) spinner: ElementRef;
  @ViewChild("container", { static: false }) container: ElementRef;

  user: User | null;
  registrationDate: string;

  async ngOnInit(): Promise<void> {
    const userId = this.route.snapshot.paramMap.get("userId");
    if (!userId) {
      await this.router.navigate(["404"]);
      return;
    }

    this.user = await this.usersService.user(userId);
    if (!this.user) {
      await this.router.navigate(["404"]);
      return;
    }

    this.titleService.setTitle(this.user.username + " — Scholarsome");
    this.metaService.addTag({ name: "description", content: "Scholarsome is the way studying was meant to be. No monthly fees or upsells to get between you and your study tools. Just flashcards." });

    this.user.createdAt = new Date(this.user.createdAt);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.registrationDate = months[this.user.createdAt.getMonth()] + " " + this.user.createdAt.getDay() + ", " + this.user.createdAt.getFullYear();

    this.spinner.nativeElement.remove();
    this.container.nativeElement.removeAttribute("hidden");
  }
}
