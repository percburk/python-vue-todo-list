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

<style src="./index.css"></style>
