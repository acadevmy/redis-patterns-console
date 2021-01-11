import { ReturnStatement } from '@angular/compiler';
import { ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
    getFromLocalStorage,
    SESSIONSTORAGEKEYS,
    setToLocalStorage,
} from '@app/core/utilities/local-storage.utilities';
import { isNotNil } from '@app/core/utilities/logic.utilities';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import {
    withLatestFrom,
    tap,
    map,
    mapTo,
    filter,
    switchMapTo,
    takeUntil,
} from 'rxjs/operators';
import { CommandsHistory } from './command-line.interface';

export const setValueFn = (commandLine: FormControl) => (value: string) =>
    commandLine.setValue(value);

export type SetValueFn = ReturnType<typeof setValueFn>;
export const createHistoryPipe = (
    arrowUp$: Observable<Event>,
    arrowDown$: Observable<Event>,
    commandsHistorySubj$: BehaviorSubject<CommandsHistory>,
    commandsHistory$: Observable<CommandsHistory>,
    inputElementRef$: Observable<ElementRef<HTMLInputElement> | null>,
    destroy$: Observable<void>,
    setValue: SetValueFn
) => {
    const setValueArrowUpClick$ = arrowUp$.pipe(
        tap((event) => event.preventDefault()),
        withLatestFrom(commandsHistory$),
        tap(([, { commandsHistory, commandsHistoryCursor }]) =>
            commandsHistorySubj$.next({
                commandsHistoryCursor:
                    commandsHistory.length > commandsHistoryCursor + 1
                        ? commandsHistoryCursor + 1
                        : commandsHistoryCursor,
                commandsHistory,
            })
        ),
        map(
            ([, { commandsHistory, commandsHistoryCursor }]) =>
                commandsHistory[commandsHistoryCursor]
        ),
        filter(isNotNil),
        tap(setValue)
    );

    const setValueArrowDownClick$ = arrowDown$.pipe(
        tap((event) => event.preventDefault()),
        withLatestFrom(commandsHistory$),
        tap(([, { commandsHistory, commandsHistoryCursor }]) =>
            commandsHistorySubj$.next({
                commandsHistoryCursor:
                    commandsHistoryCursor - 1 <= 0 ? 0 : commandsHistoryCursor - 1,
                commandsHistory,
            })
        ),
        map(([, { commandsHistory, commandsHistoryCursor }]) =>
            commandsHistoryCursor <= 0
                ? ''
                : commandsHistory[commandsHistoryCursor - 1]
        ),
        filter(isNotNil),
        tap(setValue)
    );

    return merge(setValueArrowUpClick$, setValueArrowDownClick$).pipe(
        switchMapTo(inputElementRef$),
        filter(isNotNil),
        tap((mutableElementRef) => {
            const selectionEnd = mutableElementRef.nativeElement.selectionEnd;
            mutableElementRef.nativeElement.selectionStart = selectionEnd;
            mutableElementRef.nativeElement.selectionEnd = selectionEnd;
        }),
        mapTo(void 0),
        takeUntil(destroy$)
    );
};

export const setNewCommandsHistoryInLocalStorage = (
    commandsHistory: Array<string>
) => {
    const commandsHistoryStringify = JSON.stringify(commandsHistory);
    setToLocalStorage(
        SESSIONSTORAGEKEYS.HISTORYCOMMAND,
        commandsHistoryStringify
    );
};

export const getHistoryFromLocalStorage = () => {
    const commandsHistory = getFromLocalStorage(
        SESSIONSTORAGEKEYS.HISTORYCOMMAND
    );

    try {
        const history = JSON.parse(commandsHistory) as Array<string>;
        return history ? history : [];
    } catch (_) {
        return [];
    }
};
