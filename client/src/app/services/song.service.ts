import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators'; // Importa map desde 'rxjs/operators'
import { Observable } from "rxjs";
import { GLOBAL } from './global';
import { Song } from "../models/song";


@Injectable()
export class SongService{

    public url: string;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;

    }

    addSong(token: string, song: Song){
        let params = JSON.stringify(song);
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        return this._http.post(this.url+'song', params, {headers: headers}).pipe(map((res: any) => res));
    }

    
    getSong(token: string, id: string){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        return this._http.get(this.url+'song/'+id, {headers: headers}).pipe(map((res: any) => res));
    }

    getSongs(token: string, idAlbum: string){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });
        return this._http.get(this.url+'songs/'+idAlbum, {headers: headers}).pipe(map((res: any) => res));
    }

    editSong(token: string, id: string, song: Song){
        let params = JSON.stringify(song);
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        return this._http.put(this.url+'song/'+id, params, {headers: headers}).pipe(map((res: any) => res));
    }

    deleteSong(token: string, id: string){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        return this._http.delete(this.url+'song/'+id, {headers: headers}).pipe(map((res: any) => res));
    }
}
