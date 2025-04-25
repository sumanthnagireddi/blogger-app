import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { BlogsComponent } from './pages/blogs/blogs.component';
import { BlogsChildComponent } from './pages/blogs/blogs-child/blogs-child.component';
import { AccountComponent } from './pages/account/account.component';
import { DiscoverComponent } from './pages/discover/discover.component';
import { DiscoverHomeComponent } from './pages/discover/discover-home/discover-home.component';
import { CreatePostComponent } from './pages/create-post/create-post.component';
import { AuthorDetailsComponent } from './pages/discover/author-details/author-details.component';
import { ArticleDetailsComponent } from './pages/discover/article-details/article-details.component';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { TagsComponent } from './pages/tags/tags.component';

export const routes: Routes = [
    {
        path: '', component: LayoutComponent, canActivate: [AuthGuard], children: [
            { path: '', component: HomeComponent },
            {
                path: 'me', component: BlogsComponent, children:
                    [
                        { path: 'blogs/:category', component: BlogsChildComponent },
                        { path: 'account', component: AccountComponent },
                    ]
            },
            {
                path: 'discover', component: DiscoverComponent, children: [
                    { path: '', component: DiscoverHomeComponent },
                    { path: 'author-details/:id', component: AuthorDetailsComponent },
                    { path: 'article-details/:articleName/:views', loadComponent: () => import('./pages/discover/article-details/article-details.component').then((m) => m.ArticleDetailsComponent) },
                    { path: 'tags/:tag', component: TagsComponent }
                ]
            },
            { path: 'article/:mode/:id', loadComponent: () => import('./pages/create-post/create-post.component').then((m) => m.CreatePostComponent), },

        ]
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
];
