import { RouterProvider } from 'react-router-dom';
import { router } from './app/router.jsx';
import { CircuitProvider } from './stores/CircuitContext.jsx';
import { AuthProvider } from './stores/AuthContext.jsx';
import { ProgressProvider } from './stores/ProgressContext.jsx';

export default function App() {
  return (
    <AuthProvider>
      <CircuitProvider>
        <ProgressProvider>
          <RouterProvider router={router} />
        </ProgressProvider>
      </CircuitProvider>
    </AuthProvider>
  );
}
