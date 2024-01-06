import { createRouter, createWebHistory} from 'vue-router';


const routes = [
  {
    path:'/',
    redirect: '/image-processing'
  },
  {
    path:'/image-processing',
    name:'ImageProcessing',
    component: () => import('@/views/ImageProcessing.vue'),
  },
  {
    path:'/glass-glue-identification',
    name:'GlassGlueIdentification',
    component: () => import('@/views/GlassGlueIdentification.vue'),
  },
  {
    path:'/user-profile',
    name:'UserProfile',
    component: () => import('@/views/UserProfile.vue'),
  },
  {
    path:'/login',
    name:'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path:'/register',
    name:'Register',
    component: () => import('@/views/Register.vue'),
  },
  {
    path:'/help',
    name:'Help',
    component: () => import('@/views/Help.vue'),
  },
  {
    path:'/manager',
    name:'Manager',
    component: () => import('@/views/Manager.vue'),
  },
  {
    path:'/contact-us',
    name:'ContactUs',
    component: () => import('@/views/ContactUs.vue'),
  }

];

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory('/'), // 手动指定基础路径
  routes,
});

export default router;