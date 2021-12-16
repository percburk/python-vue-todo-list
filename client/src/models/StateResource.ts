import { Task } from './TaskResource';

// Type check for the app's state
export interface State {
  tasks: Task[];
  oneTask: Task;
  sort: string;
}
