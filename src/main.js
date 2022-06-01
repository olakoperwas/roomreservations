import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/base.css'
import BootstrapVue3 from 'bootstrap-vue-3'
import VueKonva from 'vue-konva'
import VueCookies from 'vue-cookies';



import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'v-calendar/dist/style.css';
import VCalendar from 'v-calendar';
import VueTimepicker from 'vue3-timepicker'
import 'vue3-timepicker/dist/VueTimepicker.css'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';


const app = createApp(App)
app.use(Datepicker)
app.use(VueTimepicker)
app.use(VueCookies)
app.use(VueKonva)
app.use(VCalendar, {})
app.use(BootstrapVue3)
app.use(router)
app.mount('#app')


