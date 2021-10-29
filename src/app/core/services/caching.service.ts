import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@app/../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CachingService {
  private cache = new Map<string, HttpResponse<unknown>>();

  get(key: string): HttpResponse<unknown> {
    const httpResponse = this.cache.get(key);
    return httpResponse ? httpResponse : null;
  }

  set(key: string, value: HttpResponse<unknown>): void {
    this.cache.set(key, value);
  }

  get cacheableHeaderObj(): HttpHeaders {
    const headers = new HttpHeaders();
    return headers.set(environment.cacheableHeaderKey, 'true');
  }
}
