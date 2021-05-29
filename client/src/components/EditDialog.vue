<template>
  <v-tailwind-modal v-model="open">
    <form>
      <label for="task-input">Task</label>
      <input id="task-input" v-model="oneTask.task" autocomplete="off" />
      <label for="priority-select">Task</label>
      <select
        id="priority-select"
        name="priority"
        placeholder="Priority"
        v-model="oneTask.priority"
      >
        <option value="!" label="!" />
        <option value="!!" label="!!" />
        <option value="!!!" label="!!!" />
      </select>
      <label for="date-picker">Task</label>
      <input
        id="date-picker"
        type="date"
        placeholder="Due Date"
        v-model="oneTask.due_date"
      />
    </form>
    <div>
      <button @click="open = false">Cancel</button>
      <button
        type="primary"
        @click="
          () => {
            editTask({ ...oneTask, sort });
            open = false;
          }
        "
      >
        Confirm
      </button>
    </div>
  </v-tailwind-modal>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { useStore } from '../store/store';
// Interfaces
import { TaskSort } from '../models/models';
// Action types enum
import { ActionTypes } from '../models/ActionTypes';

export default defineComponent({
  name: 'EditDialog',
  props: ['dialogOpen'],
  setup(props) {
    const store = useStore();
    const sort = computed(() => store.state.sort);
    const oneTask = computed(() => store.state.oneTask);
    // Reactive object prop from TaskList, triggers open/close of dialog
    const { open } = toRefs(props.dialogOpen);

    // Sends edited task info for PUT route to server
    const editTask = (editedTask: TaskSort): void => {
      store.dispatch(ActionTypes.EDIT_TASK, editedTask);
    };

    return { open, sort, oneTask, editTask };
  },
});
</script>
