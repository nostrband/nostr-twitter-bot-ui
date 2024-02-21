import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AddUser from './components/AddUser';
import Histories from './components/Histories';
import './App.css';
import { init as initNostrLogin } from "nostr-login"
import { onAuth } from './helpers/auth';
import NDK from '@nostr-dev-kit/ndk';

initNostrLogin({
  bunkers: "nsec.app",
  onAuth
});

export const ndk = new NDK({
  explicitRelayUrls: ["wss://relay.nostr.band", "wss://nos.lol"],
});
ndk.connect();

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
