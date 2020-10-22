import { createApp } from 'vue';
import App from './App';
import * as Vuelity from '@/components';

const app = createApp(App);

Object.keys(Vuelity).forEach(el => {
    app.component(el, Vuelity[el]);
});
Vuelity.vtTabber();
app.use(Vuelity.VTToast);

app.mount('#app');
