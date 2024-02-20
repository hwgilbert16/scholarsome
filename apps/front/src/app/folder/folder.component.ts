import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FoldersService } from "../shared/http/folders.service";
import { Folder } from "@scholarsome/shared";
import { Set, Folder as PrismaFolder } from "@prisma/client";
import { ActivatedRoute, Router } from "@angular/router";
import { faFolder, faClone, faFolderTree } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "scholarsome-folder",
  templateUrl: "./folder.component.html",
  styleUrls: ["./folder.component.scss"]
})
export class FolderComponent implements OnInit {
  constructor(
    private readonly foldersService: FoldersService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  @ViewChild("spinner", { static: true }) spinner: ElementRef;

  folder: Folder;

  subfolders: PrismaFolder[];
  sets: Set[] = [];

  loading = true;

  protected readonly faFolder = faFolder;
  protected readonly faClone = faClone;
  protected readonly faFolderTree = faFolderTree;

  async ngOnInit() {
    const folderId = this.route.snapshot.paramMap.get("folderId");
    if (!folderId) {
      this.router.navigate(["404"]);
      return;
    }

    const folder = await this.foldersService.folder(folderId);
    if (!folder) {
      this.router.navigate(["404"]);
      return;
    }

    this.folder = folder;

    this.sets = folder.sets;
    this.subfolders = folder.subfolders;

    this.loading = false;
    this.spinner.nativeElement.remove();
  }
}
