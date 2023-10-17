import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.scss']
})
export class Error404Component implements OnInit {

  constructor(
    private readonly _router: Router,
    private readonly _toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this._toastrService.info('Pagina no encontrada !', 'Error 404');
    // this._router.navigate(['/']);
  }

}
