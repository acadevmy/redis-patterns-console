import { Observable, Subject } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { GithubDataService } from '@app/core/services/github-data.service';
import { Injectable } from '@angular/core';
import { Pattern } from '@app/shared/models/pattern.interface';

@Injectable({
  providedIn: 'root'
})
export class PatternService {
  patterns$: Observable<Pattern[]>;

  private readonly activePatternSubject = new Subject<Pattern>();

  readonly activePattern$ = this.activePatternSubject.asObservable();

  public patternContent$: Observable<string[]> = this.activePattern$.pipe(
    filter((pattern: Pattern) => !!pattern.content),
    switchMap((pattern: Pattern) => this.githubDataService.fetchPattern(pattern.content)),
    map((content: string) => content.split('---'))
  );

  set activePattern(pattern: Pattern) {
    this.activePatternSubject.next({ ...pattern });
  }

  constructor(private githubDataService: GithubDataService) {}
}
