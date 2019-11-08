import { Injectable } from '@angular/core';

import { CommandService } from '@app/core/services/command.service';
import { GithubDataService } from '@app/core/services/github-data.service';
import { PatternService } from '@app/core/services/pattern.service';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {
  constructor(
    private githubDataService: GithubDataService,
    private commandService: CommandService,
    private patternService: PatternService) { }

  init() {
    this.commandService.setCommands();
    this.patternService.patterns$ = this.githubDataService.fetchPatterns();
  }
}
