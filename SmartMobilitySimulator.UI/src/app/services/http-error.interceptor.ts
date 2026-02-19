import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { LoadingService } from "./loading.service";

@Injectable({
  providedIn: "root",
})
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    // Don't show loading for certain requests
    const hideLoading = request.headers.has("X-Hide-Loading");
    if (!hideLoading) {
      this.loadingService.show();
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "An unexpected error occurred";

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          switch (error.status) {
            case 0:
              errorMessage =
                "Unable to connect to server. Please check your internet connection.";
              break;
            case 400:
              errorMessage =
                error.error?.message || "Bad request. Please check your input.";
              break;
            case 401:
              errorMessage = "Unauthorized. Please log in again.";
              break;
            case 403:
              errorMessage = "Access denied. You do not have permission.";
              break;
            case 404:
              errorMessage = "Resource not found.";
              break;
            case 500:
              errorMessage = "Server error. Please try again later.";
              break;
            default:
              errorMessage = `Error ${error.status}: ${error.message}`;
          }
        }

        console.error("HTTP Error:", error);
        return throwError(() => new Error(errorMessage));
      }),
      finalize(() => {
        if (!hideLoading) {
          this.loadingService.hide();
        }
      }),
    );
  }
}



