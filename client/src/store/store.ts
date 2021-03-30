import { InjectionKey } from 'vue';
import { createStore, createLogger, Store } from 'vuex';
import axios from 'axios';
// Models
import { Task, NewTask } from '@/models/task.model';
// Create axios instance with proxy
const axiosInstance = axios.create({ baseURL: process.env.VUE_APP_HTTP_PROXY });

export interface State {
  tasks: Task[];
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  plugins: process.env.NODE_ENV === 'development' ? [createLogger()] : [],

  state: {
    tasks: [],
  },

  mutations: {
    setTasks(state, tasksFromServer: Task[]) {
      state.tasks = tasksFromServer;
    },
  },
  
  actions: {
    addTask({ dispatch }, task: NewTask) {
      axiosInstance
        .post('/api/todos', task)
        .then(() => dispatch('fetchTasks'))
        .catch((err) => console.log('Error in ADD_TASK', err));
    },
    toggleDoneTask({ dispatch }, id: number) {
      axiosInstance
        .put(`/api/todos/${id}`)
        .then(() => dispatch('fetchTasks'))
        .catch((err) => console.log('Error in TOGGLE_DONE_TASKS', err));
    },
    deleteTask({ dispatch }, id: number) {
      axiosInstance
        .delete(`/api/todos/${id}`)
        .then(() => dispatch('fetchTasks'))
        .catch((err) => console.log('Error in DELETE_TASK', err));
    },
    fetchTasks({ commit }) {
      axiosInstance
        .get('/api/todos')
        .then((response) => commit('setTasks', response.data))
        .catch((err) => console.log('Error in FETCH_TASKS', err));
    },
  },
});
