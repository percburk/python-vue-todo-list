<template>
  <table>
    <thead>
      <tr>
        <th>Task</th>
        <th>Due Date</th>
        <th>Priority</th>
        <th>Done</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="task in tasks" :key="task.id">
        <td>{{ task.task }}</td>
        <td>{{ formatDate(task.due_date) }}</td>
        <td>{{ task.priority }}</td>
        <td>{{ task.done }}</td>
        <td>Actions</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { DateTime } from 'luxon';
export default {
  mounted() {
    this.$store.dispatch('FETCH_TASKS');
  },
  computed: {
    tasks() {
      return this.$store.state.tasks;
    },
  },
  methods: {
    formatDate(val) {
      return val ? DateTime.fromRFC2822(val).toFormat('LLL d') : '';
    },
  },
};
</script>
