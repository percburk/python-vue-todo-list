<template>
  <el-dialog v-model="open">
    <el-form>
      <el-form-item label="Task">
        <el-input v-model="oneTask.task" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Priority">
        <el-select
          name="priority"
          placeholder="Priority"
          v-model="oneTask.priority"
        >
          <el-option value="!" label="!" />
          <el-option value="!!" label="!!" />
          <el-option value="!!!" label="!!!" />
        </el-select>
      </el-form-item>
      <el-form-item label="Due Date">
        <el-date-picker
          type="date"
          placeholder="Due Date"
          v-model="oneTask.due_date"
        />
      </el-form-item>
    </el-form>
    <div>
      <el-button @click="open = false">Cancel</el-button>
      <el-button
        type="primary"
        @click="
          () => {
            editTask({ ...oneTask, sort });
            open = false;
          }
        "
      >
        Confirm
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { useStore } from '@/store/store';
// Interfaces
import { TaskSort } from '@/models/models';
// Action types enum
import { actionTypes } from '@/models/actionTypes';

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
      store.dispatch(actionTypes.editTask, editedTask);
    };

    return { open, sort, oneTask, editTask };
  },
});
</script>
