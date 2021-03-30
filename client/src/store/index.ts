import { createStore, createLogger, mapActions } from 'vuex';
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
    ADD_TASK({ dispatch }, task: NewTask) {
      axios
        .post('http://localhost:5000/api/todos', task)
        .then(() => dispatch('FETCH_TASKS'))
        .catch((err) => console.log('Error in ADD_TASK', err));
    },
    TOGGLE_DONE_TASK({ dispatch }, id: number) {
      axios
        .put(`http://localhost:5000/api/todos/${id}`)
        .then(() => dispatch('FETCH_TASKS'))
        .catch((err) => console.log('Error in TOGGLE_DONE_TASKS', err));
    },
    DELETE_TASK({ dispatch }, id: number) {
      axios
        .delete(`http://localhost:5000/api/todos/${id}`)
        .then(() => dispatch('FETCH_TASKS'))
        .catch((err) => console.log('Error in DELETE_TASK', err));
    },
    FETCH_TASKS({ commit }) {
      axios
        .get('http://localhost:5000/api/todos')
        .then((response) => commit('SET_TASKS', response.data))
        .catch((err) => console.log('Error in FETCH_TASKS', err));
    },
  },
});
