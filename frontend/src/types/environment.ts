export enum DataSource {
  MANUAL = 'MANUAL',
  SENSOR = 'SENSOR'
}

export interface EnvironmentalDataResponse {
  id: number;
  plantId: number;
  locationId?: string;
  sensorId?: string;
  temperatureCelsius?: number;
  temperatureC?: number;
  humidityPercentage?: number;
  humidityPercent?: number;
  lightLevelLux?: number;
  soilMoisturePercentage?: number;
  soilMoisturePercent?: number;
  phLevel?: number;
  recordedDate: string;
  dataSource: DataSource;
}

export interface EnvironmentalDataRequest {
  plantId: number;
  locationId?: string;
  sensorId?: string;
  temperatureCelsius?: number;
  temperatureC?: number;
  humidityPercentage?: number;
  humidityPercent?: number;
  lightLevelLux?: number;
  soilMoisturePercentage?: number;
  soilMoisturePercent?: number;
  phLevel?: number;
  dataSource?: DataSource;
}
