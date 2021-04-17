<template>
  <div class="form-container">
    <div class="row-1-container">
      <el-input
        class="task-input"
        placeholder="New Task"
        v-model="enteredTask.task"
      />
    </div>
    <div class="row-2-container">
      <div class="date-priority-button-container">
        <el-select
          class="priority-select"
          name="priority"
          placeholder="Priority"
          v-model="enteredTask.priority"
        >
          <el-option value="!" label="!" />
          <el-option value="!!" label="!!" />
          <el-option value="!!!" label="!!!" />
        </el-select>
        <el-date-picker
          class="date-picker"
          type="date"
          placeholder="Due Date"
          v-model="enteredTask.due_date"
        />
        <el-button
          class="submit-button"
          type="primary"
          @click="addTask(enteredTask)"
        >
          Add
          <i class="el-icon-plus" />
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, defineComponent } from 'vue';
import { useStore } from '@/store/store';
import { NewTask } from '@/models/models';

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
    const addTask = (task: NewTask): void => {
      store.dispatch('addTask', task);
      enteredTask.task = '';
      enteredTask.due_date = undefined;
      enteredTask.priority = '';
    };

    return { enteredTask, addTask };
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
