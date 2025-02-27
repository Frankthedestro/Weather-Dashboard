import dotenv from 'dotenv';
dotenv.config();

// Interface for Coordinates object Defined with lat and lon
interface Coordinates {
  lat: number;
  lon: number;
}
// class for the Weather object with temp, wind, and humidity
class Weather {
  temp: number;
  wind: number;
  humidity: number;

  constructor(temp: number, wind: number, humidity: number) {
    this.temp = temp;
    this.wind = wind;
    this.humidity = humidity;
  }
}
// Class for Weather Service using the url and the api key and a space for city names to be entered
class WeatherService {
  baseURL: string;
  APIKey: string;
  cityName: string;

  constructor(
    baseURL: string = "https://api.openweathermap.org/data/3.0", 
    APIKey: string = "9c9a9796be5759d7131e386c4fba86ed", 
    cityName: string = ""
  ) {
    this.baseURL = baseURL;
    this.APIKey = APIKey;
    this.cityName = cityName;
  }
  // Grabs the response from the geocode. if errors it will throw for location.
  private async fetchLocationData(): Promise<any[]> { 
    const response = await fetch(this.buildGeocodeQuery());
    if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(`Unable to fetch location: ${response.status} || ${errorText}`); 
    }
    const data = await response.json();
    return data;
}
  // TODO: Create destructureLocationData method.
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // Setting up where the city name will go.
  private buildGeocodeQuery(): string {
    return `https://api.openweathermap.org/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.APIKey}`;
  }
  // Setting up the weather location based on the coords.
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.APIKey}`;
  }
  // Grabs and destructurealizes the data to be used.
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(); // Use the improved fetchLocationData
    if (!locationData || locationData.length === 0) {
        throw new Error('City not found');
    }
    return this.destructureLocationData({ 
      lat: locationData[0].lat, 
      lon: locationData[0].lon 
  });
}
  // Grabs the response from the buildweather. if errors it will throw for weather.
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Unable to fetch weather: ${response.status} || ${errorText}`);
    }
    const data = await response.json();
    return data;
}
  // Takes the responses and applies them to  currentWeather var
  private parseCurrentWeather(response: any) {
    let currentWeather = new Weather(
      response.temp,
      response.wind_speed,
      response.humidity
    );
    return currentWeather;
  }
  // Create an Array to store all the data that has been stored
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    let forecastArray: Weather[] = [currentWeather];
    for (let i = 1; i < 6; i++) {
      let forecastWeather = new Weather(
        weatherData[i].temp,
        weatherData[i].wind_speed,
        weatherData[i].humidity
      );
      forecastArray.push(forecastWeather);
    }
    return forecastArray;
  }
  // Bundles everything above together into one.
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const cityCoords = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(cityCoords);
    const currentWeather = this.parseCurrentWeather(weatherData.current);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.daily);
    return forecastArray;
  }

  // Rename to clean it up and match routes.
  async getWeatherData(city: string) {
    return this.getWeatherForCity(city);
  }
}

export default new WeatherService();