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
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store/store';
import { DateTime } from 'luxon';

export default defineComponent({
  setup() {
    const store = useStore(key);
    onMounted(() => store.dispatch('fetchTasks'));
    return {
      tasks: computed(() => store.state.tasks),
      deleteTask: (id: number) => store.dispatch('deleteTask', id),
      toggleDone: (id: number) => store.dispatch('toggleDoneTask', id),
      formatDate: (date: string) =>
        date ? DateTime.fromRFC2822(date).toFormat('LLL d') : '',
    };
  },
});
</script>
