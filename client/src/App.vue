<template>
  <new-task-form />
  <task-list />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NewTaskForm from '@/components/NewTaskForm.vue';
import TaskList from '@/components/TaskList.vue';

export default defineComponent({
  name: 'App',
  components: { NewTaskForm, TaskList },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
