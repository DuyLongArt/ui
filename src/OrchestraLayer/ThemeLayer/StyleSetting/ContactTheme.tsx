import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Your custom theme definition
export const ContactTheme = createTheme({
    palette: {
        primary: {
            main: '#481de4ff', // Note: I removed the extra 'ff' which is valid but often used for opacity
        },
        secondary: {
            main: '#dc004e',
        },
        background: {
            default: '#ffffffff', //
        },
        
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        
        h3: {
            fontWeight: 600,
            color: '#333',
        },
        h5: {
            fontWeight: 500,
            marginBottom: '1rem',
            color: '#555',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
            color: '#21004fff',
        },
         body2: {
            fontSize: '1rem',
            lineHeight: 1.5,
            color: '#ffffffff',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
       MuiAppBar: {
  styleOverrides: {
    // This rule applies to <AppBar color="primary">
    colorPrimary: '#481de4ff',
    
    // This rule applies to <AppBar color="default">
    colorDefault: {
      // This correctly sets the text color for the default AppBar
      color: 'white',
      // You would typically define a backgroundColor here as well
      backgroundColor: '#424242', // Example: a dark grey
    },
  },
},
    
    },
});