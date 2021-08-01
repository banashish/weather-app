import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DataService } from '../data.service';

interface weatherResponse {
  daily: [];
  hourly: [];
  timezone: string;
}

@Component({
  selector: 'app-weather-report',
  templateUrl: './weather-report.component.html',
  styleUrls: ['./weather-report.component.scss'],
})
export class WeatherReportComponent implements OnInit {
  TemperatureUnit = Object.freeze({
    Celsius: 'metric',
    Fahrenheit: 'imperial',
    Kelvin: 'standard',
  });
  w = 'U+000B0'
  selectedDegree: string = 'Celsius';
  selectedCity: string;
  geoLocation: Location;
  dailyForecasts: weatherResponse;
  forecasts: any[] = [];
  dataFetched: boolean = false;
  fields = [
    {
      label: 'Morning temperature',
      key: 'morn',
      opacity: 1,
    },
    {
      label: 'Day temperature',
      key: 'day',
      opacity: 0.9,
    },
    {
      label: 'Night temperature',
      key: 'night',
      opacity: 0.8,
    },
    {
      label: 'Min temperature',
      key: 'min',
      opacity: 0.7,
    },
    {
      label: 'Max temperature',
      key: 'max',
      opacity: 0.6,
    },
    {
      label: 'Humidity',
      key: 'humidity',
      opacity: 0.5,
    },
    {
      label: 'Mean',
      key: 'mean',
      opacity: 0.4,
    },
    {
      label: 'Mode',
      key: 'mode',
      opacity: 0.3,
    },
  ];
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        switchMap((val) => {
          this.selectedCity = val.location;
          return this.dataService.getCityHelp(this.selectedCity);
        }),
        switchMap((data) => {
          this.geoLocation = data.hits[0]._geoloc;
          return this.dataService.getForecast(
            this.geoLocation,
            this.TemperatureUnit[this.selectedDegree]
          );
        })
      )
      .subscribe((res: weatherResponse) => {
        this.dailyForecasts = res;
        this.forecasts = res.daily;
        this.dataFetched = true;
        this.calculateMeanAndMode(res.hourly);
        this.forecasts.pop();
        this.forecasts.pop();
        this.forecasts.pop();
      });
  }

  calculateMeanAndMode(arr) {
    for (let i = 0; i < 2; i++) {
      let mean = 0;
      let modeObj = {};
      let mode = 0;
      let maxTemp = 0;
      for (let j = 0; j < 24; j++) {
        const number = i * 24 + j;
        const temp = arr[number].temp;
        mean += temp;
        if (modeObj[temp]) {
          modeObj[temp] += 1;
          if(mode < modeObj[temp]){
            mode = modeObj[temp]
            maxTemp = temp
          }
          mode = Math.max(mode, modeObj[temp]);
        } else {
          modeObj[temp] = 1;
          if(mode < modeObj[temp]){
            mode = modeObj[temp]
            maxTemp = temp
          }
        }
      }
      this.forecasts[i]['mean'] = (mean / 24).toFixed(2);
      this.forecasts[i]['mode'] = maxTemp;
    }
  }

  degreeChange() {
    this.dataFetched = false;
    this.dataService
      .getForecast(this.geoLocation, this.TemperatureUnit[this.selectedDegree])
      .subscribe((res: weatherResponse) => {
        this.dailyForecasts = res;
        this.forecasts = res.daily;
        this.dataFetched = true;
        this.calculateMeanAndMode(res.hourly);
        this.forecasts.pop();
        this.forecasts.pop();
        this.forecasts.pop();
      });
  }
}
