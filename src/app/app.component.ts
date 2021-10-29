import { BehaviorSubject, Observable, merge } from 'rxjs';
import { CommandService } from '@app/core/services/command.service';
import { Component } from '@angular/core';
import { GithubDataService } from '@app/core/services/github-data.service';
import { Output } from '@app/shared/models/response.interface';
import { Pattern } from '@app/shared/models/pattern.interface';
import { PatternService } from '@app/core/services/pattern.service';
import { RedisConnectService } from '@app/core/services/redis-connect.service';

import { scan } from 'rxjs/operators';

@Component({
  selector: 'tr-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  readonly responses$: Observable<Output[]>;

  private currentResponseBs: BehaviorSubject<Output> = new BehaviorSubject<Output>(null);

  selectedDoc: string;

  activePattern: Pattern;

  newCommandForInput: string;

  resetCommand$: Observable<number> = this.redisConnectService.execCommandTime$;

  isAuth$: Observable<boolean> = this.githubDataService.isAuth;

  constructor(
    private githubDataService: GithubDataService,
    public commandService: CommandService,
    public patternService: PatternService,
    private redisConnectService: RedisConnectService
  ) {
    /** when currentResponse$ is null reset responses$ */
    this.responses$ = merge(this.currentResponseBs.asObservable(), this.redisConnectService.response$).pipe(
      scan((previous, current) => (current != null ? [...previous, current] : []), new Array<Output>())
    );
  }

  /**
   * Set current command as the active one
   * @param command String
   */
  selectActiveCommand(command: string): void {
    this.commandService.activeCommand = command;
  }

  /**
   * Write command on text input
   * @param command String
   */
  writeCommand(command: string): void {
    this.newCommandForInput = command;
    this.selectActiveCommand(command);
  }

  /**
   * Set new active pattern
   * @param pattern pattern
   */
  selectPattern(pattern: Pattern): void {
    this.activePattern = pattern;
    this.patternService.activePattern = pattern;
  }

  /**
   * Send command to server and update responses
   * @param commandString String
   */
  runCommand(commandString: string): void {
    const newCommand: Output = { valid: true, output: commandString.toUpperCase(), type: 'command' };
    this.currentResponseBs.next(newCommand);
    this.redisConnectService.send(commandString);
    const [first] = commandString.split(' ');
    this.selectActiveCommand(first);
  }

  /**
   * reset responses
   *
   */
  clearOutput(): void {
    this.currentResponseBs.next(null);
  }
}
