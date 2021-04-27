<template>
  <div class="form-container">
    <div class="row-1-container">
      <input class="task-input" placeholder="New Task" v-model="task" />
    </div>
    <div class="row-2-container">
      <div class="date-priority-button-container">
        <select
          class="priority-select"
          name="priority"
          placeholder="Priority"
          v-model="priority"
        >
          <option value="!" label="!" />
          <option value="!!" label="!!" />
          <option value="!!!" label="!!!" />
        </select>
        <input
          class="date-picker"
          type="date"
          placeholder="Due Date"
          v-model="due_date"
        />
        <button class="submit-button" type="primary" @click="addTask()">
          Add
          <i class="material-icons">add</i>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, defineComponent, toRefs } from 'vue';
import { useStore } from '../store/store';
// Interfaces
import { NewTask } from '../models/models';
// Action type enum
import { actionTypes } from '../models/actionTypes';

export default defineComponent({
  name: 'NewTaskForm',
  setup() {
    const store = useStore();
    // Reactive object which holds new task info
    const enteredTask: NewTask = reactive({
      task: '',
      due_date: undefined,
      priority: '',
    });

    // Sends new task for POST route to server, resets values of enteredTask
    const addTask = (): void => {
      store.dispatch(actionTypes.addTask, enteredTask);
      enteredTask.task = '';
      enteredTask.due_date = undefined;
      enteredTask.priority = '';
    };

    return { ...toRefs(enteredTask), addTask };
  },
});
</script>

<style>
.date-picker {
  width: 220px;
}
.date-priority-button-container {
  display: flex;
  width: 450px;
  justify-content: space-between;
}
.form-container {
  padding: 20px;
  margin-bottom: 40px;
  background-color: #baffff;
}
.priority-select {
  width: 100px;
}
.row-1-container {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
.row-2-container {
  display: flex;
  justify-content: center;
}
.task-input {
  max-width: 450px;
}
.submit-button {
  width: 100px;
  height: 40px;
}
</style>
