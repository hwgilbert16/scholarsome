import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { SetsService } from "../shared/http/sets.service";

@Injectable({
  providedIn: 'root'
})
export class PrivateGuardService implements CanActivate {
  constructor(private router: Router, private setsService: SetsService) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const setId = route.paramMap.get('setId');
    if (!setId) {
      await this.router.navigate(['']);
      return false;
    }

    const set = await this.setsService.set(setId);

    return false;
  }
}
