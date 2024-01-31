import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { NotfoundComponent } from "./shared/notfound/notfound.component";

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./landing/landing.module").then((m) => m.LandingModule)
  },
  {
    path: "create",
    loadChildren: () => import("./create/create.module").then((m) => m.CreateModule)
  },
  {
    path: "homepage",
    loadChildren: () => import("./homepage/homepage.module").then((m) => m.HomepageModule)
  },
  {
    path: "study-set",
    loadChildren: () => import("./study-set/study-set.module").then((m) => m.StudySetModule)
  },
  {
    path: "profile",
    loadChildren: () => import("./profile/profile.module").then((m) => m.ProfileModule)
  },
  {
    path: "settings",
    loadChildren: () => import("./settings/settings.module").then((m) => m.SettingsModule)
  },
  {
    path: "404",
    component: NotfoundComponent
  },
  {
    path: "**",
    pathMatch: "full",
    redirectTo: "404"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    relativeLinkResolution: "legacy"
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
