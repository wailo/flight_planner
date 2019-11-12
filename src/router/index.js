import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
Vue.use(VueRouter);
const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/about',
        name: 'demo',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/demo-view.vue')
    }
];
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    scrollBehavior: function (to, from, savedPosition) {
        if (to.hash) {
            return { selector: to.hash };
        }
        else {
            return { x: 0, y: 0 };
        }
    },
});
export default router;
//# sourceMappingURL=index.js.map