import { Injectable } from '@angular/core';
import  {Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor() { }

  public modal: Subject<string> = new Subject<string>();
}
