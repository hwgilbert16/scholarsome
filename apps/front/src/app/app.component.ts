import { Component } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Meta } from "@angular/platform-browser";

@Component({
  selector: "scholarsome-root",
  templateUrl: "./app.component.html"
})
export class AppComponent {
  constructor(private router: Router, private metaService: Meta) {
    // Meta tags are not automatically removed after navigation events
    // This is to manually remove them after every NavigationEnd event
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.initialNavigation) {
          this.initialNavigation = false;
          return;
        }

        this.metaService.removeTag("name=\"description\"");
      }
    });
  }

  protected initialNavigation = true;
}
