<template>
  <new-task-form />
  <task-list />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TaskList from './components/TaskList.vue';
import NewTaskForm from './components/NewTaskForm.vue';

export default defineComponent({
  name: 'App',
  components: {
    TaskList,
    NewTaskForm,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
