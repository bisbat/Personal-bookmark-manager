import { useAuth0 } from '@auth0/auth0-react';
import { Box, CircularProgress, Container, Paper, Typography } from '@mui/material';

/** Displays the Auth0 callback state while the provider completes sign-in. */
function AuthCallbackPage() {
  const { error } = useAuth0();
  const message = error
    ? 'We could not complete your sign-in. Please return to the login page and try again.'
    : 'Signing you in…';

  return (
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        backgroundColor: 'background.default',
        display: 'flex',
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            px: { xs: 3, sm: 5 },
            py: { xs: 5, sm: 6 },
            textAlign: 'center',
          }}
        >
          {!error && <CircularProgress aria-label="Signing in" sx={{ mb: 3 }} />}
          <Typography component="h1" variant="h5">
            {message}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default AuthCallbackPage;
