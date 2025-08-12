import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Register } from './component/register/register';
import { Blog } from './component/blog/blog';
import { Home } from './component/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Login,
    title: "Iniciar Sesion",
  },
  {
    path: 'home',
    component: Home,
    title: "Simple Blog",
  },
  {
    path: 'register',
    component: Register,
    title: 'Registrarse'
  },
  {
    path: ':username',
    title: 'Bienvenido',
    component: Blog
  }
];
