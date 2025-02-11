// post.component.ts

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../post.service';
import { DataService } from '../data.service';
import { LikeService } from '../like.service';
import { Router, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-post',
    standalone: true,
    imports: [FormsModule, CommonModule, RouterOutlet],
    templateUrl: './post.component.html',
    styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {
    postList: any[] = [];
    displayedPostList: any[] = [];
    showUpdateForm: boolean = false;
    postById: any = {};
    myPosts: any[] = [];
    postUpdated: any = {};
    errorMessage: string = "";
    userDetails: any = {};
    loggedInUser: string | null = "";
    isLiked: boolean = false;
    username: any[] = [];
    email: any[] = [];
    posts: any[] = [];
    @Output() buttonClicked: EventEmitter<void> = new EventEmitter<void>();
    likes: number = 0;
    searchTerm: string = ""; // Add a new property for the search term

    constructor(
        private postService: PostService,
        private dataService: DataService, 
        private likeService: LikeService, 
        private router: Router
    ) { }

    ngOnInit(): void {
        this.getAllPosts();
    }

    getUserId(): string | null {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                return tokenPayload.user.id;
            }
        }
        return null;
    }

    getAllPosts(): void {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                this.postService.getAllPosts()
                    .subscribe((postList: any) => {
                        this.postList = postList;
                        this.displayedPostList = [...this.postList];
                    });
            }
        }
    }

    getUserDetails(userId: string): any {
        this.dataService.getUserDetails(userId)
            .subscribe((userDetails: any) => {
                this.userDetails = userDetails;
            });
    }

    getPostById(postId: string): void {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                this.showUpdateForm = false;
                this.postService.getPostById(postId)
                    .subscribe((postById) => {
                        this.postById = postById;
                    });
            }
        }
    }

    getMyPosts(): void {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                this.showUpdateForm = false;
                this.postService.getMyPosts(token)
                    .subscribe((myPosts) => {
                        this.myPosts = myPosts;
                        this.displayedPostList = [...this.myPosts];
                    });
            }
        }
    }

    populateUpdateForm(post: any) {
        this.loggedInUser = this.getUserId();
        if (this.loggedInUser === post.author?._id) {
            this.postUpdated = { ...post };
            this.postUpdated.updatedAt = new Date().toISOString();
            if (typeof this.postUpdated.createdAt === 'string') {
                this.postUpdated.createdAt = this.postUpdated.createdAt.slice(0, 10);
            }
            this.getUserDetails(post.author._id);
            this.showUpdateForm = true;
        }
    }

    updatePost(postId: string): void {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                this.postService.updatePost(this.postUpdated, token)
                    .subscribe((postUpdated: any) => {
                        const index = this.displayedPostList.findIndex((p) => p._id === postId);
                        if (index !== -1) {
                            this.postList[index] = postUpdated;
                            this.displayedPostList[index] = postUpdated;
                            this.getAllPosts();
                            this.showUpdateForm = false;
                            this.router.navigate(["/getAllPosts"]);
                        }
                        this.cancelUpdate();
                    },
                    error => {
                        this.errorMessage = "Error in updating the post: " + error.message;
                    });
            }
        }
    }

    cancelUpdate(): void {
        this.showUpdateForm = false;
        this.postUpdated = {};
    }

    confirmDelete(postId: string): void {
        const confirmDelete = window.confirm("Are you sure you want to delete the post");
        if (confirmDelete) {
            this.deletePost(postId);
        }
    }

    deletePost(post: any): void {
        const postId = post._id;
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                this.postService.deletePost(postId, token)
                    .subscribe(() => {
                        this.postList = this.postList.filter((post: any) => post._id !== postId);
                        this.displayedPostList = [...this.postList];
                    },
                    error => {
                        this.errorMessage = "Error in deleting the post: " + error.message;
                    });
            }
        }
    }

    toggleLike(postId: string) {
        if (typeof localStorage !== "undefined") {
            const token = localStorage.getItem('token');
            if (token) {
                const postIndex = this.displayedPostList.findIndex(post => post._id === postId);
                if (postIndex !== -1) {
                    const post = this.displayedPostList[postIndex];
                    this.likeService.toggleLike(postId, token)
                        .subscribe((response) => {
                            if (response.success) {
                                post.isLiked = !post.isLiked;
                                if (post.isLiked) {
                                    post.likes.push('');
                                } else {
                                    post.likes.pop();
                                }
                                this.displayedPostList[postIndex] = post;
                            } else {
                                console.error(response.message);
                            }
                        });
                }
            }
        }
    }

    searchPosts(): void {
        if (this.searchTerm.trim() === "") {
            this.displayedPostList = [...this.postList];
        } else {
            this.displayedPostList = this.postList.filter(post => 
                post.title.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }
    }

    isImage(url: string): boolean {
        return /\.(jpg|jpeg|png|gif|bmp|svg)$/.test(url);
    }
}