import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { commadsBlackList } from '@app/../environments/command-blacklist';
import { Command } from '@app/shared/models/command.interface';
import { CommandArgument } from '@app/shared/models/command-argument.interface';
import { GithubDataService } from '@app/core/services/github-data.service';

@Injectable({
  providedIn: 'root'
})
export class CommandService {
  commands$: Observable<Command[]>;

  private commandsList: Command[] = [];
  private readonly activeCommandSubject = new Subject<Command>();
  readonly activeCommand$ = this.activeCommandSubject.asObservable();

  readonly activeDocumentation$: Observable<string> = this.activeCommand$.pipe(
    filter((command: Command) => !!command.key),
    switchMap((command) => this.githubDataService.fetchDocumentation(command.key))
  );

  /**
   * Set redis whitelist commands
   */
  setCommands() {
    const blacklist = commadsBlackList;
    this.commands$ = this.githubDataService.fetchCommands().pipe(
      map((commands: Command[]) => this.commandsList = commands.filter((command) => !blacklist.includes(command.key)))
    );
  }

  set activeCommand(commandKey: string) {
    const command = this.commandsList.find((cmd: Command) => commandKey.toLowerCase().trim() === cmd.key.toLowerCase());
    this.activeCommandSubject.next({...command, suggestion: this.argumentsStringify(command.arguments)});
  }

  // TODO: Draft (this function must be refactored)
  private argumentsStringify(commandArgument = []): string {
    return commandArgument.reduce((strAcc, item: CommandArgument) => {
      let str = '';
      if (item.name) {
        const name = Array.isArray(item.name) ? `${item.name.join(' ')}` : item.name;
        str = ((Array.isArray(item.name) && !item.command) || item.optional && !item.command) ? `[${name}]` : name;
      }
      if (item.enum) {
        const en = Array.isArray(item.enum) ? `${item.enum.join('|')}` : item.enum;
        str = ((Array.isArray(item.enum) && !item.command)) ? `[${en}]` : en;
      }
      str += (item.multiple || item.variadic)  ? ` [${item.name}...]` : '';
      str = item.command ? `[${item.command } ${str}]` : str;
      return strAcc + ' ' + str;
    }, '');
  }

  constructor(private githubDataService: GithubDataService) {}
}
