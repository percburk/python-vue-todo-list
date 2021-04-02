export interface Task {
  id: number;
  task: string;
  done: boolean;
  priority: string;
  due_date?: Date;
}

export interface NewTask {
  task: string;
  priority: string;
  due_date: Date;
}

export interface EditPriority {
  id: number;
  priority: string;
}

export interface State {
  tasks: Task[];
  oneTask: Task;
}
