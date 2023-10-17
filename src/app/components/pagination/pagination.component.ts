import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {

  @Input() public page: any;
  @Input() public totalPages: any;
  @Input() public responsive: boolean = false;
  @Output() public next: EventEmitter<string> = new EventEmitter();
  @Output() public back: EventEmitter<string> = new EventEmitter();
  @Output() public lastPage: EventEmitter<number> = new EventEmitter();

  constructor() { }

  changePage( action: string, id: string ) {
    
    let btn = document.querySelector('#'+ id);
    btn?.setAttribute('disabled', '');
    btn?.classList.add('wait-submit');

    if( action === 'next' ) {
      this.next.emit( 'next' );
    } else if ( action === 'back' ) {
      this.back.emit( 'back' );
    } else if( action === 'lastPage' ) {
      this.lastPage.emit( this.totalPages );
    }

    setTimeout(() => {
      btn?.removeAttribute('disabled');
      btn?.classList.remove('wait-submit');
    }, 300 );
  }

}
