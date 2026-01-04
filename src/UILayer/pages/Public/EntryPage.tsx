import React from 'react';
import { Box, Typography, Button, Container, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const EntryPage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                background: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2
            }}
        >
            <Container maxWidth="sm">
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    sx={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: 2,
                        padding: { xs: 4, md: 6 },
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            color: '#1f2937',
                            fontWeight: 800,
                            mb: 2,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Welcome
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: '#6b7280',
                            mb: 5,
                            fontSize: '1.1rem',
                            lineHeight: 1.6
                        }}
                    >
                        Wellcome to DuyLong Page
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            flexDirection: isMobile ? 'column' : 'row',
                            justifyContent: 'center'
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={() => navigate('/login/index')}
                            size="large"
                            startIcon={<LoginIcon />}
                            sx={{
                                py: 1.5,
                                px: 4,
                                borderRadius: 1,
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                backgroundColor: '#6366f1',
                                boxShadow: 'none',
                                '&:hover': {
                                    backgroundColor: '#4f46e5',
                                    boxShadow: 'none'
                                }
                            }}
                        >
                            Login
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() => navigate('/login/register')}
                            size="large"
                            startIcon={<PersonAddIcon />}
                            sx={{
                                py: 1.5,
                                px: 4,
                                borderRadius: 1,
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                borderColor: '#e5e7eb',
                                color: 'black',
                                '&:hover': {
                                    borderColor: '#d1d5db',
                                    backgroundColor: '#f9fafb',
                                }
                            }}
                        >
                            Sign Up
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default EntryPage;
