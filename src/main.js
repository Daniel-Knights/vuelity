import { createApp } from 'vue';
import App from './App';
import Components from './components';

const app = createApp(App);

Object.keys(Components).forEach(name => {
    app.component(name, Components[name]);
});

app.mount('#app');
