import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ModalService {
  public modal: Subject<string> = new Subject<string>();
}
