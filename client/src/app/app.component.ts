import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GLOBAL } from './services/global';
import { Router, ActivatedRoute, Params} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit{
  title = 'BEAT SOUND';

  public user: User;
  public user_register: User;

  public identidad?: User | null;
  public identity: boolean;
  public token?: string | null;
  public errorMessage: string;
  public alertRegister: string;
  public url: string;


  constructor( private _route: ActivatedRoute, private _router: Router, private _userService: UserService){
    this.user = new User('','','','','','','ROLE_USER','', ''); 
    this.user_register = new User('','','','','','','ROLE_USER','',''); 

    this.identidad = null; 
    this.identity = false; 
    this.token = '';
    this.errorMessage = '';
    this.alertRegister = '';
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identidad = this._userService.getIdentidad();
    this.token = this._userService.getToken();

    console.log(this.identidad);
    console.log('Token : ' + this.token);

    if(this.token !== null && this.token !== ''){
      this.identity = true;
    }
  }

  public onSubmit(){
    //console.log(this.user);

    //Conseguir los datos del usuario identificado
    this._userService.signup(this.user).subscribe(
      response => {
        

        if(response._id == ''){
          alert("El usuario no está correctamente identificado");
        }else{
          //Crear elemento en el localStorage para tener al usuario en sesion
          localStorage.setItem('identidad', JSON.stringify(response.user));

          this.identidad = this._userService.getIdentidad();
          let identity = true;
          this.identity = identity;

          //Conseguir el toker para enviarselo a cada petición http
          this._userService.signup(this.user, "Si").subscribe(
            response => {
              //console.log(response);
              let token = response.token;
              this.token = token;
      
              if(this.token && this.token.length <= 0){
                alert("El token no se ha generado");
              }else{
                //Crear elemento en el localStorage para tener el token disponible
                localStorage.setItem('token', JSON.stringify(token));

                this.user = new User('','','','','','','ROLE_USER','',''); 
              }
            },
            error => {
              if (error.error instanceof ErrorEvent) {
                // Error del lado del cliente
                this.errorMessage = `Error: ${error.error.message}`;
              } else {
                // El backend devolvió un código de estado de error
                this.errorMessage = error.error.message || `Error ${error.status}: ${error.statusText}`;
              }
              console.error('Error:', error);
            }
          );

        }
      },
      error => {
        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          this.errorMessage = `Error: ${error.error.message}`;
        } else {
          // El backend devolvió un código de estado de error
          this.errorMessage = error.error.message || `Error ${error.status}: ${error.statusText}`;
        }
        console.error('Error:', error);
      }
    );
  }

  logout(){
    this.identity = false;
    this.token = '';
    localStorage.removeItem('identidad');
    localStorage.removeItem('token');
    localStorage.clear();

    this._router.navigate(['/']);
  }

  onSubmitRegister(){
    console.log(this.user_register);

    this._userService.register(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user_register = user;

        if(!user._id){
          this.alertRegister = 'Error al registrarse';
        }else{
          this.alertRegister = 'El registro se ha realiado correctamente, identificate con '+this.user_register.email;
          this.user_register = new User('','','','','','','ROLE_USER','',''); 
        }
      },
      error => {
        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          this.alertRegister = `Error: ${error.error.message}`;
        } else {
          // El backend devolvió un código de estado de error
          this.alertRegister = error.error.message || `Error ${error.status}: ${error.statusText}`;
        }
        console.error('Error:', error);
      }
    );
  }
}
