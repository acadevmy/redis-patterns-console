import {Component, OnDestroy} from '@angular/core';

import {Output} from '@app/shared/models/response.interface';
import {Pattern} from '@app/shared/models/pattern.interface';
import {CommandService} from '@app/core/services/command.service';
import {PatternService} from '@app/core/services/pattern.service';
import {RedisConnectService} from '@app/core/services/redis-connect.service';

import {Observable, BehaviorSubject, merge} from 'rxjs';
import {scan} from 'rxjs/operators';


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

  constructor(
    public commandService: CommandService,
    public patternService: PatternService,
    private redisConnectService: RedisConnectService) {

    /** when currentResponse$ is null reset responses$ */
    this.responses$ = merge(
      this.currentResponseBs.asObservable(),
      this.redisConnectService.response$
      ).pipe(
        scan((a, c) => c != null ? [...a, c] : [], [])
    );
  }

  /**
   * Set current command as the active one
   * @param command String
   */
  selectActiveCommand(command: string) {
    this.commandService.activeCommand = command;
  }

  /**
   * Write command on text input
   * @param command String
   */
  writeCommand(command: string) {
    this.newCommandForInput = command;
    this.selectActiveCommand(command);
  }

  /**
   * Set new active pattern
   * @param pattern pattern
   */
  selectPattern(pattern: Pattern) {
    this.activePattern = pattern;
    this.patternService.activePattern = pattern;
  }

  /**
   * Send command to server and update responses
   * @param commandString String
   */
  runCommand(commandString: string) {
    const newCommand: Output = {valid: true, output: commandString.toUpperCase(), type: 'command'};
    this.currentResponseBs.next(newCommand);
    this.redisConnectService.send(commandString);
    const [first, ...second] = commandString.split(' ');
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
