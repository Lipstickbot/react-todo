export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export enum SortType {
  Status = "status",
  Alpha = "alpha",
}
