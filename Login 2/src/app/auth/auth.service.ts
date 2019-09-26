import {Injectable} from '@angular/core';
import { throwError, Subject } from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from './user.model';

export interface AuthResponseData{
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localID: string;
    registered:string;
}

@Injectable({providedIn:'root'})
export class AuthService{

    user=new Subject<User>();
    

    constructor(private http:HttpClient){

    }
    signup(email: string, password: string){
    return  this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCEMGxnwHObs4qGTGQNUbwer7DbtvF93bU',
        {
            email: email,
            password: password,
            returnSecureToken: true
        }
        )
        .pipe(catchError(this.handleError),tap(resData => {
            this.handleAuthentication(
                resData.email,
                resData.localID,
                resData.idToken,
                +resData.expiresIn);
        })
        );
    }

    login(email: string, password: string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCEMGxnwHObs4qGTGQNUbwer7DbtvF93bU',
        {
            email: email,
            password: password,
            returnSecureToken: true
        }
        ).pipe(catchError(this.handleError),tap(resData => {
            this.handleAuthentication(
                resData.email,
                resData.localID,
                resData.idToken,
                +resData.expiresIn);
        })
        );
    }

    logout(){
        this.user.next(null);
    }

    private handleAuthentication(email: string,userId:string, token: string, expiresIn: number){
        const expirationDate = new Date(new Date().getTime()+ expiresIn*1000);
            const user=new User(
                email,
                userId,
                token,
                expirationDate);
            this.user.next(user);

    }

    private handleError(Resperr:HttpErrorResponse){
            let errorMessage="Error unknown";
            if(!Resperr.error || !Resperr.error.error){
                return throwError(errorMessage);
            }
            switch(Resperr.error.error.message){
                case 'EMAIL_EXISTS':
                  errorMessage="Email Already exists";
                  break;
                case 'EMAIL_NOT_FOUND':
                    errorMessage = "this email does not exist";
                    break;
                case 'INVALID_PASSWORD':
                    errorMessage='Incorrect Password';
                    break;
              }
              return throwError(errorMessage);
        
    }
}