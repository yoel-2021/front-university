import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppRoutes } from 'src/app/routes/AppRoutes';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';




@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  
  loginForm: FormGroup = this._formBuilder.group({});

  
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _authservice: AuthService, 
    private _storageService: StorageService) { }

  ngOnInit(): void {

    this._storageService.removeStorage('jwtToken');
    this.loginForm = this._formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
    

  }
  
  
  login(){

    
    let {userName, password}= this.loginForm?.value;
    this._authservice.authUser(userName, password).subscribe(
      {
      next: (response: any)=>{
        if (response.token){
          console.log(`User Token`, response.token)
          let token= response.token
          this._storageService.setStorage('jwtToken',token);
          this._router.navigate(['students']);
          console.log(this.loginForm?.value)
        }
      },
      error: (error: any)=>{

        console.error(`[ERROR]: something wrong happend:${error}`);
        this.loginForm.reset();
        this._storageService.removeStorage('jwtToken');

      },
      complete: () => {
        console.info(`Authentication process finished`);
        this.loginForm.reset();
      }
      
    }
    )

  }



}
