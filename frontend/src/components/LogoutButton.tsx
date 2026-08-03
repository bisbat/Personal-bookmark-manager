import { Button } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

interface LogoutButtonProps {
  label?: string;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  size?: 'small' | 'medium' | 'large';
  sx?: object;
}

export default function LogoutButton({
  label = 'Logout',
  variant = 'outlined',
  color = 'inherit',
  size = 'medium',
  sx,
}: LogoutButtonProps) {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <Button variant={variant} color={color} size={size} onClick={handleLogout} sx={sx}>
      {label}
    </Button>
  );
}
