export interface CommandArgument {
  name: string;
  type: string;
  command?: string;
  condition?: string;
  optional?: boolean;
  enum?: string[];
  multiple?: boolean;
  variadic?: boolean;
}
