import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AxiosService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://restcountries.com/v3.1',
      timeout: 1000,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Fetch all countries
  getAllCountries() {
    return this.axiosInstance.get('/all');
  }
}
