import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export enum ToastType{
  success='success',
  error='error'
}
interface Toast {
  type: ToastType,
  message: string
}
@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  private loaderSubject = new BehaviorSubject<boolean>(false);
  showLoader = this.loaderSubject.asObservable();
  loaderMessage: any
  toastSubject$ = new BehaviorSubject<any>(undefined);
  toast$ = this.toastSubject$.asObservable();
  private toastStack: Toast[] = []

  constructor() {}

  addToToast(payload: Toast) {
    this.toastSubject$.next(payload)
    setTimeout(() => {
      this.toastSubject$.next(undefined)
    }, 3000);
  }

  show() {
    this.loaderSubject.next(true)
  }

  hide() {
    this.loaderSubject.next(false)
  }
}
