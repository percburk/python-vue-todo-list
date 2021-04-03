import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import TaskList from '@/components/TaskList/TaskList.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: TaskList,
  },
];
const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
