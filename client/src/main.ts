import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import App from '@/App.vue';
import { store, key } from '@/store/store';
import 'element-plus/lib/theme-chalk/index.css';

createApp(App)
  .use(store, key)
  .use(ElementPlus)
  .mount('#app');
