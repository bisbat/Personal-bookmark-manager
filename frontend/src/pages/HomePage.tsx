import { Box, Button, Container, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';

export default function HomePage() {
  const navigate = useNavigate();
  // ดึงสถานะการล็อกอินมาจาก Auth0
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  // ระหว่างที่ระบบกำลังเช็คว่า User ล็อกอินหรือยัง ให้แสดงตัวโหลดหมุนๆ (Loading)
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh', // จัดให้อยู่กึ่งกลางหน้าจอแนวตั้ง
          textAlign: 'center',
          gap: 2, // ระยะห่างระหว่าง Element
        }}
      >
        <Typography variant="h2" component="h1" color="primary">
          Bookmarks App
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
          ระบบจัดเก็บและจัดการเว็บไซต์โปรดของคุณอย่างปลอดภัย
        </Typography>

        {/* เช็คว่าล็อกอินหรือยัง เพื่อแสดงปุ่มที่ถูกต้อง */}
        {!isAuthenticated ? (
          // กรณียังไม่ล็อกอิน: ปุ่ม Login
          <Button
            variant="contained"
            color="primary"
            size="large"
            // ใช้ loginWithRedirect() ของ Auth0 ได้เลย หรือจะใช้ navigate('/login') 
            // ถ้าหน้า LoginPage ของคุณมี UI แยกต่างหาก
            onClick={() => loginWithRedirect()} 
            sx={{ px: 4, py: 1.5, borderRadius: 2, fontSize: '1.1rem' }}
          >
            เข้าสู่ระบบ (Login)
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/bookmarks')}
              sx={{ px: 4, py: 1.5, borderRadius: 2, fontSize: '1.1rem' }}
            >
              ไปที่หน้า Bookmarks ของคุณ
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}