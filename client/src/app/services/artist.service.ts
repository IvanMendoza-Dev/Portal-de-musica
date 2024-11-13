import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators'; // Importa map desde 'rxjs/operators'
import { Observable } from "rxjs";
import { GLOBAL } from './global';
import { Artist } from "../models/artist";


@Injectable()
export class ArtistService{

    public url: string;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;

    }


    getArtists(token: string, page: number){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        return this._http.get(this.url+'artists/'+page, {headers: headers}).pipe(map((res: any) => res));
    }

    getArtist(token: string, id: string){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        return this._http.get(this.url+'artist/'+id, {headers: headers}).pipe(map((res: any) => res));
    }

    addArtist(token: string, artist: Artist){
        let params = JSON.stringify(artist);
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        return this._http.post(this.url+'artist', params, {headers: headers}).pipe(map((res: any) => res));
    }

    addArtist2(artist: Artist){
        let params = JSON.stringify(artist);
        let headers = new HttpHeaders({
            'Content-Type':'application/json'
        });

        return this._http.post(this.url+'artist', params, {headers: headers}).pipe(map((res: any) => res));
    }

    editArtist(token: string, id: string, artist: Artist){
        let params = JSON.stringify(artist);
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        return this._http.put(this.url+'update-artist/'+id, params, {headers: headers}).pipe(map((res: any) => res));
    }

    deleteArtist(token: string, id: string){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        return this._http.delete(this.url+'artist/'+id, {headers: headers}).pipe(map((res: any) => res));
    }

}
