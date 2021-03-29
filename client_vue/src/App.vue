<template>
  <div>
    <NewTaskForm />
  </div>
</template>

<script>
import NewTaskForm from './components/NewTaskForm/NewTaskForm';
export default {
  name: 'App',
  components: {
    NewTaskForm,
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
