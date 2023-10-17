import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const url = environment.wsUrl;

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  async updateImageComment(
    file: File,
    type: 'anime' | 'episode' | 'publication',
    id: string
  ) {
    try {
      
      const url2 = `${ url }/comment/commentFileSaved/${ type }/${ id }`
      const formData = new FormData();
      formData.append('file', file);

      const resp = await fetch( url2, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ localStorage.getItem('access_token') || '' }`
        }
      })

      console.log( resp );

    } catch (error) {
      console.log( error );
    }
  }

}
