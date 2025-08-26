import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModalStateService {

  private _isOpenModal$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() { }

  public set isOpenModal(value: boolean) {
    this._isOpenModal$.next(value);
  }

  public getOpenModal() {
    return this._isOpenModal$.getValue();
  }

  public get isOpenModal$(): Observable<boolean> {
    return this._isOpenModal$.asObservable();
  }
}
