// add-post.component.ts

import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-add-post',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './add-post.component.html',
    styleUrl: './add-post.component.css'
})
export class AddPostComponent implements OnInit {
    postCreated: any = {
        createdAt: new Date,
        updatedAt: new Date
    };
    userDetails: any = {};
    userId: any = "";
    constructor(private postService: PostService,
        private dataService: DataService, private router: Router) { }
    ngOnInit(): void {
        this.userId = this.getUserId();
        if (this.userId) {
            this.dataService.getUserDetails(this.userId)
                .subscribe((userDetails) => {
                    this.userDetails = userDetails;
                });
        }
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
    createPost(): void {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                this.postService.createPost(this.postCreated, token)
                    .subscribe((postCreated: any) => {
                        this.postCreated = postCreated;
                        this.closeAddForm();
                        this.router.navigate(["/getAllPosts"]);
                    });
            }
        }
    }

    closeAddForm(): void {
        this.postCreated = {
            postTitle: "",
            postContent: "",
            postCategory: "",
            attachment: "",
            createdAt: this.postCreated.createdAt,
            updatedAt: this.postCreated.updatedAt
        };
    }
}
