import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public data = new BehaviorSubject('default data');
  data$ = this.data.asObservable();

  public image = new BehaviorSubject('default data');
  image$ = this.image.asObservable();

  public imageProfile = new BehaviorSubject('default data');
  imageProfile$ = this.imageProfile.asObservable();

  changeData(data: string) {
    this.data.next(data)
  }

  changeImage( image: string ) {
    this.image.next(image);
  }

  changeImageProfile( image: string ) {
    this.imageProfile.next(image);
  }
}