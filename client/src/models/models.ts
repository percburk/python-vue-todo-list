// Type check for tasks coming from db
export interface Task {
  id: number;
  task: string;
  done: boolean;
  priority: string;
  due_date?: string;
  date_display?: string;
  overdue?: boolean;
}
// TaskSort is used in EditDialog to know if a sort is present to trigger the
// correct GET route in fetchTasks, type checks the edit with Task interface
export interface TaskSort extends Task {
  sort?: string;
}
// Type check for a new task entered on NewTaskForm
export interface NewTask {
  task: string;
  priority: string;
  due_date?: Date;
}
// Type check for all routes requiring the task id to send in URL to the
// server, checks if a sort is present to trigger the correct GET in fetchTasks
export interface IdSort {
  id: number;
  sort?: string;
}
// Type check to edit priority of a task, requires the string of current
// priority to toggle on the server along with task id
export interface IdSortPriority extends IdSort {
  EditPriority: string;
}
// Type check for the app's state
export interface State {
  tasks: Task[];
  oneTask: Task;
  sort: string;
}
