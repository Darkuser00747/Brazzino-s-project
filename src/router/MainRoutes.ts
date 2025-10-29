const MainRoutes = {
  path: '/',
  meta: {
    requiresAuth: true,
  },
  redirect: '/',
  component: () => import('@/views/pages/home.vue'), // Tu archivo home.vue en pages
  children: [
    {
      name: 'catalogo',
      path: '/catalogo',
      component: () => import('@/views/pages/Catalogo.vue')
    },
     {
      name: 'promociones',
      path: '/promociones',
      component: () => import('@/views/pages/promociones.vue')
    },
    {
      name: 'compra',
      path: '/compra',
      component: () => import('@/views/pages/compra.vue'),
      meta: {
        requiresAuth: false, // Esta ruta no requiere autenticación
        hideNavigation: true, // Para ocultar la navegación principal
        layout: 'auth' // Layout específico para autenticación
      }
    },
    {
      name: 'admin',
      path: '/admin',
      component: () => import('@/views/pages/admin.vue'),
      meta: {
        requiresAuth: false, // Esta ruta no requiere autenticación
        hideNavigation: true, // Para ocultar la navegación principal
        layout: 'auth' // Layout específico para autenticación
      }
    }, 
    {
      name: 'dashboard',
      path: '/',
      component: () => import('@/views/dashboard/index.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      name: 'Typography',
      path: '/ui/typography',
      component: () => import('@/views/components/Typography.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      name: 'Shadow',
      path: '/ui/shadow',
      component: () => import('@/views/components/Shadow.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      name: 'Icons',
      path: '/icons',
      component: () => import('@/views/pages/Icons.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      name: 'Starter',
      path: '/sample-page',
      component: () => import('@/views/pages/SamplePage.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    
    // Nueva ruta hija para login
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/auth/Login.vue'),
      meta: {
        requiresAuth: false, // Esta ruta no requiere autenticación
        hideNavigation: true, // Para ocultar la navegación principal
        layout: 'auth' // Layout específico para autenticación
      }
    },
  ],
};

export default MainRoutes;