import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators'; // Importa map desde 'rxjs/operators'
import { Observable } from "rxjs";
import { GLOBAL } from './global';
import { Album } from "../models/album";


@Injectable()
export class AlbumService{

    public url: string;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;

    }

    addAlbum(token: string, album: Album){
        let params = JSON.stringify(album);
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        return this._http.post(this.url+'album', params, {headers: headers}).pipe(map((res: any) => res));
    }

    getAlbum(token: string, id: string){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        return this._http.get(this.url+'album/'+id, {headers: headers}).pipe(map((res: any) => res));
    }

    getAlbums(token: string, id: string){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });
        return this._http.get(this.url+'albums/'+id, {headers: headers}).pipe(map((res: any) => res));
    }

    getAlbumsAll(token: string, page: number){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });
        return this._http.get(this.url+'albumsAll/'+page, {headers: headers}).pipe(map((res: any) => res));
    }

    editAlbum(token: string, id: string, album: Album){
        let params = JSON.stringify(album);
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        return this._http.put(this.url+'album/'+id, params, {headers: headers}).pipe(map((res: any) => res));
    }

    deleteAlbum(token: string, id: string){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        return this._http.delete(this.url+'album/'+id, {headers: headers}).pipe(map((res: any) => res));
    }
}
