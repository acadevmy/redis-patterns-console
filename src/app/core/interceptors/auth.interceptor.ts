import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { GithubDataService } from '@app/core/services/github-data.service';
​
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  public constructor(private githubDataService: GithubDataService) { }
​
  public intercept(request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    if (this.isAuthenticated()) {
      request = this.createAuthenticatedRequest(request);
    }
​
    return next.handle(request);
  }

  private createAuthenticatedRequest(request: HttpRequest<any>) {
    return request.clone({ setHeaders: { Authorization: `token ${this.githubDataService.accessToken}` } });
  }

  private isAuthenticated(): boolean {
    return this.githubDataService.isAuth;
  }
}