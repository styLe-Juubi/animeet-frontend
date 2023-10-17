import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
const wsUrl = environment.wsUrl;

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnChanges {

  @Input() users: any;
  @Input() usersOnline: number = 0;
  @Input() allConnections: number = 0;
  @Output() closeSideUsers: EventEmitter<boolean> = new EventEmitter();
  public url = wsUrl;
  public identity: any;

  constructor(
    private readonly _authService: AuthService,
  ) { }

  ngOnChanges(): void {
    this.identity = this._authService.getIdentity();
  }

  closeSideUsersTo() {
    this.closeSideUsers.emit( true );
  }

}
