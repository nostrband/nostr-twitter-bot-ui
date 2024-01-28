import AddUser from './components/AddUser';
import Histories from './components/Histories';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AddUser />,
  },
  {
    path: '/history',
    element: <Histories />,
  },
]);

function App() {
  return (
    <div className="root">
      <RouterProvider router={router} />;
    </div>
  );
}

export default App;
