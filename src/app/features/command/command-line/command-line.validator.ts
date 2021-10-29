import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { Command } from '@app/shared/models/command.interface';

export function allowedCommandValidator(allowedCommands: Command[]): ValidatorFn {
  const allowedCommandKeys = allowedCommands.map((item) => item.key.toLowerCase());

  return (control: AbstractControl): ValidationErrors | null => {
    let value: string = control.value;
    value = value ? value.split(' ')[0] : '';

    if (allowedCommandKeys.length === 0) {
      return null;
    }

    if (allowedCommandKeys.includes(value.toLowerCase())) {
      return null;
    }

    return { allowedCommand: { value: control.value } };
  };
}
