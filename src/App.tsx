import { useEffect } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { setTransformers } from './store/transformerSlice';
import TransformerTable from './components/TransformerTable';
import VoltageChart from './components/VoltageChart';
import transformerData from './api/sampledata.json';
import { useLocalStorage } from './hooks/useLocalStorage';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function AppContent() {
  useLocalStorage();

  useEffect(() => {
    store.dispatch(setTransformers(transformerData));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth={false}
        sx={{
          py: 4,
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <TransformerTable />
        <VoltageChart />
      </Container>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
