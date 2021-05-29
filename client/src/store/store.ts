import { InjectionKey } from 'vue';
import {
  createStore,
  createLogger,
  Store,
  useStore as useBaseStore,
} from 'vuex';
import axios from 'axios';
// Interfaces for type checking
import {
  Task,
  NewTask,
  IdSortPriority,
  State,
  IdSort,
  TaskSort,
} from '../models/models';
// Action types enum
import { ActionTypes } from '../models/ActionTypes';

// Injection key, so useStore() hook can be used in Vue components
export const key: InjectionKey<Store<State>> = Symbol();

// Custom hook that provides injection key to all instances of useStore()
// being called in components
export const useStore = (): Store<State> => useBaseStore(key);

// Store instance
export const store = createStore<State>({
  // Add logger to display state in console when in development mode
  plugins: import.meta.env.DEV ? [createLogger()] : [],

  // Initial state
  state: {
    tasks: [],
    oneTask: {
      id: 0,
      task: '',
      done: false,
      priority: '',
      due_date: '',
      date_display: '',
      overdue: '',
    },
    sort: '',
  },

  // Mutations to set the key/values in state object, type checked
  mutations: {
    [ActionTypes.SET_TASKS](state: State, tasksFromServer: Task[]): void {
      state.tasks = tasksFromServer;
    },
    [ActionTypes.SET_ONE_TASK](state: State, oneTaskFromServer: Task): void {
      state.oneTask = oneTaskFromServer;
    },
    [ActionTypes.SET_SORT](state: State, sort: string): void {
      state.sort = sort;
    },
  },

  // Async actions that trigger routes to the server
  actions: {
    // Fetches all tasks from db. If sort is present in state, sends it along
    // to server to trigger different SQL 'ORDER BY' queries
    async [ActionTypes.FETCH_TASKS]({ commit }, sort: string): Promise<void> {
      const whichRoute = sort ? `/api/todos/sort/${sort}` : '/api/todos';
      try {
        const response = await axios.get(whichRoute);
        commit(ActionTypes.SET_TASKS, response.data);
      } catch (err) {
        console.log('Error in fetchTasks:', err);
      }
    },
    // Fetches one task to edit in EditDialog
    async [ActionTypes.FETCH_ONE_TASK]({ commit }, id: number): Promise<void> {
      try {
        const response = await axios.get(`/api/todos/${id}`);
        commit(ActionTypes.SET_ONE_TASK, response.data);
      } catch (err) {
        console.log('Error in fetchOneTask:', err);
      }
    },
    // Adds a new task to db
    async [ActionTypes.ADD_TASK]({ dispatch }, task: NewTask): Promise<void> {
      try {
        await axios.post('/api/todos/add', task);
        await dispatch(ActionTypes.FETCH_TASKS);
      } catch (err) {
        console.log('Error in addTask:', err);
      }
    },
    // Sends edits of a task from EditDialog to db
    async [ActionTypes.EDIT_TASK]({ dispatch }, task: TaskSort): Promise<void> {
      try {
        await axios.put('/api/todos/edit', task);
        await dispatch(ActionTypes.FETCH_TASKS, task.sort);
      } catch (err) {
        console.log('Error in editTask:', err);
      }
    },
    // Toggles done status of a task from TaskList
    async [ActionTypes.TOGGLE_DONE_TASK](
      { dispatch },
      sentIdSort: IdSort
    ): Promise<void> {
      const { id, sort } = sentIdSort;
      try {
        await axios.put(`/api/todos/${id}`);
        await dispatch(ActionTypes.FETCH_TASKS, sort);
      } catch (err) {
        console.log('Error in toggleDoneTask:', err);
      }
    },
    // Toggles priority level of task from TaskList
    async [ActionTypes.TOGGLE_TASK_PRIORITY](
      { dispatch },
      priorityToEdit: IdSortPriority
    ): Promise<void> {
      try {
        await axios.put('/api/todos/priority', priorityToEdit);
        await dispatch(ActionTypes.FETCH_TASKS, priorityToEdit.sort);
      } catch (err) {
        console.log('Error in toggleTaskPriority:', err);
      }
    },
    // Deletes a task from the db
    async [ActionTypes.DELETE_TASK](
      { dispatch },
      sentIdSort: IdSort
    ): Promise<void> {
      const { id, sort } = sentIdSort;
      try {
        await axios.delete(`/api/todos/${id}`);
        await dispatch(ActionTypes.FETCH_TASKS, sort);
      } catch (err) {
        console.log('Error in deleteTask:', err);
      }
    },
  },
});
