import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ShiftDashboard from "./components/ShiftDashboard";
import { theme } from "./theme";

const queryClient = new QueryClient();

// Hardcoded worker ID for demo purposes
export const CURRENT_WORKER_ID = 1;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div
          className="min-h-screen"
          style={{
            background: "linear-gradient(180deg, #F3F7F0 0%, #E8EFE6 100%)",
          }}
        >
          <ShiftDashboard />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
