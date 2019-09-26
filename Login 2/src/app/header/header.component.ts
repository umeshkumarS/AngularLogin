import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

// import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit,OnDestroy {

  isAuthenticated=false;
  private userSub: Subscription;
   
  constructor(
     private authService:AuthService,
     private router:Router
     ) {}

  ngOnInit(){
  this.userSub=  this.authService.user.subscribe(user => {
    this.isAuthenticated= !user ? false:true; //true if we have a user and false if we dont have
    console.log(!user);
    console.log(!!user);
  });
  }

  onLogout(){
    this.authService.logout();
    this.router.navigate(['/auth'])
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }
  // onSaveData() {
  //   this.dataStorageService.storeRecipes();
  // }

  // onFetchData() {
  //   this.dataStorageService.fetchRecipes().subscribe();
  // }
}
