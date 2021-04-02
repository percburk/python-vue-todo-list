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
        <td>
          <el-button
            size="small"
            round
            @click="toggleTaskPriority(task.id, task.priority)"
          >
            {{ task.priority }}
          </el-button>
        </td>
        <td>
          <el-button
            v-if="task.done"
            size="small"
            type="success"
            icon="el-icon-check"
            round
            @click="toggleDone(task.id)"
          />
          <el-button
            v-else
            size="small"
            icon="el-icon-check"
            round
            @click="toggleDone(task.id)"
          />
        </td>
        <td>
          <el-button-group>
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              round
              @click="showDialog(task.id)"
            />
            <el-button
              size="small"
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
  <EditModal v-model:dialogOpen="dialogOpen" />
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, reactive } from 'vue';
import { useStore } from '@/store/store';
import { DateTime } from 'luxon';
// Components
import EditModal from '../EditModal/EditModal.vue';

export default defineComponent({
  setup() {
    const store = useStore();
    const dialogOpen = reactive({ open: false });
    onMounted(() => store.dispatch('fetchTasks'));
    return {
      dialogOpen,
      tasks: computed(() => store.state.tasks),
      deleteTask: (id: number) => store.dispatch('deleteTask', id),
      toggleDone: (id: number) => store.dispatch('toggleDoneTask', id),
      showDialog: (id: number) => {
        dialogOpen.open = true;
        store.dispatch('fetchOneTask', id);
      },
      toggleTaskPriority: (id: number, priority: string) =>
        store.dispatch('toggleTaskPriority', { id, priority }),
      formatDate: (date: string) =>
        date ? DateTime.fromRFC2822(date).toFormat('LLL d') : '',
    };
  },
  components: { EditModal },
});
</script>
