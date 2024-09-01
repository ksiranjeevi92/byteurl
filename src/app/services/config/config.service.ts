import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigItem } from '@app/models/frontend';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: ConfigItem | null = null;

  constructor(private http: HttpClient) {}

  loadConfig(): Observable<ConfigItem> {
    return this.http.get('/assets/config.json').pipe(
      map((config: any) => ({
        ...config,
        apiUrl: new URL(config.apiUrl), // Convert string to URL object
      }))
    );
  }

  public setConfig(config: ConfigItem | null): void {
    if (config !== null) {
      this.config = config;
    }
  }

  public getConfig(): ConfigItem | null {
    return this.config;
  }
}
