import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // optional, for dropdowns, modals, etc.
import 'bootstrap-icons/font/bootstrap-icons.css';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Auth0Provider
            domain={import.meta.env.VITE_AUTH0_ISSUER}
            clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
            authorizationParams={{
              redirect_uri: window.location.origin,
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
              scope: 'openid profile email',
            }}
        >
            <App />
        </Auth0Provider>
    </BrowserRouter>,
)



// added in Auth0 -> Actions -> Library
// exports.onExecutePostLogin = async (event, api) => {
//   const namespace = 'https://my-react-libbooks.com'; // Use your own namespace

//   if (event.authorization) {
//     api.idToken.setCustomClaim('email', event.user.email);
//     api.idToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
//     api.accessToken.setCustomClaim(
//       `${namespace}/roles`,
//       event.authorization.roles
//     );
//     api.accessToken.setCustomClaim('email', event.user.email);
//   }
// };
