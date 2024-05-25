import { Box, Button, Container, Grid, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { keyframes } from '@emotion/react';

const blink = keyframes`
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
`;

const shake = keyframes`
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
`;

const NotFoundPage = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                textAlign: 'center',
                backgroundColor: '#FEF8EC'
            }}
        >
            <Container maxWidth="md">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <img
                            src="https://img.freepik.com/premium-vector/broken-links-identification-isometric-illustration_151150-188.jpg"
                            alt="Broken Links"
                            width="100%"
                            height="auto"
                        />
                        <Typography
                            variant="h3"
                            sx={{
                                marginBottom: "3%",
                                position: 'relative',
                                animation: `${blink} 1.5s infinite, ${shake} 0.5s infinite`
                            }}
                        >
                            The page you’re looking for doesn’t exist.
                        </Typography>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <Button 
                                variant="contained" 
                                sx={{
                                    backgroundColor: '#FF5722', 
                                    color: '#FFFFFF', 
                                    padding: '10px 20px', 
                                    borderRadius: '25px',
                                    '&:hover': {
                                        backgroundColor: '#E64A19'
                                    },
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                Back Home
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default NotFoundPage;
