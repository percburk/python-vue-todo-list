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
} from '@/models/models';
// Action types enum
import { actionTypes } from '@/models/actionTypes';

// Create axios instance with proxy
const axiosInstance = axios.create({ baseURL: process.env.VUE_APP_HTTP_PROXY });

// Injection key, so useStore() hook can be used in Vue components
export const key: InjectionKey<Store<State>> = Symbol();

// Custom hook that provides injection key to all instances of useStore()
// being called in components
export const useStore = (): Store<State> => {
  return useBaseStore(key);
};

// Store instance
export const store = createStore<State>({
  // Add logger to display state in console when in development mode
  plugins: process.env.NODE_ENV === 'development' ? [createLogger()] : [],

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
      overdue: false,
    },
    sort: '',
  },

  // Mutations to set the key/values in state object, type checked
  mutations: {
    [actionTypes.setTasks](state, tasksFromServer: Task[]): void {
      state.tasks = tasksFromServer;
    },
    [actionTypes.setOneTask](state, oneTaskFromServer: Task): void {
      state.oneTask = oneTaskFromServer;
    },
    [actionTypes.setSort](state, sort: string): void {
      state.sort = sort;
    },
  },

  // Async actions that trigger routes to the server
  actions: {
    // Fetches all tasks from db. If sort is present in state, sends it along
    // to server to trigger different SQL "ORDER BY" queries
    async [actionTypes.fetchTasks]({ commit }, sort: string): Promise<void> {
      const whichRoute = sort ? `/api/todos/sort/${sort}` : '/api/todos';
      try {
        const response = await axiosInstance.get(whichRoute);
        commit(actionTypes.setTasks, response.data);
      } catch (err) {
        console.log('Error in fetchTasks:', err);
      }
    },
    // Fetches one task to edit in EditDialog
    async [actionTypes.fetchOneTask]({ commit }, id: number): Promise<void> {
      try {
        const response = await axiosInstance.get(`/api/todos/${id}`);
        commit(actionTypes.setOneTask, response.data);
      } catch (err) {
        console.log('Error in fetchOneTask:', err);
      }
    },
    // Adds a new task to db
    async [actionTypes.addTask]({ dispatch }, task: NewTask): Promise<void> {
      try {
        await axiosInstance.post('/api/todos/add', task);
        await dispatch(actionTypes.fetchTasks);
      } catch (err) {
        console.log('Error in addTask:', err);
      }
    },
    // Sends edits of a task from EditDialog to db
    async [actionTypes.editTask]({ dispatch }, task: TaskSort): Promise<void> {
      try {
        await axiosInstance.put('/api/todos/edit', task);
        await dispatch(actionTypes.fetchTasks, task.sort);
      } catch (err) {
        console.log('Error in editTask:', err);
      }
    },
    // Toggles done status of a task from TaskList
    async [actionTypes.toggleDoneTask](
      { dispatch },
      sentIdSort: IdSort
    ): Promise<void> {
      const { id, sort } = sentIdSort;
      try {
        await axiosInstance.put(`/api/todos/${id}`);
        await dispatch(actionTypes.fetchTasks, sort);
      } catch (err) {
        console.log('Error in toggleDoneTask:', err);
      }
    },
    // Toggles priority level of task from TaskList
    async [actionTypes.toggleTaskPriority](
      { dispatch },
      priorityToEdit: IdSortPriority
    ): Promise<void> {
      try {
        await axiosInstance.put('/api/todos/priority', priorityToEdit);
        await dispatch(actionTypes.fetchTasks, priorityToEdit.sort);
      } catch (err) {
        console.log('Error in toggleTaskPriority:', err);
      }
    },
    // Deletes a task from the db
    async [actionTypes.deleteTask](
      { dispatch },
      sentIdSort: IdSort
    ): Promise<void> {
      const { id, sort } = sentIdSort;
      try {
        await axiosInstance.delete(`/api/todos/${id}`);
        await dispatch(actionTypes.fetchTasks, sort);
      } catch (err) {
        console.log('Error in deleteTask:', err);
      }
    },
  },
});
