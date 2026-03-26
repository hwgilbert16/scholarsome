import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { User, Folder, Set } from "@scholarsome/shared";
import { Meta, Title } from "@angular/platform-browser";
import { UsersService } from "../shared/http/users.service";
import { FoldersService } from "../shared/http/folders.service";
import { SetsService } from "../shared/http/sets.service";
import { faPlus, faClone, faFolder } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "scholarsome-view",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.scss"]
})
export class HomepageComponent implements OnInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly titleService: Title,
    private readonly metaService: Meta,
    private readonly foldersService: FoldersService,
    private readonly setsService: SetsService
  ) {
    this.titleService.setTitle("Accueil— Scholarsome");
    this.metaService.addTag({ name: "description", content: "Créez vos propre set de cartes gratuitement !" });
  }

  @ViewChild("container", { static: true }) container: ElementRef;
  @ViewChild("spinner", { static: true }) spinner: ElementRef;

  user: User;
  publicFolders: Folder[] = [];
  publicSets: Set[] = [];

  protected readonly faClone = faClone;
  protected readonly faFolder = faFolder;
  protected readonly faPlus = faPlus;

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

      this.user.folders = this.user.folders
          .sort((a, b) => {
            return new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf();
          })
          .filter((f) => !f.parentFolderId);
    }
    const folders = await this.foldersService.publicFolders();

    if (folders) {
      // folders.forEach((f) => {
      //  f.updatedAt = new Date(f.updatedAt);
      //  f.createdAt = new Date(f.createdAt);
      // });

      this.publicFolders = folders;
    }

    const sets = await this.setsService.publicSets();

    if (sets) {
    //  sets.forEach((s) => {
    //   s.updatedAt = new Date(s.updatedAt);
    // });

      this.publicSets = sets;
    }

    this.spinner.nativeElement.remove();
    this.container.nativeElement.removeAttribute("hidden");
  }
}
