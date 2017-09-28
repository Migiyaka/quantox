import VueRouter from 'vue-router';

import ShopListPage from '../layout/ShopListPage.vue';
import ShopDetailsPage from '../layout/ShopDetailsPage.vue';

const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: ShopListPage
        },
        {
            path: '/details/:shopId',
            component: ShopDetailsPage
        },
        {
            path: '*',
            redirect: '/'
        }
    ] 
});

export default router;