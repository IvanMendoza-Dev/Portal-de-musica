import { Component, OnInit } from '@angular/core';
import { Song } from '../models/song';
import { User } from '../models/user';
import { Album } from '../models/album';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';

@Component({
    selector: 'player',
    templateUrl: '../views/player.html',
    providers: [UserService]
})

export class PlayerComponent implements OnInit {
    public title: string;
    public identidad?: User | null;
    public identity: boolean;
    public token?: string | null;
    public url: string;
    public song: Song;
    public album: Album;
    public user: User;

    constructor(private _userService: UserService) {
        this.title = 'Inicio';
        this.identity = false;
        this.url = GLOBAL.url;
        this.song = new Song('', 1, '', '', '', '');
        this.album = new Album('', '', '', 2000, '', '');
        this.user = new User('', '', '', '', '', '', '', '', '');
    }

    ngOnInit() {

        this.identidad = this._userService.getIdentidad();
        this.token = this._userService.getToken();

        if (this.token !== null && this.token !== '') {
            this.identity = true;
        }

        let album = JSON.stringify(this.song.album);
        this.album = JSON.parse(album);


    }

    
}