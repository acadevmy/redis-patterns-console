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
  constructor(private cachingService: CachingService) { }
​
  intercept(request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {​
    if (!request.headers.has(environment.cacheableHeaderKey))  {
      return next.handle(request);
    }
    /** remove cacheable headers form original request */
    request = request.clone({ headers: request.headers.delete(environment.cacheableHeaderKey) });
    const cachedResponse = this.cachingService.get(request.url);
    return cachedResponse ? of(cachedResponse) : this.sendRequest(request, next);
  }
​
  sendRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.cachingService.set(req.url, event);
        }
      })
    );
  }
}