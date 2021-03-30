import { ComponentCustomProperties } from 'vue';
import { Store } from '@/vuex';
import Task from '@/models/task.model';

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    tasks: Task[];
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
