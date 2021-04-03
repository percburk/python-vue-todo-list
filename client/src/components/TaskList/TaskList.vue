<template>
  <div class="task-container">
    <table class="task-table">
      <thead>
        <tr>
          <th></th>
          <th class="task-cell"><i class="el-icon-notebook-2" /></th>
          <th><i class="el-icon-date" /></th>
          <th><i class="el-icon-top" /></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
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
          <td class="task-cell">{{ task.task }}</td>
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
  </div>
  <EditModal v-model:dialogOpen="dialogOpen" />
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, reactive } from 'vue';
import { DateTime } from 'luxon';
import { useStore } from '@/store/store';
// Components
import EditModal from '../EditModal/EditModal.vue';

export default defineComponent({
  name: 'TaskList',
  components: { EditModal },
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
});
</script>

<style>
.task-container {
  display: flex;
  justify-content: center;
}
.task-table {
  width: 600px;
}
.task-cell {
  width: 300px;
  text-align: left;
}
</style>
