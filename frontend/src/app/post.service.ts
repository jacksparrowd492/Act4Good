import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private baseUrl = 'http://localhost:5000/api/post';
    constructor(private httpClient: HttpClient) { }

    getAllPosts(): Observable<any[]> {
        return this.httpClient.get<any[]>(`${this.baseUrl}/getAllPosts`);
    }

    getPostById(postId: string): Observable<any> {
        return this.httpClient.get<any>(`${this.baseUrl}/getPostById/${postId}`);
    }

    getMyPosts(token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.httpClient.get<any>(`${this.baseUrl}/getMyPosts`, { headers });
    }

    createPost(post: any, token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.httpClient.post<any>(`${this.baseUrl}/createPost`, { post }, { headers });
    }

    updatePost(post: any, token: string): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.httpClient.put<any>(`${this.baseUrl}/updatePost/${post._id}`, post, { headers });
    }

    deletePost(postId: string, token: string): Observable<void> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.httpClient.delete<void>(`${this.baseUrl}/deletePost/${postId}`, { headers });
    }
}