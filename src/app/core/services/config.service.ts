import { Injectable, Injector } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, finalize, map, switchMap, take, tap } from 'rxjs/operators';
import { iif, of } from 'rxjs';

import { CommandService } from '@app/core/services/command.service';
import { GithubDataService } from '@app/core/services/github-data.service';
import { PatternService } from '@app/core/services/pattern.service';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {
  constructor(
    private injector: Injector,
    private githubDataService: GithubDataService,
    private commandService: CommandService,
    private patternService: PatternService) { }

  init() {
    const router = this.injector.get(Router);

    router.events.pipe(
      filter((event) => (event instanceof NavigationEnd && event.id <= 1)), // filter only first navigation end event
      map((event: NavigationEnd) => new URLSearchParams(event.url.slice(1)).get('code')), // parse url to get the 'code' query param
      switchMap((code) => iif(() => !code, of(null),  // if code exists get access token else emits null value
        this.githubDataService.setAccessToken(code).pipe(
          tap(() => router.navigate(['/']))
        )
      )),
      take(1),
      finalize(() => {
        this.commandService.setCommands();
        this.patternService.patterns$ = this.githubDataService.fetchPatterns();
      })
    ).subscribe();

  }
}
