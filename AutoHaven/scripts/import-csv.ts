
import { storage } from '../server/storage';
import fs from 'fs';
import { parse } from 'csv-parse';

async function importCsv() {
  const fileContent = fs.readFileSync('../Cars - Sheet1 (5).csv', 'utf-8');
  
  parse(fileContent, { columns: true }, async (err, records) => {
    if (err) {
      console.error('Error parsing CSV:', err);
      return;
    }

    for (const record of records) {
      try {
        await storage.createCar({
          userId: 1, // Default seller ID from sample data
          title: `${record.year} ${record.make} ${record.model}`,
          make: record.make,
          model: record.model,
          year: parseInt(record.year),
          price: parseInt(record.price),
          mileage: parseInt(record.mileage || '0'),
          condition: record.condition || 'good',
          fuel: record.fuel || 'gasoline',
          transmission: record.transmission || 'automatic',
          description: record.description || `${record.year} ${record.make} ${record.model} in good condition`,
          features: record.features ? record.features.split(',') : [],
          location: record.location || 'Not specified',
          images: record.images ? record.images.split(',') : []
        });
        console.log(`Imported: ${record.year} ${record.make} ${record.model}`);
      } catch (error) {
        console.error('Error importing car:', error);
      }
    }
  });
}

importCsv();
