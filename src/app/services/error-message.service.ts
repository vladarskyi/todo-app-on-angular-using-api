import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {
  private message$$ = new Subject<string>();

  message$ = this.message$$.asObservable();

  showMessage(text: string) {
    this.message$$.next(text);
  }
}
