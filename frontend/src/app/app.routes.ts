// app.routes.ts

import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { PostComponent } from './post/post.component';
import { AddPostComponent } from './add-post/add-post.component';
import { MypostComponent } from './mypost/mypost.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component'; // Import the AdminDashboardComponent

export const routes: Routes = [
    { path: '', component: UserComponent },
    { path: 'getAllPosts', component: PostComponent },
    { path: 'createPost', component: AddPostComponent },
    { path: 'getMyPosts', component: MypostComponent },
    { path: 'adminDashboard', component: AdminDashboardComponent }, // Add the admin dashboard route
];