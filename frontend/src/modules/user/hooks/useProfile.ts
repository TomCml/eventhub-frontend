import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch } from '../../store/store';
import { useSelector } from 'react-redux';
import type { AppState } from '../../store/store';
import { fetchProfile, updateProfile, clearUpdateSuccess } from '../store/user.slice';
import type { UserProfile } from '../gateway/user.gateway';

export const useProfile = () => {
    const dispatch = useAppDispatch();
    
    // Fetch state from Redux (global state)
    const { profile, isLoading, error, isUpdating, updateSuccess } = useSelector(
        (state: AppState) => state.user
    );

    // Demo: Get registered email from auth slice
    const { registeredEmail } = useSelector((state: AppState) => state.auth);

    // Local state for editing (component state)
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<UserProfile>>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Fetch profile on mount
    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    // Sync formData with loaded profile or use registered email for demo
    useEffect(() => {
        if (profile) {
            setFormData({
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
                phone: profile.phone || '',
            });
        } else if (registeredEmail) {
            // Demo: Use registered email if no profile loaded yet
            setFormData({
                firstName: '',
                lastName: '',
                email: registeredEmail,
                phone: '',
            });
        }
    }, [profile, registeredEmail]);

    // Handle update success
    useEffect(() => {
        if (updateSuccess) {
            setIsEditing(false);
            // Clear success message after 3 seconds
            const timer = setTimeout(() => {
                dispatch(clearUpdateSuccess());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [updateSuccess, dispatch]);

    const validate = useCallback(() => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.firstName?.trim()) {
            newErrors.firstName = "Le prénom est requis";
        }
        
        if (!formData.lastName?.trim()) {
            newErrors.lastName = "Le nom est requis";
        }
        
        if (!formData.email?.trim()) {
            newErrors.email = "L'email est requis";
        }

        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        // Clear error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form data to current profile
        if (profile) {
            setFormData({
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
                phone: profile.phone || '',
            });
        }
        setFormErrors({});
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        
        await dispatch(updateProfile(formData));
    };

    const isFormValid = !!(
        formData.firstName?.trim() && 
        formData.lastName?.trim() && 
        formData.email?.trim()
    );


    return {
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
        handleSubmit,
    };
};
