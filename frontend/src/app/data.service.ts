// data.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private baseUrl = "http://localhost:5000";
    constructor(private http: HttpClient) { }

    getUserDetails(userId: string): Observable<any> {
        return this.http.get < any > (`${this.baseUrl}/api/auth/${userId}`);
    }

    getPostDetails(postId: string): Observable<any> {
        return this.http.get < any > (`${this.baseUrl}/api/posts/getPostById/${postId}`);
    }
}
