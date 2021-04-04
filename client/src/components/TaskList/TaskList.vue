<template>
  <div class="task-container">
    <table class="task-table">
      <thead>
        <tr>
          <th></th>
          <th class="task-cell">
            <el-button type="text" @click="selectSort('task')">
              <i class="el-icon-notebook-2" />
            </el-button>
          </th>
          <th>
            <el-button type="text" @click="selectSort('date')">
              <i class="el-icon-date" />
            </el-button>
          </th>
          <th>
            <el-button type="text" @click="selectSort('priority')">
              <i class="el-icon-top" />
            </el-button>
          </th>
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
              @click="toggleDone({ sort, id: task.id })"
            />
            <el-button
              v-else
              size="small"
              icon="el-icon-check"
              round
              @click="toggleDone({ sort, id: task.id })"
            />
          </td>
          <td class="task-cell">{{ task.task }}</td>
          <td>{{ formatDate(task.due_date) }}</td>
          <td>
            <el-button
              size="small"
              round
              @click="
                toggleTaskPriority({
                  sort,
                  id: task.id,
                  priority: task.priority,
                })
              "
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
                @click="deleteTask({ sort, id: task.id })"
                round
              />
            </el-button-group>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <EditDialog v-model:dialogOpen="dialogOpen" />
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, reactive } from 'vue';
import { DateTime } from 'luxon';
import { useStore } from '@/store/store';
import { IdSort, IdSortPriority } from '@/models/models';
// Components
import EditDialog from '../EditDialog/EditDialog.vue';

export default defineComponent({
  name: 'TaskList',
  components: { EditDialog },
  setup() {
    const store = useStore();
    const dialogOpen = reactive({ open: false });
    onMounted(() => store.dispatch('fetchTasks'));
    return {
      dialogOpen,
      tasks: computed(() => store.state.tasks),
      sort: computed(() => store.state.sort),
      selectSort: (newSort: string) => {
        store.commit('setSort', newSort);
        store.dispatch('fetchTasks', newSort);
      },
      deleteTask: (idDelete: IdSort) => store.dispatch('deleteTask', idDelete),
      toggleDone: (idDone: IdSort) => store.dispatch('toggleDoneTask', idDone),
      showDialog: (id: number) => {
        dialogOpen.open = true;
        store.dispatch('fetchOneTask', id);
      },
      toggleTaskPriority: (idPriority: IdSortPriority) =>
        store.dispatch('toggleTaskPriority', idPriority),
      formatDate: (date: string) =>
        date ? DateTime.fromISO(date).toFormat('LLL d') : '',
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
