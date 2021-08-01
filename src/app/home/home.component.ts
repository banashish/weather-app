import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  cityInput: string;
  helpList: [];
  citySubscription: Subscription;
  showValidCityError: boolean = false;
  constructor(private serve: DataService,private router: Router) { }

  ngOnInit(): void {
  }

  cityChange(){
    if(this.citySubscription){
      this.citySubscription.unsubscribe();
    }
    if(this.showValidCityError){
      this.showValidCityError = false
    }
    if(this.cityInput){
      this.citySubscription = this.serve.getCityHelp(this.cityInput).subscribe((res) => {
        this.helpList = res.hits.map((hit,index) => {
          if(hit.locale_names.length > 0){
            return {
              name: hit.locale_names[0] + ', ' + hit.administrative[0],
            }
          }
        })
      })
    }
  }

  onSearch(){
    this.serve.getCityHelp(this.cityInput).subscribe( res => {
      if(res.hits.length > 0) {
        this.router.navigate(['weather'], {
          queryParams: {
            location: this.cityInput,
          }
      });
      } else {
        this.showValidCityError = true
      }
    })
  }

}
