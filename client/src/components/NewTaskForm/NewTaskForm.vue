<template>
  <h5>Add a new Task:</h5>
  <form>
    <label for="new-task-text">Add new Task:</label>
    <input
      id="new-task-text"
      placeholder="New Task"
      v-model="enteredTask.task"
    />
    <label for="priority">Set Priority:</label>
    <select name="priority" id="priority" v-model="enteredTask.priority">
      <option value="!">!</option>
      <option value="!!">!!</option>
      <option value="!!!">!!!</option>
    </select>
    <label for="due-date">Set Due Date:</label>
    <input
      id="due-date"
      placeholder="Due Date"
      type="date"
      v-model="enteredTask.due_date"
    />
    <el-button type="primary" @click="addTask(enteredTask)">Add</el-button>
  </form>
</template>

<script lang="ts">
import { reactive, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { NewTask } from '@/models/task.model';
import { key } from '@/store/store';

export default defineComponent({
  setup() {
    const store = useStore(key);
    const enteredTask = reactive({ task: '', due_date: '', priority: '' });
    return {
      enteredTask,
      addTask: (task: NewTask) => store.dispatch('addTask', task),
    };
  },
});
</script>
