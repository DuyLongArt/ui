import React from 'react';
import { Box } from '@mui/material';
import LoginForm from './LoginForm';

interface LoginPageProps {
  children?: React.ReactNode;
}

const LoginIndex: React.FC<LoginPageProps> = ({ children }) => {
  return (
    <Box>
      <LoginForm />
      {children}
    </Box>
  );
};

export default LoginIndex;

// ===== HOẶC VERSION ĐƠN GIẢN HƠN =====

// const LoginPage: React.FC = () => {
//   return (
//     <Box>
//       <LoginForm />
//     </Box>
//   );
// };

// export default LoginPage;

// ===== HOẶC VERSION VỚI LAYOUT WRAPPER =====

// interface LoginPageProps {
//   onLoginSuccess?: (jwt: string) => void;
//   redirectPath?: string;
// }

// const LoginPage: React.FC<LoginPageProps> = ({ 
//   onLoginSuccess, 
//   redirectPath = '/dashboard' 
// }) => {
//   return (
//     <Box 
//       sx={{
//         minHeight: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//       }}
//     >
//       {/* Optional Header */}
//       <Box sx={{ p: 2 }}>
//         {/* Logo or brand */}
//       </Box>
      
//       {/* Main Content */}
//       <Box 
//         sx={{ 
//           flex: 1, 
//           display: 'flex', 
//           alignItems: 'center', 
//           justifyContent: 'center' 
//         }}
//       >
//         <LoginForm />
//       </Box>
      
//       {/* Optional Footer */}
//       <Box sx={{ p: 2, textAlign: 'center' }}>
//         {/* Footer content */}
//       </Box>
//     </Box>
//   );
// };

// export default LoginPage;