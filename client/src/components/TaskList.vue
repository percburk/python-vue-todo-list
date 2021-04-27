<template>
  <nav class="flex items-center justify-between flex-wrap bg-teal-500 p-6">
    <div class="flex items-center flex-shrink-0 text-white mr-6">
      <svg
        class="fill-current h-8 w-8 mr-2"
        width="54"
        height="54"
        viewBox="0 0 54 54"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"
        />
      </svg>
      <span class="font-semibold text-xl tracking-tight">Tailwind CSS</span>
    </div>
    <div class="block lg:hidden">
      <button
        class="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
      >
        <svg
          class="fill-current h-3 w-3"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </button>
    </div>
    <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
      <div class="text-sm lg:flex-grow">
        <a
          href="#responsive-header"
          class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
        >
          Docs
        </a>
        <a
          href="#responsive-header"
          class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
        >
          Examples
        </a>
        <a
          href="#responsive-header"
          class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white"
        >
          Blog
        </a>
      </div>
      <div>
        <a
          href="#"
          class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
          >Download</a
        >
      </div>
    </div>
  </nav>
  <div class="container mx-auto">
    <div class="flex">
      <div>
        <div class="flex">
          <button @click="selectSort('task')">
            <i class="material-icons">list</i>
          </button>
          <i v-if="sort === 'task'" class="material-icons">
            expand_less
          </i>
          <i v-else-if="sort === 'task-down'" class="material-icons">
            expand_more
          </i>
        </div>
      </div>
      <div>
        <div class="flex">
          <button @click="selectSort('priority')">
            <span class="material-icons">add</span>
          </button>
          <i v-if="sort === 'priority'" class="material-icons">
            expand_less
          </i>
          <i v-else-if="sort === 'priority-down'" class="material-icons">
            expand_more
          </i>
        </div>
      </div>
      <div>
        <div class="flex">
          <button @click="selectSort('date')">
            <span class="material-icons">event</span>
          </button>
          <i v-if="sort === 'date'" class="material-icons">
            expand_less
          </i>
          <i v-else-if="sort === 'date-down'" class="material-icons">
            expand_more
          </i>
        </div>
      </div>
    </div>
    <div
      class="table-row"
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
            toggleTaskPriority({
              sort,
              id: task.id,
              priority: task.priority,
            })
          "
        >
          {{ task.priority }}
        </button>
      </div>
      <div :class="`date-icon-cell ${task.overdue ? 'past-due' : ''}`">
        {{ task.date_display }}
      </div>
      <div v-if="hover === task.id && !task.done">
        <button :disabled="task.done" @click="showDialog(task.id)">
          <i class="material-icons">edit</i>
        </button>
        <button
          :disabled="task.done"
          @click="deleteTask({ sort, id: task.id })"
        >
          <i class="material-icons">close</i>
        </button>
      </div>
    </div>
  </div>
  <edit-dialog :dialogOpen="dialogOpen" />
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, reactive, ref } from 'vue';
import { useStore } from '@/store/store';
// Interfaces
import { IdSort, IdSortPriority } from '@/models/models';
// Action types enum
import { actionTypes } from '@/models/actionTypes';
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
