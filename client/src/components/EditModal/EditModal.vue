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
            editTask(oneTask);
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
import { Task } from '@/models/models';

export default defineComponent({
  name: 'EditModal',
  props: ['dialogOpen'],
  setup(props) {
    console.log(props);
    const store = useStore();
    let { open } = toRefs(props.dialogOpen);

    return {
      open,
      oneTask: computed(() => store.state.oneTask),
      editTask: (task: Task) => {
        store.dispatch('editTask', task);
      },
    };
  },
});
</script>
