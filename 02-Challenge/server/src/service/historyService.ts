import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);


// Defined a City class with name and id properties
class City {
name: string;
id: string;

constructor(name:string, id:string){
this.name = name;
this.id = id;
  }
}


// HistoryService class that goes to search history file.
class HistoryService { 
  cities: City[] = [];
private filePath: string;

  constructor() {
    this.filePath = path.join(dirName, '../../../searchHistory.json');
  }


  // Read method that reads from the searchHistory.json file
  private async read() {
    try {
        if (!fs.existsSync(this.filePath)) {
            await fs.promises.writeFile(this.filePath, '[]');
            return [];
        }
        const data = await fs.promises.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
        return [];
    }
  }


  // updates cities array to the History json
   private async write(cities: City[]) {
   try {
         await fs.promises.writeFile(this.filePath, JSON.stringify(cities, null, 2)); 
        } catch (error) {
        console.error(error);
      }
  }


  // Method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const data = await this.read();
    return data.map((city: { name: string; id: string }) => new City(city.name, city.id));
  }


  // addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const cities = await this.read();
    const newCity = new City(city, Date.now().toString());
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }
  
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  //async removeCity(id: string) {}
}

export default new HistoryService();
