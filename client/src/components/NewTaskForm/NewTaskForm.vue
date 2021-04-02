<template>
  <div class="form-container">
    <p>Add a New Task:</p>
    <div class="task-input">
      <el-input placeholder="New Task" v-model="enteredTask.task" />
    </div>
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
</template>

<script lang="ts">
import { reactive, defineComponent } from 'vue';
import { useStore } from '@/store/store';
import { NewTask } from '@/models/models';

export default defineComponent({
  setup() {
    const store = useStore();
    const enteredTask = reactive({ task: '', due_date: '', priority: '' });
    return {
      enteredTask,
      addTask: (task: NewTask) => store.dispatch('addTask', task),
    };
  },
});
</script>

<style>
.form-container {
  display: flex;
  flex-wrap: wrap;
  margin: 10px;
  align-items: center;
}
.task-input {
  width: 400px;
  margin: 0px 10px;
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
