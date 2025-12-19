import React from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Alert, 
    CircularProgress,
    Paper,
    Divider,
    Skeleton
} from '@mui/material';
import { useProfile } from '../hooks/useProfile';

export const ProfilePage: React.FC = () => {
    const { 
        profile,
        formData, 
        formErrors, 
        isLoading, 
        isUpdating,
        isEditing, 
        error,
        updateSuccess,
        isFormValid,
        handleChange, 
        handleEdit,
        handleCancel,
        handleSubmit 
    } = useProfile();

    // Displaying initial loading state
    if (isLoading) {
        return (
            <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Mon Profil
                </Typography>
                <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={60} />
            </Box>
        );
    }

    return (
        <Paper sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Mon Profil
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}

            {updateSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Profil mis à jour avec succès !
                </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Prénom"
                    variant="outlined"
                    fullWidth
                    value={formData.firstName || ''}
                    onChange={handleChange('firstName')}
                    error={!!formErrors.firstName}
                    helperText={formErrors.firstName}
                    disabled={!isEditing || isUpdating}
                    InputProps={{
                        readOnly: !isEditing,
                    }}
                />

                <TextField
                    label="Nom"
                    variant="outlined"
                    fullWidth
                    value={formData.lastName || ''}
                    onChange={handleChange('lastName')}
                    error={!!formErrors.lastName}
                    helperText={formErrors.lastName}
                    disabled={!isEditing || isUpdating}
                    InputProps={{
                        readOnly: !isEditing,
                    }}
                />

                <TextField
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    value={formData.email || ''}
                    onChange={handleChange('email')}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    disabled={!isEditing || isUpdating}
                    InputProps={{
                        readOnly: !isEditing,
                    }}
                />

                <TextField
                    label="Téléphone"
                    variant="outlined"
                    fullWidth
                    value={formData.phone || ''}
                    onChange={handleChange('phone')}
                    disabled={!isEditing || isUpdating}
                    InputProps={{
                        readOnly: !isEditing,
                    }}
                />

                {profile && (
                    <Typography variant="caption" color="text.secondary">
                        Membre depuis : {new Date(profile.createdAt).toLocaleDateString('fr-FR')}
                    </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    {!isEditing ? (
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleEdit}
                            fullWidth
                        >
                            Modifier
                        </Button>
                    ) : (
                        <>
                            <Button 
                                variant="outlined" 
                                color="secondary" 
                                onClick={handleCancel}
                                disabled={isUpdating}
                                sx={{ flex: 1 }}
                            >
                                Annuler
                            </Button>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={handleSubmit}
                                disabled={!isFormValid || isUpdating}
                                sx={{ flex: 1, position: 'relative' }}
                            >
                                {isUpdating ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Enregistrer'
                                )}
                            </Button>
                        </>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};
