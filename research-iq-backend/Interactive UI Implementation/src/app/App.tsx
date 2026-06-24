import { RouterProvider } from 'react-router';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { AppProvider } from './context/AppContext';
import { muiTheme } from './theme/muiTheme';

export default function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AppProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AppProvider>
    </ThemeProvider>
  );
}
