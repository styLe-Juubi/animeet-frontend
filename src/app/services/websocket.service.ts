import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public socketStatus = false;

  constructor(
    private socket: Socket
  ){
    this.checkStatus();
   }

  checkStatus(){
    this.socket.on('connect', () => {
      this.socketStatus = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado dell servidor');
      this.socketStatus = false;
    });

  }

  emit( evento: string, payload?: any, callback?: Function ){
    this.socket.emit( evento, payload, callback );
  }

  listen( evento: string ){
    return this.socket.fromEvent( evento );
  }

  /* ALL CONECCTIONS */
  
  listenAllConnections() {
    return this.listen('all-connections');
  }

  /* ALL ABOUT USERS */

  userOnline( payload: any ){
    if( payload !== null && payload !== '' && payload !== undefined ){
      this.emit( 'user-online', payload );
    }else{
      return;
    }
  }

  userOffline( payload: any ) {
    if( payload !== null && payload !== '' && payload !== undefined ){
      this.emit( 'user-offline', payload );
    }else{
      return;
    }
  }

  listenUsersOnline(){
    return this.listen('users-online');
  }

  /* ALL ABOUT COMMENTS */
  listenComments( type: string, id: string ) {
    return this.listen( type + id );
  }

  listenChats( userId: string ) {
    return this.listen(`chats-${ userId }`);
  }

  listenCounterChats( userId: string ) {
    return this.listen(`my-counter-chats-${ userId }`);
  }

  /* ALL ABOUT NOTIFICATIONS */
  listenNotifications( userId: string ) {
    return this.listen(`my-notifications-${ userId }`);
  }

}
