<template>
  <h5>Add a new Task:</h5>
  <form>
    <label for="new-task-text">Add new Task:</label>
    <input id="new-task-text" placeholder="New Task" v-model="newTask.task" />
    <label for="priority">Set Priority:</label>
    <select name="priority" id="priority" v-model="newTask.priority">
      <option value="!">!</option>
      <option value="!!">!!</option>
      <option value="!!!">!!!</option>
    </select>
    <label for="due-date">Set Due Date:</label>
    <input
      id="due-date"
      placeholder="Due Date"
      type="date"
      v-model="newTask.due_date"
    />
    <el-button type="primary" @click="addNewTask(newTask)">Add</el-button>
  </form>
</template>

<script>
import { reactive } from 'vue';

export default {
  setup() {
    const newTask = reactive({ task: '', due_date: '', priority: '' });
    return {
      newTask,
    };
  },
  methods: {
    addNewTask: function(newTask) {
      console.log(newTask);
      return this.$store.dispatch('ADD_TASK', newTask);
    },
  },
};
</script>
