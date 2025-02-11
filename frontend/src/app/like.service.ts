// like.service.ts

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LikeService {
    private baseUrl = "http://localhost:5000";
    constructor(private http: HttpClient) { }

    toggleLike(postId: string, token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.post(`${this.baseUrl}/api/like/${postId}`, {}, { headers });
    }
}