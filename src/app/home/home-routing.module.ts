import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: HomePage,
    children: [
      {
        path: 'chatroom',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/chatroom/chatroom.module').then( m => m.ChatroomPageModule)
          }
        ]
      },
      {
        path: 'notifications',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/notifications/notifications.module').then( m => m.NotificationsPageModule)
          }
        ]
      },
      {
        path: 'requirements',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/requirements/requirements.module').then( m => m.RequirementsPageModule),
          }
        ]
      },
      {
        path: 'advertise',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/advertise/advertise.module').then( m => m.AdvertisePageModule)
          }
        ]
      },
      {
        path: 'landing',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/landing/landing.module').then( m => m.LandingPageModule)
          }
        ]
      },
    ]
  },
  {
    path: '',
    redirectTo: '/home/tabs/landing',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
