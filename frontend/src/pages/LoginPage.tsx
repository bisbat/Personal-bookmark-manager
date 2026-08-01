import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';

/** A centered entry point for users who have not signed in yet. */
function LoginPage() {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = (): void => {
    void loginWithRedirect();
  };

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
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            px: { xs: 3, sm: 6 },
            py: { xs: 5, sm: 7 },
            textAlign: 'center',
          }}
        >
          <Typography component="h1" variant="h3" gutterBottom>
            Welcome to LinkSaver!
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Sign in to save, organize, and revisit your favorite links.
          </Typography>
          <Button
            color="primary"
            fullWidth
            onClick={handleLogin}
            size="large"
            variant="contained"
          >
            Log in
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;
