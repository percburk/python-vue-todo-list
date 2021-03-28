export interface Task {
  id: number;
  task: string;
  done: boolean;
  priority: number;
  created?: Date;
}
