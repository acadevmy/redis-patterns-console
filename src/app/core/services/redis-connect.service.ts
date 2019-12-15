import * as uuid from 'uuid';

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';

import { environment } from '@app/../environments/environment';
import { Output } from '@app/shared/models/response.interface';

@Injectable({
  providedIn: 'root'
})
export class RedisConnectService {
  subject = webSocket(environment.redisServer);
  execCommandTimeSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  execCommandTime$: Observable<number> = this.execCommandTimeSubject.asObservable();

  private sessionId = uuid.v4();
  response$ = this.subject.asObservable().pipe(
    map((response: any): Output => {
      const valid = response.status === 'ok';
      return { valid, type: 'response', output: response.output };
    }),
    catchError(() =>  of(null))
  );

  send(command: string) {
    this.subject.next({ command, sessionId: this.sessionId, date: Date.now() });
    this.execCommandTimeSubject.next(new Date().getTime());
  }
}
