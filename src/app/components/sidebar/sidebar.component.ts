import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
const wsUrl = environment.wsUrl;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public url = wsUrl;
  @Input() identity: any;
  @Output() closeSidebar: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  closeSidebarTo() {
    this.closeSidebar.emit( true );
  }

  goTo( url: string ): void {
    window.open( url, '_blank');
  }

}
