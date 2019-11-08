export interface Output {
  type: 'command' | 'response';
  valid: boolean;
  output: string;
}
