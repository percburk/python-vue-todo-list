import { createStore, createLogger } from 'vuex';
import axios from 'axios';
// Models
import { Task, NewTask } from '@/models/task.model';

export default createStore({
  plugins: process.env.NODE_ENV === 'development' ? [createLogger()] : [],
  state: {
    tasks: new Array<Task>(),
  },
  mutations: {
    SET_TASKS(state, tasks) {
      state.tasks = tasks;
    },
  },
  actions: {
    ADD_TASK(context, task: NewTask) {
      context.commit('ADD_TASK', task);
    },
    EDIT_TASK(context, task: Task) {
      context.commit('EDIT_TASK', task);
    },
    DELETE_TASK(context, id: number) {
      context.commit('DELETE_TASK', id);
    },
    FETCH_TASKS({ commit }) {
      axios
        .get('http://localhost:5000/api/todos')
        .then((response) => commit('SET_TASKS', response.data))
        .catch((err) => console.log('Error in getting tasks', err));
    },
  },
  getters: {
    allTasks(state): Array<Task> {
      return state.tasks;
    },
  },
});
