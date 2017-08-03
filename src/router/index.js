import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/pages/Index';
import Goods from '@/pages/goods/Goods';
import Ratings from '@/pages/ratings/Ratings';
import Seller from '@/pages/seller/Seller';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      redirect: '/goods',
      children: [
        {
          path: '/goods',
          name: 'goods',
          component: Goods
        },
        {
          path: '/ratings',
          name: 'ratings',
          component: Ratings
        },
        {
          path: '/seller',
          name: 'seller',
          component: Seller
        }
      ]
    }
  ]
});
