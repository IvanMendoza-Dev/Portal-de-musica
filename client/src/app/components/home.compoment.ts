import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
    selector: 'home',
    templateUrl: '../views/home.html',
    providers: [UserService]
})

export class HomeComponent implements OnInit{
    public title: string;
    public identidad?: User | null;
    public identity: boolean;
    public token?: string | null;

    constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService) {
        this.title = 'Inicio';
        this.identity = false;

    }

    ngOnInit() {

        this.identidad = this._userService.getIdentidad();
        this.token = this._userService.getToken();

        if (this.token !== null && this.token !== '') {
            this.identity = true;
        }
    }


}