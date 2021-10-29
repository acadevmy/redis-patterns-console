import * as uuid from 'uuid';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Output } from '@app/shared/models/response.interface';
import { environment } from '@app/../environments/environment';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class RedisConnectService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subject = webSocket<any>(environment.redisServer);

  execCommandTimeSubject: BehaviorSubject<number> = new BehaviorSubject(0);

  execCommandTime$: Observable<number> = this.execCommandTimeSubject.asObservable();

  private sessionId = uuid.v4();

  response$: Observable<Output> = this.subject.asObservable().pipe(
    map((response): Output => {
      const valid = response.status === 'ok';
      return { valid, type: 'response', output: response.output };
    }),
    catchError(() => {
      /** return connection error response to not clear the output response box */
      const valid = false;
      return of<Output>({ valid, type: 'response', output: 'Connection error' });
    })
  );

  send(command: string): void {
    this.subject.next({ command, sessionId: this.sessionId, date: Date.now() });
    this.execCommandTimeSubject.next(new Date().getTime());
  }
}
