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
import { TaskSort } from '@/models/models';

export default defineComponent({
  name: 'EditDialog',
  props: ['dialogOpen'],
  setup(props) {
    const store = useStore();
    // Reactive object prop from TaskList, triggers open/close of dialog
    let { open } = toRefs(props.dialogOpen);

    return {
      open,
      sort: computed(() => store.state.sort),
      oneTask: computed(() => store.state.oneTask),
      // Sends edited task info for PUT route to server
      editTask: (editedTask: TaskSort) => {
        store.dispatch('editTask', editedTask);
      },
    };
  },
});
</script>
