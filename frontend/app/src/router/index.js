import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import NewPostView from '../pages/NewPostView.vue'

const routes=[
    {path: '/', name: 'HomeView', component: HomeView},
    {path: '/newPost', name: 'NewPost', component: NewPostView}
]

const router=createRouter({
    history: createWebHistory(),
    routes
})

export default router;