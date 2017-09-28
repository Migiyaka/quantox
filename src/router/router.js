import VueRouter from 'vue-router';

import ShopListPage from '../layout/ShopListPage.vue';
import ShopDetailsPage from '../layout/ShopDetailsPage.vue';

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: ShopListPage
        },
        {
            path: '/details',
            component: ShopDetailsPage
        }
    ] 
});

export default router;