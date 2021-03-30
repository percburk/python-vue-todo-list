<template>
  <div>
    <NewTaskForm />
    <TaskList />
  </div>
</template>

<script lang="ts">
import NewTaskForm from '@/components/NewTaskForm/NewTaskForm.vue';
import TaskList from '@/components/TaskList/TaskList.vue';
export default {
  name: 'App',
  components: {
    NewTaskForm,
    TaskList,
  },
};
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
