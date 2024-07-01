import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ErrorMessageService } from '../../services/error-message.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss'
})
export class ErrorMessageComponent implements OnInit, OnDestroy {
  @Input() title = 'Error';

  message = '';
  hidden = true;
  destroy$$ = new Subject();

  constructor(
    private errorMessageService: ErrorMessageService,
  ) { }

  ngOnDestroy(): void {
    this.destroy$$.next(null);
    this.destroy$$.complete();
  }

  ngOnInit(): void {
    this.errorMessageService.message$.pipe(
      takeUntil(this.destroy$$)
    )
      .subscribe(text => {
        this.hidden = false;
        this.message = text;
      });
  }
}
