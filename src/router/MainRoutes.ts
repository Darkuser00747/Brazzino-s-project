const MainRoutes = {
    path: '/',
    meta: {
      requiresAuth: true,
    },
    redirect: '/main',
    component: () => import('@/views/pages/catalogo.vue'),
    children: [
      {
        name: 'dashboard',
        path: '/main',
        component: () => import('@/views/dashboard/index.vue'),
      },
      {
        name: 'catalogo',
        path: '/catalogo', // ⬅ Esta es la ruta que renderiza catalogo.vue dentro del layout
        component: () => import('@/views/pages/catalogo.vue'),
      },
      {
        name: 'Typography',
        path: '/ui/typography',
        component: () => import('@/views/components/Typography.vue'),
      },
      {
        name: 'Shadow',
        path: '/ui/shadow',
        component: () => import('@/views/components/Shadow.vue'),
      },
      {
        name: 'Icons',
        path: '/icons',
        component: () => import('@/views/pages/Icons.vue'),
      },
      {
        name: 'Starter',
        path: '/sample-page',
        component: () => import('@/views/pages/SamplePage.vue'),
      },
    ],
  };
  
  export default MainRoutes;
  