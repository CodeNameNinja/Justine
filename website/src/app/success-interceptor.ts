import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
// import { ErrorComponent } from './error/error.component';
import { SuccessComponent } from './success/success.component';

@Injectable()
export class SuccessInterceptor implements HttpInterceptor {
  constructor(
    public dialog: MatDialog
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req)
    .pipe(
      tap(evt => {

        if (evt instanceof HttpResponse) {
          if (evt.body.message) {return };
          if(!evt.body.message){return};
          if (evt.body && evt.body.success.message) {
            const message = evt.body.success.message;
            this.dialog.open(SuccessComponent, {
                  data: {message}
                });
            } else {
              return;
            }
        }

    }),
    // Leaving it Commented as I want to merge Error Interceptor & SuccessInterceptor into one.

      // catchError((error: HttpErrorResponse) => {
      //   let errorMessage = 'An Unknow Error Occured.';
      //   if (error.error.message) {
      //     errorMessage = error.error.message;
      //   }
      //   this.dialog.open(ErrorComponent, {
      //     data: {errorMessage}
      //   });
      //   console.log(error);
      //   return throwError(error);
      // })
    );
  }
}
