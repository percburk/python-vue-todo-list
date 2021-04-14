<template>
  <div class="task-container">
    <table>
      <thead>
        <tr>
          <th></th>
          <th class="task-cell">
            <el-button type="text" @click="selectSort('task')">
              <i class="el-icon-notebook-2 icon-large" />
            </el-button>
            <i v-if="sort === 'task'" class="el-icon-arrow-up" />
            <i v-else-if="sort === 'task-down'" class="el-icon-arrow-down" />
          </th>
          <th>
            <div class="icon-container">
              <div class="icon-div">
                <el-button type="text" @click="selectSort('date')">
                  <i class="el-icon-date icon-large" />
                </el-button>
                <i v-if="sort === 'date'" class="el-icon-arrow-up" />
                <i
                  v-else-if="sort === 'date-down'"
                  class="el-icon-arrow-down"
                />
              </div>
            </div>
          </th>
          <th>
            <div class="icon-container">
              <div class="icon-div">
                <el-button type="text" @click="selectSort('priority')">
                  <i class="el-icon-plus icon-large" />
                </el-button>
                <i v-if="sort === 'priority'" class="el-icon-arrow-up" />
                <i
                  v-else-if="sort === 'priority-down'"
                  class="el-icon-arrow-down"
                />
              </div>
            </div>
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td class="done-cell">
            <el-button
              size="small"
              :type="task.done ? 'success' : 'default'"
              icon="el-icon-check"
              round
              @click="toggleDone({ sort, id: task.id })"
            />
          </td>
          <td class="task-cell">{{ task.task }}</td>
          <td :class="`date-icon-cell ${dueDateClass(task.due_date)}`">
            {{ formatDate(task.due_date) }}
          </td>
          <td class="date-icon-cell">
            <el-button
              size="small"
              round
              :disabled="task.done"
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
          <td class="edit-delete-cell">
            <el-button-group>
              <el-button
                size="small"
                type="primary"
                icon="el-icon-edit"
                round
                :disabled="task.done"
                @click="showDialog(task.id)"
              />
              <el-button
                size="small"
                type="danger"
                icon="el-icon-delete"
                round
                :disabled="task.done"
                @click="deleteTask({ sort, id: task.id })"
              />
            </el-button-group>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <edit-dialog :dialogOpen="dialogOpen" />
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, reactive } from 'vue';
import { DateTime } from 'luxon';
import { useStore } from '@/store/store';
// Interfaces for type checking
import { IdSort, IdSortPriority } from '@/models/models';
// Components
import EditDialog from './EditDialog.vue';

export default defineComponent({
  name: 'TaskList',
  components: { EditDialog },
  setup() {
    const store = useStore();
    const tasks = computed(() => store.state.tasks);
    const sort = computed(() => store.state.sort);
    const dialogOpen = reactive({ open: false });

    onMounted(() => store.dispatch('fetchTasks'));

    // Sets string for 'sort' in state, and triggers corresponding GET route
    const selectSort = (clickedSort: string): void => {
      const newSort: string =
        clickedSort === sort.value ? `${clickedSort}-down` : clickedSort;
      store.commit('setSort', newSort);
      store.dispatch('fetchTasks', newSort);
    };

    // Deletes task from db
    const deleteTask = (idDelete: IdSort): void => {
      store.dispatch('deleteTask', idDelete);
    };

    // Toggles done status of task on db
    const toggleDone = (idDone: IdSort): void => {
      store.dispatch('toggleDoneTask', idDone);
    };

    // Opens EditDialog and fetches task to edit from db, sets it in state
    const showDialog = (id: number): void => {
      dialogOpen.open = true;
      store.dispatch('fetchOneTask', id);
    };

    // Toggles task priority on db
    const toggleTaskPriority = (idPriority: IdSortPriority): void => {
      store.dispatch('toggleTaskPriority', idPriority);
    };

    // Formats date to 'Feb 3' string, or 'Today', 'Tomorrow', or 'Yesterday'
    const formatDate = (date: string): string => {
      if (date) {
        const dueDateInterval = Math.ceil(
          DateTime.fromISO(date)
            .diffNow('days')
            .as('days')
        );
        switch (dueDateInterval) {
          case 0:
            return 'Today';
          case 1:
            return 'Tomorrow';
          case -1:
            return 'Yesterday';
          default:
            return DateTime.fromISO(date).toFormat('LLL d');
        }
      } else {
        return '';
      }
    };

    // Adds class to display text red if task is overdue
    const dueDateClass = (date: string): string => {
      if (date) {
        const dueDateInterval = Math.ceil(
          DateTime.fromISO(date)
            .diffNow('days')
            .as('days')
        );
        return dueDateInterval < 0
          ? 'past-due'
          : '';
      } else {
        return '';
      }
    };

    return {
      dialogOpen,
      tasks,
      sort,
      selectSort,
      deleteTask,
      toggleDone,
      showDialog,
      toggleTaskPriority,
      formatDate,
      dueDateClass,
    };
  },
});
</script>

<style>
.task-container {
  display: flex;
  justify-content: center;
}
.task-cell {
  width: 300px;
  text-align: left;
}
.icon-container {
  display: flex;
  flex-direction: row-reverse;
}
.icon-div {
  width: 51px;
  text-align: left;
}
.date-icon-cell {
  width: 80px;
  text-align: center;
  box-sizing: border-box;
}
.done-cell {
  width: 60px;
}
.edit-delete-cell {
  width: 100px;
}
.icon-large {
  font-size: 1.5em;
  margin-right: 5px;
}
.past-due {
  color: red;
}
</style>
