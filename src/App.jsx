import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutesNew';

/**
 * Root Application Component
 */
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
