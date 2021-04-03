import { InjectionKey } from 'vue';
import {
  createStore,
  createLogger,
  Store,
  useStore as useBaseStore,
} from 'vuex';
import axios from 'axios';
// Models
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

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  plugins: process.env.NODE_ENV === 'development' ? [createLogger()] : [],

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

  actions: {
    fetchTasks({ commit }, sort: string) {
      const whichRoute = sort ? `/api/todos/${sort}` : '/api/todos';
      axiosInstance
        .get(whichRoute)
        .then((response) => commit('setTasks', response.data))
        .catch((err) => console.log('Error in fetchTasks', err));
    },
    fetchOneTask({ commit }, id: number) {
      axiosInstance
        .get(`/api/todos/${id}`)
        .then((response) => commit('setOneTask', response.data))
        .catch((err) => console.log('Error in fetchOneTask', err));
    },
    addTask({ dispatch }, task: NewTask) {
      axiosInstance
        .post('/api/todos/add', task)
        .then(() => dispatch('fetchTasks'))
        .catch((err) => console.log('Error in addTask', err));
    },
    editTask({ dispatch }, task: TaskSort) {
      axiosInstance
        .put('/api/todos/edit', task)
        .then(() => dispatch('fetchTasks', task.sort))
        .catch((err) => console.log('Error in editTask', err));
    },
    toggleDoneTask({ dispatch }, sentIdSort: IdSort) {
      const { id, sort } = sentIdSort;
      axiosInstance
        .put(`/api/todos/${id}`)
        .then(() => dispatch('fetchTasks', sort))
        .catch((err) => console.log('Error in toggleDoneTask', err));
    },
    toggleTaskPriority({ dispatch }, priorityToEdit: IdSortPriority) {
      axiosInstance
        .put('/api/todos/priority', priorityToEdit)
        .then(() => dispatch('fetchTasks', priorityToEdit.sort))
        .catch((err) => console.log('Error in toggleTaskPriority', err));
    },
    deleteTask({ dispatch }, sentIdSort: IdSort) {
      const { id, sort } = sentIdSort;
      axiosInstance
        .delete(`/api/todos/${id}`)
        .then(() => dispatch('fetchTasks', sort))
        .catch((err) => console.log('Error in deleteTask', err));
    },
  },
});

export function useStore(): Store<State> {
  return useBaseStore(key);
}
