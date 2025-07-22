// Import the built-in http module to make web requests
import * as http from 'http';
// Import URL module to parse web addresses
import { URL } from 'url';

// Define the structure of Workplace data
interface Workplace {
  id: number;
  name: string;
  status: number; // 0 = active, other numbers mean inactive
}

// Define the structure of Shift data
interface Shift {
  id: number;
  workplaceId: number;
  workerId: number | null; // worker assigned or not
  cancelledAt: string | null; // when cancelled (null means not cancelled)
  endAt: string; // when the shift ended
}

// Define structure of final output (workplace name and completed shifts)
interface WorkplaceResult {
  name: string;
  shifts: number;
}

// Function to fetch data from given URL (like visiting a webpage)
function fetchJson<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    // Parse the provided URL
    const parsedUrl = new URL(url);

    // Create options for the web request
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET', // method = GET (request data)
      headers: {
        'Accept': 'application/json', // we expect JSON data
      },
    };

    // Make the web request
    const req = http.request(options, (res) => {
      let data = '';

      // Receive chunks of data
      res.on('data', (chunk) => {
        data += chunk;
      });

      // All data received, now handle it
      res.on('end', () => {
        // Check if we got a good response (status code 200-299)
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            // Turn the text data into JavaScript object
            const jsonData = JSON.parse(data);
            resolve(jsonData); // return the data
          } catch (error) {
            reject(new Error(`Failed to parse JSON: ${error}`));
          }
        } else {
          reject(new Error(`HTTP error! status: ${res.statusCode}`));
        }
      });
    });

    // Handle errors during web request
    req.on('error', (error) => {
      reject(error);
    });

    // Send the web request
    req.end();
  });
}

// Function to get all workplaces (from multiple pages)
async function fetchAllWorkplaces(): Promise<Workplace[]> {
  let allWorkplaces: Workplace[] = [];
  let nextUrl: string | null = 'http://localhost:3000/workplaces';

  // Loop to get all pages of workplaces
  while (nextUrl) {
    const response: {
      data: Workplace[];
      links: { next: string | null };
    } = await fetchJson(nextUrl);

    // Add fetched workplaces to the list
    allWorkplaces.push(...response.data);

    // Check if there's another page
    nextUrl = response.links.next;
  }

  return allWorkplaces; // all workplaces fetched
}

// Function to get all shifts (from multiple pages)
async function fetchAllShifts(): Promise<Shift[]> {
  let allShifts: Shift[] = [];
  let nextUrl: string | null = 'http://localhost:3000/shifts';

  // Loop to get all pages of shifts
  while (nextUrl) {
    const response: {
      data: Shift[];
      links: { next: string | null };
    } = await fetchJson(nextUrl);

    // Add fetched shifts to the list
    allShifts.push(...response.data);

    // Check if there's another page
    nextUrl = response.links.next;
  }

  return allShifts; // all shifts fetched
}

// Function to check if a shift is "completed"
function isShiftCompleted(shift: Shift): boolean {
  const now = new Date(); // current date/time
  const endTime = new Date(shift.endAt); // shift end date/time

  // Shift is completed if it has a worker, is not cancelled, and has ended
  return (
    shift.workerId !== null &&
    shift.cancelledAt === null &&
    endTime < now
  );
}

// Main logic to find top 3 workplaces
async function getTopWorkplaces(): Promise<WorkplaceResult[]> {
  // Get all workplaces and shifts
  const [workplaces, shifts] = await Promise.all([
    fetchAllWorkplaces(),
    fetchAllShifts()
  ]);

  // Keep only active workplaces (status = 0)
  const activeWorkplaces = workplaces.filter(workplace => workplace.status === 0);

  // Keep only completed shifts
  const completedShifts = shifts.filter(isShiftCompleted);

  // Count completed shifts for each workplace (using Map)
  const workplaceShiftCounts = new Map<number, number>();

  for (const shift of completedShifts) {
    const count = workplaceShiftCounts.get(shift.workplaceId) || 0;
    workplaceShiftCounts.set(shift.workplaceId, count + 1);
  }

  // Create final result, sort by most shifts, and pick top 3
  const results: WorkplaceResult[] = activeWorkplaces
    .map(workplace => ({
      name: workplace.name,
      shifts: workplaceShiftCounts.get(workplace.id) || 0
    }))
    .filter(result => result.shifts > 0) // remove workplaces with no shifts
    .sort((a, b) => b.shifts - a.shifts) // sort high to low
    .slice(0, 3); // take top 3 only

  return results; // final results
}

// Main function to run the script
async function main() {
  try {
    const topWorkplaces = await getTopWorkplaces(); // get top workplaces
    console.log(JSON.stringify(topWorkplaces, null, 2)); // print results
  } catch (error) {
    // If error, exit silently
    process.exit(1);
  }
}

// Run the main function
main();
