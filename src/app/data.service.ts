import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface APIData {
   hits: [] 
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getCityHelp(key) : Observable<any>{
    const data = {
      query: key,
      language: 'en',
      type: 'city'
    }
    const url = `https://places-dsn.algolia.net/1/places/query`
    return this.http.post(url,data)
  }

  getForecast(location,unit){
    let params = new HttpParams()
    params = params.set('lat',location.lat)
    params = params.set('lon',location.lng)
    params = params.set('exclude','minutely,alerts,current')
    params = params.set('units',unit)
    params = params.set('appid',environment.openApiKey)
    const url = 'https://api.openweathermap.org/data/2.5/onecall'
    return this.http.get(url, { params: params })
  }
}
