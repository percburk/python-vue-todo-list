import { createApp } from 'vue';
import App from './App.vue';
import { store, key } from './store/store';
import VueFinalModal from 'vue-final-modal';
import './index.css';

createApp(App).use(store, key).use(VueFinalModal).mount('#app');
