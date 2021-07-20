import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { PackageGuard } from './guards/package.guard';
import { ProfileGuard } from './guards/profile.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate:[AuthGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'advertisements',
    loadChildren: () => import('./pages/advertisements/advertisements.module').then( m => m.AdvertisementsPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'packages',
    loadChildren: () => import('./pages/packages/packages.module').then( m => m.PackagesPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule),
    canActivate:[LoginGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate:[LoginGuard]
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./modals/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./modals/verify-email/verify-email.module').then( m => m.VerifyEmailPageModule)
  },
  {
    path: 'verify-mobile',
    loadChildren: () => import('./modals/verify-mobile/verify-mobile.module').then( m => m.VerifyMobilePageModule)
  },
  {
    path: 'select-package',
    loadChildren: () => import('./pages/select-package/select-package.module').then( m => m.SelectPackagePageModule),
    canActivate:[PackageGuard]
  },
  {
    path: 'login-otp',
    loadChildren: () => import('./modals/login-otp/login-otp.module').then( m => m.LoginOtpPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'send-quote',
    loadChildren: () => import('./modals/send-quote/send-quote.module').then( m => m.SendQuotePageModule)
  },
  {
    path: 'report-requirement',
    loadChildren: () => import('./modals/report-requirement/report-requirement.module').then( m => m.ReportRequirementPageModule)
  },
  {
    path: 'profile-settings',
    loadChildren: () => import('./pages/profile-settings/profile-settings.module').then( m => m.ProfileSettingsPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile-stepper/profile-stepper.module').then( m => m.ProfileStepperPageModule),
    canActivate:[ProfileGuard]
  },
  {
    path: 'get-ad-link',
    loadChildren: () => import('./modals/get-ad-link/get-ad-link.module').then( m => m.GetAdLinkPageModule)
  },
  {
    path: 'refferal-code',
    loadChildren: () => import('./modals/refferal-code/refferal-code.module').then( m => m.RefferalCodePageModule)
  },
  {
    path: 'remove-agent',
    loadChildren: () => import('./modals/remove-agent/remove-agent.module').then( m => m.RemoveAgentPageModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./pages/faq/faq.module').then( m => m.FaqPageModule),
    canActivate:[AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
