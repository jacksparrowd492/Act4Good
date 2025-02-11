// auth.service.ts
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

// Define interfaces for type safety
interface UserData {
  username: string;
  email: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  loggedInEvent: EventEmitter<void> = new EventEmitter();

  constructor(
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Check if token exists on service initialization
    this.checkInitialAuthStatus();
  }

  private checkInitialAuthStatus(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.isAuthenticatedSubject.next(true);
      }
    }
  }

  private getLocalStorage(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setLocalStorage(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }

  private removeLocalStorage(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

  register(userData: UserData): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.baseUrl}/register`, userData)
      .pipe(
        tap((response: AuthResponse) => {
          if (response.token) {
            this.setLocalStorage('token', response.token);
            this.setAuthenticationStatus(true);
          }
        }),
        catchError(this.handleError)
      );
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap((response: AuthResponse) => {
          if (response.token) {
            this.setLocalStorage('token', response.token);
            this.setAuthenticationStatus(true);
            this.emitLoggedInEvent();
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    this.removeLocalStorage('token');
    this.setAuthenticationStatus(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  setAuthenticationStatus(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  emitLoggedInEvent(): void {
    this.loggedInEvent.emit();
  }

  getCurrentAuthStatus(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getToken(): string | null {
    return this.getLocalStorage('token');
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}