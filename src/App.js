import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AddUser from './components/AddUser';
import Histories from './components/Histories';
import './App.css';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AddUser />,
  },
  {
    path: '/:username',
    element: <Histories />,
  },
]);

function App() {
  return (
    <div className="root">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
