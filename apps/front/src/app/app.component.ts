import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from "@angular/router";
import { AuthService } from "./auth/auth.service";
import { CookieService } from "ngx-cookie";

@Component({
  selector: 'scholarsome-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService, private cookieService: CookieService) {}

  ngOnInit(): void {
    this.router.events.subscribe(async e => {
      if (
        e instanceof NavigationStart &&
        this.cookieService.get('authenticated') &&
        !(await this.authService.checkAuthenticated())
      ) {
        const refresh = await this.authService.refreshAccessToken();

        if (!refresh) {
          await this.authService.logout();
          this.router.navigate(['/']);
        }
      }
    });
  }
}
