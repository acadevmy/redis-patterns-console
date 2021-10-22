import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
​
import { environment } from '@app/../environments/environment';
import { CachingService } from '@app/core/services/caching.service';
​
@Injectable({
  providedIn: 'root'
})
export class CacheInterceptor implements HttpInterceptor {
​
  public constructor(private readonly cachingService: CachingService) { }
​
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isCacheableRequest(request)) {
      return next.handle(request);
    }

    const cachedResponse = this.getCachedResponse(request);
    if (cachedResponse) {
      return of(cachedResponse);
    }
    
    return this.nextAndCache(request, next);
  }

  private getCachedResponse(request: HttpRequest<any>): HttpResponse<any> {
    return this.cachingService.get(request.url);
  }

  private isCacheableRequest(request: HttpRequest<any>): boolean {
    return request.headers.has(environment.cacheableHeaderKey);
  }
​
  private nextAndCache(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /* remove cacheable headers form original request */
    request = request.clone({ headers: request.headers.delete(environment.cacheableHeaderKey) });
    
    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.cachingService.set(request.url, event);
        }
      })
    );
  }
}