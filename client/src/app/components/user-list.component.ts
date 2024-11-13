import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { User } from '../models/user';

@Component({
    selector: 'user-list',
    templateUrl: '../views/user-list.html',
    providers: [UserService, ArtistService]
})

export class UserListComponent implements OnInit {
    public title: string;
    public users: User[];

    public identidad?: User | null;
    public identity: boolean;
    public token?: string | null;
    public url: string;
    public next_page: number;
    public prev_page: number;
    public alertList: string;
    public confirmado: string;

    constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _artistService: ArtistService) {
        this.title = 'Artistas';
        this.users = [];

        this.url = GLOBAL.url;
        this.identity = false;
        this.next_page = 1;
        this.prev_page = 1;

        this.alertList = '';
        this.confirmado = '';

    }

    ngOnInit() {

        this.identidad = this._userService.getIdentidad();
        this.token = this._userService.getToken();

        if (this.token !== null && this.token !== '') {
            this.identity = true;
        }

        this.getUsers();
    }

    getUsers() {
        this._route.params.forEach((params: Params) => {
            let page = +params['page']; //Con el +  lo convierto en number
            if (!page) {
                page = 1;
            } else {
                this.next_page = page + 1;
                this.prev_page = page - 1;

                if (this.prev_page == 0) {
                    this.prev_page = 1;
                }
            }
            if (this.token) {
                this._userService.getUsers(this.token, page).subscribe(
                    response => {
                        if (!response.users) {
                            this._router.navigate(['/']);
                        } else {
                            this.users = response.users;
                        }
                    },
                    error => {
                        if (error.error instanceof ErrorEvent) {
                            // Error del lado del cliente
                            this.alertList = `Error: ${error.error.message}`;
                        } else {
                            // El backend devolvió un código de estado de error
                            this.alertList = error.error.message || `Error ${error.status}: ${error.statusText}`;
                        }
                        console.error('Error:', error.error.message);
                    }
                );
            }
        });

    }

    onDeleteConfirm(id: string) {
        this.confirmado = id;

    }

    onDeleteUser(id: string) {
        if (this.token) {
            this._userService.deleteUser(this.token, id).subscribe(
                response => {
                    this._router.navigate(['/']);
                },
                error => {
                    if (error.error instanceof ErrorEvent) {
                        // Error del lado del cliente
                        this.alertList = `Error: ${error.error.message}`;
                    } else {
                        // El backend devolvió un código de estado de error
                        this.alertList = error.error.message || `Error ${error.status}: ${error.statusText}`;
                    }
                    console.error('Error:', error);
                }
            );

        }
    }
}