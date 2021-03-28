import { createStore, createLogger } from 'vuex';
import { Task } from '@/models/task.model';

export default createStore({
  plugins: process.env.NODE_ENV === 'development' ? [createLogger()] : [],
  state: {
    success: true,
    message: undefined,
    errorCode: 200,
    version: '1.0.0',
    data: new Array<Task>(),
  },
  mutations: {
    addTask(state, task: Task) {
      state.data.push(task);
    },
    editTask(state, task: Task) {
      const i: number = state.data.findIndex((item) => item.id === task.id);
      state.data[i] = task;
    },
    deleteTask(state, id: number) {
      const i: number = state.data.findIndex((item) => item.id === id);
      if (i > -1) {
        state.data.splice(i, 1);
      }
    },
  },
  actions: {
    addTask(context, task: Task) {
      context.commit('ADD_TASK', task);
    },
    editTask(context, task: Task) {
      context.commit('EDIT_TASK', task);
    },
    deleteTask(context, id: number) {
      context.commit('DELETE_TASK', id);
    },
  },
  getters: {
    tasks(state): Array<Task> {
      return state.data;
    },
  },
});
