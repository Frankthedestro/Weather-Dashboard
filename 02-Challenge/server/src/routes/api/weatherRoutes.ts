import { Router} from 'express';
const router = Router();

 import HistoryService from '../../service/historyService.js';
 import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
    try {
        const cityname = req.body.cityname || req.body.cityName; 
        if (!cityname) {
            return res.status(400).json({ error: 'City name is required' });
        }
        // Validate city name format 
        const weatherData = await WeatherService.getWeatherData(cityname);
        await HistoryService.addCity(cityname);
        return res.json(weatherData);
        
        // GET weather data from city name

      } catch (error) {
        console.error("Error fetching weather data:", error); // Log the full error on the server
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return res.status(500).json({ error: `Failed to get weather data: ${errorMessage}` }); // Send a more informative error to the client
    }
});

// GET search history
router.get('/history', async (_req,  res) => {
  res.json(await HistoryService.getCities());
});

// * BONUS TODO: DELETE city from search history
// router.delete('/history/:id', async (req: Request, res: Response) => {});
// I do not have time sorry.

export default router;

