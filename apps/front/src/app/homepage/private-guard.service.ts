import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";


@Injectable({
  providedIn: "root"
})
export class PrivateGuardService implements CanActivate {
  constructor(private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const setId = route.paramMap.get("setId");
    if (!setId) {
      await this.router.navigate([""]);
      return false;
    }

    return false;
  }
}
