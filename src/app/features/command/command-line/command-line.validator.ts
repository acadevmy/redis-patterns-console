import { ValidatorFn, AbstractControl } from '@angular/forms';

import { Command } from '@app/shared/models/command.interface';

export function allowedCommandValidator(allowedCommands: Command[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value ? control.value.split(' ')[0] : '';
    const allowed = allowedCommands.length === 0 || allowedCommands.some((item: Command) => item.key.toLowerCase() === value.toLowerCase());
    return !allowed ? { allowedCommand: {value: control.value} } : null;
  };
}
