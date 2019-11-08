import { CommandArgument } from './command-argument.interface';

export interface Command {
  key: string;
  summary: string;
  complexity: string;
  group: string;
  since: string;
  arguments: CommandArgument[];
  suggestion: string;
}
