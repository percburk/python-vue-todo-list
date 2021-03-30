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
        <td>
          <el-button
            v-if="task.done"
            type="success"
            icon="el-icon-check"
            round
            @click="toggleDone(task.id)"
          />
          <el-button
            v-else
            icon="el-icon-check"
            round
            @click="toggleDone(task.id)"
          />
        </td>
        <td>
          <el-button-group>
            <el-button type="primary" icon="el-icon-edit" round />
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteTask(task.id)"
              round
            />
          </el-button-group>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { DateTime } from 'luxon';
import { defineComponent } from 'vue';

export default defineComponent({
  mounted() {
    return this.$store.dispatch('FETCH_TASKS');
  },
  computed: {
    tasks() {
      return this.$store.state.tasks;
    },
    toggleButton(done: boolean): string {
      return done ? 'primary' : '';
    },
  },
  methods: {
    formatDate(date: string): string {
      return date ? DateTime.fromRFC2822(date).toFormat('LLL d') : '';
    },
    deleteTask(id: number) {
      this.$store.dispatch('DELETE_TASK', id);
    },
    toggleDone(id: number) {
      this.$store.dispatch('TOGGLE_DONE_TASK', id);
    },
  },
});
</script>
