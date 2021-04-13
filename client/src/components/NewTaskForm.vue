<template>
  <div class="form-container">
    <div class="input-container">
      <el-input
        class="task-input"
        placeholder="New Task"
        v-model="enteredTask.task"
      />
    </div>
    <div class="date-priority-button">
      <div class="priority-select">
        <el-select
          name="priority"
          placeholder="Priority"
          v-model="enteredTask.priority"
        >
          <el-option value="!" label="!" />
          <el-option value="!!" label="!!" />
          <el-option value="!!!" label="!!!" />
        </el-select>
      </div>
      <div class="date-picker">
        <el-date-picker
          type="date"
          placeholder="Due Date"
          v-model="enteredTask.due_date"
        />
      </div>
      <div class="submit-button">
        <el-button type="primary" round @click="addTask(enteredTask)">
          Add
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
.form-container {
  margin: 10px;
  padding-bottom: 40px;
}
.input-container {
  display: flex;
  justify-content: center;
  margin: 10px;
}
.task-input {
  max-width: 400px;
}
.date-priority-button {
  display: flex;
  justify-content: center;
}
.priority-select {
  width: 100px;
  margin: 0px 10px;
}
.date-picker {
  width: 220px;
  margin: 0px 10px;
}
.submit-button {
  margin: 0px 10px;
}
</style>
