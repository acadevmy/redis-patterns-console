import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { Pattern } from '@app/shared/models/pattern.interface';
import { GithubDataService } from '@app/core/services/github-data.service';

@Injectable({
  providedIn: 'root'
})
export class PatternService {

  patterns$: Observable<Pattern[]>;

  private readonly activePatternSubject = new Subject<Pattern>();
  readonly activePattern$ = this.activePatternSubject.asObservable();

  public patternContent$: Observable<string[]> = this.activePattern$.pipe(
    filter((pattern: Pattern) => (!!pattern.content)),
    switchMap((pattern: Pattern) => this.githubDataService.fetchPattern(pattern.content)),
    map((content: string) => content.split('---'))
  );

  set activePattern(pattern: Pattern) {
    this.activePatternSubject.next({...pattern});
  }

  constructor(private githubDataService: GithubDataService) { }
}
