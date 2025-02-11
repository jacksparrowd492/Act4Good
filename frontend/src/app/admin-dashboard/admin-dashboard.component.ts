import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../post.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
    posts: any[] = [];
    popularPosts: any[] = [];
    regularPosts: any[] = [];
    token: string = '';

    constructor(private postService: PostService) { }

    ngOnInit(): void {
        this.token = localStorage.getItem('token') || '';
        console.log('Token:', this.token); // Debugging statement
        this.loadPosts();
    }

    loadPosts(): void {
        console.log('Loading posts...'); // Debugging statement
        this.postService.getAllPosts().subscribe(
            (posts: any[]) => {
                console.log('Posts fetched:', posts); // Debugging statement
                this.posts = posts;
                this.categorizePosts();
            },
            error => {
                console.error('Error loading posts:', error);
            }
        );
    }

    categorizePosts(): void {
        this.popularPosts = this.posts.filter(post => post.likes && post.likes.length >= 10);
        this.regularPosts = this.posts.filter(post => !post.likes || post.likes.length < 10);
    }

    deletePost(postId: string): void {
        console.log('Deleting post with ID:', postId); // Debugging statement
        this.postService.deletePost(postId, this.token).subscribe(
            () => {
                this.loadPosts();
            },
            error => {
                console.error('Error deleting post:', error);
            }
        );
    }
}