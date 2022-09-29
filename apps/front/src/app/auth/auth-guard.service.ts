import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { CookieService } from "ngx-cookie";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private cookieService: CookieService, public router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (!this.cookieService.get('authenticated')) {
      await this.router.navigate(['']);
      return false;
    }

    return true;
  }

}
