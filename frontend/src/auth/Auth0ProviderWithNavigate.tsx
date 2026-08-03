import { Auth0Provider } from '@auth0/auth0-react';
import type { AppState } from '@auth0/auth0-react';
import { useCallback } from 'react';
import type { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router';

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const auth0CallbackUrl = new URL('/callback', window.location.origin).toString();

if (!auth0Domain || !auth0ClientId) {
  throw new Error('Auth0 domain and client ID must be configured.');
}

/** Connects Auth0's redirect lifecycle to React Router navigation. */
function Auth0ProviderWithNavigate({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const onRedirectCallback = useCallback(
    (appState?: AppState): void => {
      const returnTo = appState?.returnTo;
      const destination = returnTo?.startsWith('/bookmarks') && !returnTo.startsWith('//') ? returnTo : '/bookmarks';

      navigate(destination, { replace: true });
    },
    [navigate],
  );

  return (
    <Auth0Provider
      authorizationParams={{
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        redirect_uri: auth0CallbackUrl,
        scope: import.meta.env.VITE_AUTH0_SCOPE,
      }}
      clientId={auth0ClientId}
      domain={auth0Domain}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
}

export default Auth0ProviderWithNavigate;
