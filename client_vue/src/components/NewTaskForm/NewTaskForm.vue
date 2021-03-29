<template>
  <h5>Add a new Task:</h5>
  <form @submit.prevent="addNewTodo">
    <label for="new-task">Add new Task:</label>
    <input id="new-task" placeholder="New Task" v-model="taskInput" />
    <label for="priority">Set Priority:</label>
    <select name="priority" id="priority">
      <option value="!">!</option>
      <option value="!!">!!</option>
      <option value="!!!">!!!</option>
    </select>
    <label for="due-date">Set Due Date:</label>
    <input id="due-date" placeholder="Due Date" type="date" />
    <el-button type="primary">Add</el-button>
  </form>
  <div>
    <h3>{{ taskInput }}</h3>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const taskInput = ref('');
    const addNewTodo = () => {
      console.log(taskInput.value);
      taskInput.value = '';
    };
    return {
      addNewTodo,
      taskInput,
    };
  },
  mounted() {
    this.$store.dispatch('FETCH_TASKS');
  },
};
</script>
