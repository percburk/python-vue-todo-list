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
        <td>
          <el-button-group>
            <el-button type="primary" icon="el-icon-edit" />
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteTask(task.id)"
            />
          </el-button-group>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { DateTime } from 'luxon';
export default {
  mounted() {
    return this.$store.dispatch('FETCH_TASKS');
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
    deleteTask(id) {
      return this.$store.dispatch('DELETE_TASK', id);
    },
  },
};
</script>
