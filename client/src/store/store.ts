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
// Create axios instance with proxy
const axiosInstance = axios.create({ baseURL: process.env.VUE_APP_HTTP_PROXY });
// Injection key, so useStore() hook can be used in Vue components
export const key: InjectionKey<Store<State>> = Symbol();

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
      due_date: undefined,
    },
    sort: '',
  },

  // Mutations to set the key/values in state object, type checked
  mutations: {
    setTasks(state, tasksFromServer: Task[]) {
      state.tasks = tasksFromServer;
    },
    setOneTask(state, oneTaskFromServer: Task) {
      state.oneTask = oneTaskFromServer;
    },
    setSort(state, sort: string) {
      state.sort = sort;
    },
  },

  // Async actions that trigger routes to the server
  actions: {
    // Fetches all tasks from db. If sort is present in state, sends it along to 
    // server to trigger different SQL "ORDER BY" queries
    fetchTasks({ commit }, sort: string) {
      const whichRoute = sort ? `/api/todos/sort/${sort}` : '/api/todos';
      axiosInstance
        .get(whichRoute)
        .then((response) => commit('setTasks', response.data))
        .catch((err) => console.log('Error in fetchTasks', err));
    },
    // Fetches one task to edit in EditDialog
    fetchOneTask({ commit }, id: number) {
      axiosInstance
        .get(`/api/todos/${id}`)
        .then((response) => commit('setOneTask', response.data))
        .catch((err) => console.log('Error in fetchOneTask', err));
    },
    // Adds a new task to db
    addTask({ dispatch }, task: NewTask) {
      axiosInstance
        .post('/api/todos/add', task)
        .then(() => dispatch('fetchTasks'))
        .catch((err) => console.log('Error in addTask', err));
    },
    // Sends edits of a task from EditDialog to db
    editTask({ dispatch }, task: TaskSort) {
      axiosInstance
        .put('/api/todos/edit', task)
        .then(() => dispatch('fetchTasks', task.sort))
        .catch((err) => console.log('Error in editTask', err));
    },
    // Toggles done status of a task from TaskList
    toggleDoneTask({ dispatch }, sentIdSort: IdSort) {
      const { id, sort } = sentIdSort;
      axiosInstance
        .put(`/api/todos/${id}`)
        .then(() => dispatch('fetchTasks', sort))
        .catch((err) => console.log('Error in toggleDoneTask', err));
    },
    // Toggles priority level of task from TaskList
    toggleTaskPriority({ dispatch }, priorityToEdit: IdSortPriority) {
      axiosInstance
        .put('/api/todos/priority', priorityToEdit)
        .then(() => dispatch('fetchTasks', priorityToEdit.sort))
        .catch((err) => console.log('Error in toggleTaskPriority', err));
    },
    // Deletes a task from the db
    deleteTask({ dispatch }, sentIdSort: IdSort) {
      const { id, sort } = sentIdSort;
      axiosInstance
        .delete(`/api/todos/${id}`)
        .then(() => dispatch('fetchTasks', sort))
        .catch((err) => console.log('Error in deleteTask', err));
    },
  },
});

// Custom hook that provides injection key to all instances of useStore()
// being called in components
export function useStore(): Store<State> {
  return useBaseStore(key);
}
