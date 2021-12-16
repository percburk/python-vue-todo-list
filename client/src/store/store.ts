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
  IdSort,
  TaskSort,
} from '../models/TaskResource';
// Action types enum
import { ActionTypes } from '../models/ActionTypesResource';
// State model
import { State } from '../models/StateResource';

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
    [ActionTypes.SET_TASKS]: (state: State, tasksFromServer: Task[]) => {
      state.tasks = tasksFromServer;
    },
    [ActionTypes.SET_ONE_TASK]: (state: State, oneTaskFromServer: Task) => {
      state.oneTask = oneTaskFromServer;
    },
    [ActionTypes.SET_SORT]: (state: State, sort: string) => {
      state.sort = sort;
    },
  },

  // Async actions that trigger routes to the server
  actions: {
    // Fetches all tasks from db. If sort is present in state, sends it along
    // to server to trigger different SQL 'ORDER BY' queries
    [ActionTypes.FETCH_TASKS]: async ({ commit }, sort: string) => {
      const whichRoute = `/api/todos${sort ? `/sort/${sort}` : ''}`;
      try {
        const response = await axios.get(whichRoute);
        commit(ActionTypes.FETCH_ONE_TASK, response.data);
      } catch (err) {
        console.log('Error in FETCH_TASKS:', err);
      }
    },
    // Fetches one task to edit in EditDialog
    [ActionTypes.FETCH_ONE_TASK]: async ({ commit }, id: number) => {
      try {
        const response = await axios.get(`/api/todos/${id}`);
        commit(ActionTypes.SET_ONE_TASK, response.data);
      } catch (err) {
        console.log('Error in FETCH_ONE_TASK:', err);
      }
    },
    // Adds a new task to db
    [ActionTypes.ADD_TASK]: async ({ dispatch }, task: NewTask) => {
      try {
        await axios.post('/api/todos/add', task);
        await dispatch(ActionTypes.FETCH_TASKS);
      } catch (err) {
        console.log('Error in ADD_TASK:', err);
      }
    },
    // Sends edits of a task from EditDialog to db
    [ActionTypes.EDIT_TASK]: async ({ dispatch }, task: TaskSort) => {
      try {
        await axios.put('/api/todos/edit', task);
        await dispatch(ActionTypes.FETCH_TASKS, task.sort);
      } catch (err) {
        console.log('Error in EDIT_TASK:', err);
      }
    },
    // Toggles done status of a task from TaskList
    [ActionTypes.TOGGLE_DONE_TASK]: async ({ dispatch }, sentIdSort: IdSort) => {
      const { id, sort } = sentIdSort;
      try {
        await axios.put(`/api/todos/${id}`);
        await dispatch(ActionTypes.FETCH_TASKS, sort);
      } catch (err) {
        console.log('Error in TOGGLE_DONE_TASK:', err);
      }
    },
    // Toggles priority level of task from TaskList
    [ActionTypes.TOGGLE_TASK_PRIORITY]: async (
      { dispatch },
      priorityToEdit: IdSortPriority
    ) => {
      try {
        await axios.put('/api/todos/priority', priorityToEdit);
        await dispatch(ActionTypes.FETCH_TASKS, priorityToEdit.sort);
      } catch (err) {
        console.log('Error in TOGGLE_TASK_PRIORITY:', err);
      }
    },
    // Deletes a task from the db
    [ActionTypes.DELETE_TASK]: async ({ dispatch }, sentIdSort: IdSort) => {
      const { id, sort } = sentIdSort;
      try {
        await axios.delete(`/api/todos/${id}`);
        await dispatch(ActionTypes.FETCH_TASKS, sort);
      } catch (err) {
        console.log('Error in DELETE_TASK:', err);
      }
    },
  },
});
