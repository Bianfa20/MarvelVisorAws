import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http/'
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ComicsService {

  comicsData: any;

  constructor( public http: HttpClient, private storage: Storage ) {  }

  loadComics(){
    return new Promise((resolve, reject)=>{
      var url = "http://gateway.marvel.com/v1/public/comics?ts=1&apikey=b5dd158dd0e856443db7fb726fbc6bc9&hash=80182fcb24c6426319114b9e34eafed6";
      this.http.get(url).subscribe(data=>{
        //data = {}
        try {
          this.comicsData = data;
          this.comicsData['data']['results'].forEach(comic =>{
            this.storage.get(comic.id+"").then(reaction=>{
              comic.like = reaction ? reaction : 0;
            })                    
          });
          resolve(true);
        }catch {
          resolve(false);
        }  
      });
    })
  }

  getComics(range){
    
    var lowerRange = 6*(range-1);
    var upperRange = lowerRange + 6;

    return this.comicsData['data']['results'].filter(comic => comic['issueNumber'] > 0).slice(lowerRange, upperRange);

  }

  getnComics(){
    return this.comicsData['data']['results'].filter(comic => comic['issueNumber'] > 0).length;
  }

}
