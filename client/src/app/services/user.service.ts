import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators'; // Importa map desde 'rxjs/operators'
import { Observable } from "rxjs";
import { GLOBAL } from './global';
import { User } from "../models/user";


@Injectable()
export class UserService{

    public identidad?: User | null;
    public token?: string | null;
    public url: string;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
        this.identidad = new User('','','','','','','ROLE_USER','', ''); 
        this.token = '';
    }

    signup(user_to_login: User, gethash?: string | null)
        {

        if(gethash != null){
            user_to_login.gethash = gethash;
        }

        let params = JSON.stringify(user_to_login);

        let headers = new HttpHeaders({'Content-Type': 'application/json'});

        return this._http.post(this.url+'login', params, {headers: headers}).pipe(map((res: any) => res));
    }

    register(user_to_register: User){
        let params = JSON.stringify(user_to_register);

        let headers = new HttpHeaders({'Content-Type': 'application/json'});

        return this._http.post(this.url+'register', params, {headers: headers}).pipe(map((res: any) => res));
    }

    updateUser(user_to_update: User){
        let params = JSON.stringify(user_to_update);

        // Obtener el token asegurando que no sea null o undefined
        const token = this.getToken() || ''; 

        let headers = new HttpHeaders({'Content-Type': 'application/json','Authorization' : token});

        return this._http.put(this.url+'update-user/'+user_to_update._id, params, {headers: headers}).pipe(map((res: any) => res));
    }

    getIdentidad(){
        let identidadString = localStorage.getItem('identidad');

        if(identidadString != null){
            this.identidad = JSON.parse(identidadString);
        }else{
            this.identidad = null;
        }

        return this.identidad;
    }

    getToken(){
        let tokenString = localStorage.getItem('token');

        if(tokenString != null){
            this.token = JSON.parse(tokenString);
        }else{
            this.token = null;
        }

        return this.token;
    }

    getUsers(token: string, page: number){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        return this._http.get(this.url+'users/'+page, {headers: headers}).pipe(map((res: any) => res));
    }

    getUser(token: string, id: string){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        return this._http.get(this.url+'user/'+id, {headers: headers}).pipe(map((res: any) => res));
    }

    deleteUser(token: string, id: string){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        return this._http.delete(this.url+'user/'+id, {headers: headers}).pipe(map((res: any) => res));
    }

}
