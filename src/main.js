import {createApp, ref} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import axios from 'axios';
import {router} from "@/router.js";

export const backend = ref('')

if (process.env.NODE_ENV === "development") {
    backend.value = "http://localhost:8000/"
} else if (process.env.NODE_ENV === "production") {
    backend.value = "http://localhost:8000/"
}else{
    backend.value = "http://localhost:8000/"
}

const app = createApp(App)

app.use(ElementPlus)
app.use(router)
app.provide('global', {
    axios,
    backend
})
app.mount('#app')
