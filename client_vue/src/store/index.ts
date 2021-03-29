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
    addTask(context, task: NewTask) {
      context.commit('ADD_TASK', task);
    },
    editTask(context, task: Task) {
      context.commit('EDIT_TASK', task);
    },
    deleteTask(context, id: number) {
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
    tasks(state): Array<Task> {
      return state.tasks;
    },
  },
});
