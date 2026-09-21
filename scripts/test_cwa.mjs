import fs from 'fs';
import path from 'path';

// Parse .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
let apiKey = process.env.CWA_API_KEY;

if (!apiKey && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('CWA_API_KEY=')) {
      apiKey = trimmed.substring('CWA_API_KEY='.length).trim();
      break;
    }
  }
}

if (!apiKey) {
  console.error('Error: CWA_API_KEY is not defined in .env.local or environment');
  process.exit(1);
}

const DATASET_ID = 'F-C0032-001';
const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${DATASET_ID}?Authorization=${apiKey}&format=JSON`;

console.log(`Testing CWA API with Dataset: ${DATASET_ID}...`);

try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  
  if (data.success !== 'true') {
    throw new Error(`API returned success=${data.success}`);
  }

  const locations = data.records?.location || [];
  console.log(`\n=== CWA API Test Success ===`);
  console.log(`Dataset: ${data.records?.datasetDescription}`);
  console.log(`Total Locations Received: ${locations.length}`);
  
  if (locations.length > 0) {
    const firstLoc = locations[0];
    console.log(`Example Location: ${firstLoc.locationName}`);
    console.log('Available Weather Elements:');
    for (const elem of firstLoc.weatherElement) {
      console.log(` - ${elem.elementName}: ${elem.time?.[0]?.parameter?.parameterName || 'N/A'}`);
    }
  }

  // Save sample JSON for development according to design.md Phase 1
  fs.mkdirSync(path.resolve(process.cwd(), 'data'), { recursive: true });
  const samplePath = path.resolve(process.cwd(), 'data/sample_cwa_forecast.json');
  fs.writeFileSync(samplePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`\nSample response saved to: data/sample_cwa_forecast.json`);

} catch (err) {
  console.error('API Test Failed:', err.message);
  process.exit(1);
}
