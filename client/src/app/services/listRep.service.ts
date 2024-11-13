import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators'; // Importa map desde 'rxjs/operators'
import { Observable } from "rxjs";
import { GLOBAL } from './global';
import { ListRep } from "../models/listRep";


@Injectable()
export class ListRepService{

    public url: string;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;

    }

    saveList(token: string, listRep: ListRep){
        let params = JSON.stringify(listRep);
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        return this._http.post(this.url+'listRep', params, {headers: headers}).pipe(map((res: any) => res));
    }

    getListRep(token: string, id: string){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        return this._http.get(this.url+'listRep/'+id, {headers: headers}).pipe(map((res: any) => res));
    }

    getLists(token: string, id: string){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });
        return this._http.get(this.url+'listReps/'+id, {headers: headers}).pipe(map((res: any) => res));
    }

    deleteList(token: string, song: string){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        return this._http.delete(this.url+'listRep/'+song, {headers: headers}).pipe(map((res: any) => res));
    }
}
