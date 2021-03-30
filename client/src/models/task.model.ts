export interface Task {
  id: number;
  task: string;
  done: boolean;
  priority: number;
  due_date?: Date;
}

export interface NewTask {
  task: string;
  priority: number;
  due_date: Date;
}
