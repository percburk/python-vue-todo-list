<template>
  <div class="container px-4 flex justify-center">
    <div>
      <div>
        <div class="flex">
          <button @click="selectSort('task')">
            <span class="material-icons">list</span>
          </button>
          <span v-if="sort === 'task'" class="material-icons">expand_less</span>
          <span v-else-if="sort === 'task-down'" class="material-icons">
            expand_more
          </span>
        </div>
      </div>
      <div class="flex justify-center">
        <div class="flex">
          <button @click="selectSort('priority')">
            <span class="material-icons">add</span>
          </button>
          <span v-if="sort === 'priority'" class="material-icons">
            expand_less
          </span>
          <span v-else-if="sort === 'priority-down'" class="material-icons">
            expand_more
          </span>
        </div>
      </div>
      <div>
        <div class="flex">
          <button @click="selectSort('date')">
            <span class="material-icons">event</span>
          </button>
          <span v-if="sort === 'date'" class="material-icons">expand_less</span>
          <span v-else-if="sort === 'date-down'" class="material-icons">
            expand_more
          </span>
        </div>
      </div>
      <div
        class="py-2 h-10 flex relative"
        v-for="task in tasks"
        :key="task.id"
        @mouseover="hover = task.id"
        @mouseleave="hover = false"
      >
        <div class="done-cell">
          <input
            type="checkbox"
            :checked="task.done"
            @click="toggleDone({ sort, id: task.id })"
          />
        </div>
        <div class="task-cell">{{ task.task }}</div>
        <div class="date-icon-cell">
          <button
            :disabled="task.done"
            @click="
              toggleTaskPriority({ sort, id: task.id, priority: task.priority })
            "
          >
            {{ task.priority }}
          </button>
        </div>
        <div :class="`date-icon-cell ${task.overdue ? 'past-due' : ''} `">
          {{ task.date_display }}
        </div>
        <div
          v-if="hover === task.id && !task.done"
          class="absolute bottom-0 right-20"
        >
          <button @click="showDialog(task.id)">
            <span class="material-icons">edit</span>
          </button>
          <button @click="deleteTask({ sort, id: task.id })">
            <span class="material-icons">close</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- <edit-dialog :dialogOpen="dialogOpen" /> -->
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, reactive, ref } from 'vue';
import { useStore } from '../store/store';
// Interfaces
import { IdSort, IdSortPriority } from '../models/models';
// Action types enum
import { actionTypes } from '../models/actionTypes';
// Components
import EditDialog from './EditDialog.vue';

export default defineComponent({
  name: 'TaskList',
  setup() {
    const store = useStore();
    const tasks = computed(() => store.state.tasks);
    const sort = computed(() => store.state.sort);
    const dialogOpen = reactive({ open: false });
    const hover = ref(false);

    onMounted(() => store.dispatch(actionTypes.fetchTasks));

    // Sets string for 'sort' in state, and triggers corresponding GET route
    const selectSort = (clickedSort: string): void => {
      const newSort: string =
        clickedSort === sort.value ? `${clickedSort}-down` : clickedSort;
      store.commit(actionTypes.setSort, newSort);
      store.dispatch(actionTypes.fetchTasks, newSort);
    };

    // Deletes task from db
    const deleteTask = (idDelete: IdSort): void => {
      store.dispatch(actionTypes.deleteTask, idDelete);
    };

    // Toggles done status of task on db
    const toggleDone = (idDone: IdSort): void => {
      store.dispatch(actionTypes.toggleDoneTask, idDone);
    };

    // Opens EditDialog and fetches task to edit from db, sets it in state
    const showDialog = (id: number): void => {
      dialogOpen.open = true;
      store.dispatch(actionTypes.fetchOneTask, id);
    };

    // Toggles task priority on db
    const toggleTaskPriority = (idPriority: IdSortPriority): void => {
      store.dispatch(actionTypes.toggleTaskPriority, idPriority);
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
      hover,
    };
  },
});
</script>

<style>
.arrow-color {
  color: #409eff;
}
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
.icon-large {
  font-size: 1.5em;
  margin-right: 5px;
}
.past-due {
  color: rgb(168, 45, 45);
}
.table-row {
  min-height: 40px;
}
</style>
