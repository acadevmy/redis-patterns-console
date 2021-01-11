export const isNil = <T>(value: T): value is null => value === null;
export const isNotNil = <T>(value: T): value is T => value !== null;
