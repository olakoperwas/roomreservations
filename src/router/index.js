import { createRouter, createWebHistory } from 'vue-router'
import LogInView from '../views/LogInView.vue'
import authAzure from '../services/auth-azure.service';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LogInView,
      beforeEnter: async (to, from) => {                
        console.log('Login route, user: ' + authAzure.user());
        if(! authAzure.user()) {
            // if (app != undefined) {
            //     authAzure.login();
            // } 
        } else {
            console.log('already authenticated user:');
            return {name: 'home'}
        }
      }         
    },
    {
      path: '/home',
      name: 'home',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/FloorView.vue')
    },
    {
      path: '/reservations',
      name: 'reservations',
      component: () => import('../views/MyReservations.vue')
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   console.log("CheckRedirection")
//   const publicPages = ['/login', '/register', '/','/home'];
//   const authRequired = !publicPages.includes(to.path);
//   const loggedIn = authAzure.isLoggedIn();
//   // trying to access a restricted page + not logged in
//   // redirect to login page
//   if (authRequired && !loggedIn) {
//     console.log("redirect to home")
//     sessionStorage.setItem('home', to.path);
    
//     next('/login');
//   } else {
//     next();
//   }
// });

export default router
