import {Injectable} from '@angular/core';
import { from } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface AuthResponseData{
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localID: string;
}

@Injectable({providedIn:'root'})
export class AuthService{
    constructor(private http:HttpClient){

    }
    signup(email: string, password: string){
    return  this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCEMGxnwHObs4qGTGQNUbwer7DbtvF93bU',
        {
            email: email,
            password: password,
            returnSecureToken: true
        }
        );
    }
}