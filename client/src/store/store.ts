import { InjectionKey } from 'vue';
import {
  createStore,
  createLogger,
  Store,
  useStore as useBaseStore,
} from 'vuex';
import axios from 'axios';
// Models
import { Task, NewTask, EditPriority, State } from '@/models/models';
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
  },

  mutations: {
    setTasks(state, tasksFromServer: Task[]) {
      state.tasks = tasksFromServer;
    },
    setOneTask(state, oneTaskFromServer: Task) {
      state.oneTask = oneTaskFromServer;
    },
  },

  actions: {
    fetchTasks({ commit }) {
      axiosInstance
        .get('/api/todos')
        .then((response) => commit('setTasks', response.data))
        .catch((err) => console.log('Error in fetchTasks', err));
    },
    fetchOneTask({ commit }, id: number) {
      axiosInstance(`/api/todos/${id}`)
        .then((response) => commit('setOneTask', response.data))
        .catch((err) => console.log('Error in fetchOneTask', err));
    },
    addTask({ dispatch }, task: NewTask) {
      axiosInstance
        .post('/api/todos', task)
        .then(() => dispatch('fetchTasks'))
        .catch((err) => console.log('Error in addTask', err));
    },
    editTask({ dispatch }, task: Task) {
      axiosInstance
        .put('/api/todos/edit', task)
        .then(() => dispatch('fetchTasks'))
        .catch((err) => console.log('Error in editTask', err));
    },
    toggleDoneTask({ dispatch }, id: number) {
      axiosInstance
        .put(`/api/todos/${id}`)
        .then(() => dispatch('fetchTasks'))
        .catch((err) => console.log('Error in toggleDoneTask', err));
    },
    toggleTaskPriority({ dispatch }, priorityToEdit: EditPriority) {
      axiosInstance
        .put('/api/todos/priority', priorityToEdit)
        .then(() => dispatch('fetchTasks'))
        .catch((err) => console.log('Error in toggleTaskPriority', err));
    },
    deleteTask({ dispatch }, id: number) {
      axiosInstance
        .delete(`/api/todos/${id}`)
        .then(() => dispatch('fetchTasks'))
        .catch((err) => console.log('Error in deleteTask', err));
    },
  },
});

export function useStore(): Store<State> {
  return useBaseStore(key);
}
