import React from 'react';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { useRegister } from '../hooks/useRegister';

export const RegisterForm: React.FC = () => {
    // Appel du Presenter
    const { formData, errors, isFormValid, isLoading, authError, isSuccess, handleChange, handleSubmit } = useRegister();

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Inscription
            </Typography>

            {authError && (
                <Alert severity="error">{authError}</Alert>
            )}

            {isSuccess && (
                <Alert severity="success">
                    Inscription réussie ! Vous pouvez maintenant vous connecter.
                </Alert>
            )}

            <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={handleChange('email')}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isLoading}
            />

            <TextField
                label="Mot de passe"
                type="password"
                variant="outlined"
                fullWidth
                value={formData.password}
                onChange={handleChange('password')}
                error={!!errors.password}
                helperText={errors.password}
                disabled={isLoading}
            />
            
            <TextField
                label="Confirmer mot de passe"
                type="password"
                variant="outlined"
                fullWidth
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={isLoading}
            />

            <Button 
                variant="contained" 
                color="primary" 
                disabled={!isFormValid || isLoading}
                onClick={handleSubmit}
                sx={{ position: 'relative' }}
            >
                {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    "S'inscrire"
                )}
            </Button>
        </Box>
    );
};