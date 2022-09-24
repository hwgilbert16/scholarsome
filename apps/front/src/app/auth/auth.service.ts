import { Injectable } from '@angular/core';
import { LoginForm, RegisterForm } from "../shared/models/Auth";
import { HttpClient } from "@angular/common/http";
import { shareReplay } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(loginForm: LoginForm) {
    return this.http.post<LoginForm>('/api/login', loginForm).pipe(shareReplay());
  }

  register(registerForm: RegisterForm) {
    return this.http.post<RegisterForm>('/api/register', registerForm).pipe(shareReplay());
  }
}
