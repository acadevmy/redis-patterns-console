import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { allowedCommandValidator } from './command-line.validator';
import { Command } from '@app/shared/models/command.interface';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { CommandsHistory } from './command-line.interface';
import {
  createHistoryPipe,
  getHistoryFromLocalStorage,
  setNewCommandsHistoryInLocalStorage,
  setValueFn,
} from './command-line.utilities';

@Component({
  selector: 'tr-command-line',
  templateUrl: './command-line.component.html',
  styles: [
    `
      .input-group-text {
        background: white;
        font-size: 0.9em;
      }

      .form-control {
        font-size: 0.9em;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandLineComponent implements OnInit, OnDestroy {
  commandLine: FormControl;
  commandsHistory: string[] = [];
  commandsHistoryCursor = 0;
  commandLineMinLetter = 3;

  commandsHistorySubj$ = new BehaviorSubject<CommandsHistory>({
    commandsHistory: getHistoryFromLocalStorage(),
    commandsHistoryCursor: 0,
  });

  arrowUpClickSubj$ = new Subject<Event>();
  arrowDownClickSubj$ = new Subject<Event>();
  inputElementRefSubj$ = new ReplaySubject<ElementRef<HTMLInputElement> | null>(
    1
  );
  executeCommandSubj$ = new ReplaySubject<string>(1);

  executeCommandPipe$: Observable<void>;
  historyPipe$: Observable<void>;

  @Input() allowedCommands: Array<Command> = [];
  @Input() activeCommand: Command;
  @Input('writeCommand') set newCommand(data: string) {
    if (data !== undefined) {
      this.commandLine.setValue(data);
      this.commandLine.markAsDirty();
    }
  }
  @Input('reset') set resetCommandLine(data: number) {
    if (data) {
      this.commandLine.reset();
    }
  }

  @ViewChild('input') set inputElement(
    inputElement: ElementRef<HTMLInputElement> | null
  ) {
    this.inputElementRefSubj$.next(inputElement);
  }

  @Output() detectCommand: EventEmitter<any> = new EventEmitter();
  @Output() execute: EventEmitter<any> = new EventEmitter();

  private destroySubj$: Subject<void> = new Subject<void>();

  /**
   * Init command line input text with its validator
   * and start to observe its value changes.
   */
  ngOnInit() {
    this.commandLine = new FormControl('', [
      Validators.required,
      allowedCommandValidator(this.allowedCommands),
    ]);

    this.historyPipe$ = createHistoryPipe(
      this.arrowUpClickSubj$.asObservable(),
      this.arrowDownClickSubj$.asObservable(),
      this.commandsHistorySubj$,
      this.commandsHistorySubj$.asObservable(),
      this.inputElementRefSubj$.asObservable(),
      this.destroySubj$.asObservable(),
      setValueFn(this.commandLine)
    );

    this.executeCommandPipe$ = this.executeCommandSubj$.pipe(
      filter(() => this.commandLine.valid),
      tap((value) => this.execute.emit(value.trim())),
      withLatestFrom(this.commandsHistorySubj$),
      tap(([command, { commandsHistory }]) => {
        const newHistory = commandsHistory[0] === command ? commandsHistory : [command, ...commandsHistory]

        setNewCommandsHistoryInLocalStorage(newHistory);

        this.commandsHistorySubj$.next({
          commandsHistory: newHistory,
          commandsHistoryCursor: 0,
        });
      }),
      mapTo(void 0),
      takeUntil(this.destroySubj$.asObservable())
    );

    this.historyPipe$.subscribe();
    this.executeCommandPipe$.subscribe();

    this.commandLine.valueChanges
      .pipe(
        debounceTime(200),
        filter(() => this.commandLine.valid),
        map((value) => value.split(' ')[0]),
        distinctUntilChanged(),
        takeUntil(this.destroySubj$.asObservable())

      )
      .subscribe((value) => this.detectCommand.emit(value));
  }

  /**
   * Checks if is a valid command and emits event for it execution,
   * and add it to commands history, finally reset command line input.
   * @param command the command that should be execute
   */
  executeCommand(command: string) {
    if (this.commandLine.valid) {
      this.execute.emit(command.trim());
      this.commandsHistoryCursor = 0;

      if (this.commandsHistory[0] !== command.trim()) {
        this.commandsHistory.unshift(command.trim());
      }
      this.commandLine.reset();
    }
  }

  isValidCommand() {
    return (
      !this.commandLine.valid &&
      this.commandLine.errors &&
      this.commandLine.errors.allowedCommand &&
      this.commandLine.errors.allowedCommand.value &&
      this.commandLine.errors.allowedCommand.value.length >=
      this.commandLineMinLetter
    );
  }

  ngOnDestroy() {
    this.destroySubj$.next();
  }
}
