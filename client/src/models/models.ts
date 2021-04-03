export interface Task {
  id: number;
  task: string;
  done: boolean;
  priority: string;
  due_date?: Date;
}

export interface TaskSort extends Task {
  sort?: string;
}

export interface NewTask {
  task: string;
  priority: string;
  due_date: Date;
}

export interface IdSort {
  id: number;
  sort?: string;
}

export interface IdSortPriority extends IdSort {
  EditPriority: string;
}

export interface State {
  tasks: Task[];
  oneTask: Task;
  sort: string;
}
