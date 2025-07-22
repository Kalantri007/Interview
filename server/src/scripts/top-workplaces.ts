import * as http from 'http';
import { URL } from 'url';

interface Workplace {
  id: number;
  name: string;
  status: number;
}

interface Shift {
  id: number;
  workplaceId: number;
  workerId: number | null;
  cancelledAt: string | null;
  endAt: string;
}

interface WorkplaceResult {
  name: string;
  shifts: number;
}

function fetchJson<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(new Error(`Failed to parse JSON: ${error}`));
          }
        } else {
          reject(new Error(`HTTP error! status: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function fetchAllWorkplaces(): Promise<Workplace[]> {
  let allWorkplaces: Workplace[] = [];
  let nextUrl: string | null = 'http://localhost:3000/workplaces';
  
  while (nextUrl) {
    const response: {
      data: Workplace[];
      links: { next: string | null };
    } = await fetchJson(nextUrl);
    
    allWorkplaces.push(...response.data);
    nextUrl = response.links.next;
  }
  
  return allWorkplaces;
}

async function fetchAllShifts(): Promise<Shift[]> {
  let allShifts: Shift[] = [];
  let nextUrl: string | null = 'http://localhost:3000/shifts';
  
  while (nextUrl) {
    const response: {
      data: Shift[];
      links: { next: string | null };
    } = await fetchJson(nextUrl);
    
    allShifts.push(...response.data);
    nextUrl = response.links.next;
  }
  
  return allShifts;
}

function isShiftCompleted(shift: Shift): boolean {
  const now = new Date();
  const endTime = new Date(shift.endAt);
  
  return (
    shift.workerId !== null &&
    shift.cancelledAt === null &&
    endTime < now
  );
}
async function getTopWorkplaces(): Promise<WorkplaceResult[]> {
    // Fetch workplaces and shifts
    const [workplaces, shifts] = await Promise.all([
        fetchAllWorkplaces(),
        fetchAllShifts()
    ]);
    
    // Only active workplaces
    const activeWorkplaces = workplaces.filter(workplace => workplace.status === 0);
    
    // Only completed shifts
    const completedShifts = shifts.filter(isShiftCompleted);
    
    // Count shifts per workplace
    const workplaceShiftCounts = new Map<number, number>();
    
    for (const shift of completedShifts) {
        const count = workplaceShiftCounts.get(shift.workplaceId) || 0;
        workplaceShiftCounts.set(shift.workplaceId, count + 1);
    }
    
    // Build and sort results
    const results: WorkplaceResult[] = activeWorkplaces
        .map(workplace => ({
            name: workplace.name,
            shifts: workplaceShiftCounts.get(workplace.id) || 0
        }))
        .filter(result => result.shifts > 0)
        .sort((a, b) => b.shifts - a.shifts)
        .slice(0, 3);
    
    return results;
}

async function main() {
    try {
        const topWorkplaces = await getTopWorkplaces();
        console.log(JSON.stringify(topWorkplaces, null, 2));
    } catch (error) {
        // Silent exit on error
        process.exit(1);
    }
}

main();
