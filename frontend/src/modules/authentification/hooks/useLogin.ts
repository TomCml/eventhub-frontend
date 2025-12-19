import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/store';
import { loginUser } from '../store/auth.slice';
import { useSelector } from 'react-redux';
import type { AppState } from '../../store/store';

export const useLogin = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    // Fetching auth state from Redux
    const { isLoading, error: authError, token, registeredEmail, registeredPassword } = useSelector((state: AppState) => state.auth);

    // Demo: Pre-fill email and password if user just registered
    useEffect(() => {
        if (registeredEmail && registeredPassword) {
            setFormData({ email: registeredEmail, password: registeredPassword });
        } else if (registeredEmail) {
            setFormData(prev => ({ ...prev, email: registeredEmail }));
        }
    }, [registeredEmail, registeredPassword]);

    // Demo: Redirect to profile after successful login
    useEffect(() => {
        if (token) {
            navigate('/profile');
        }
    }, [token, navigate]);

    const validate = useCallback(() => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.email) {
            newErrors.email = "L'email est requis";
        }
        
        if (!formData.password) {
            newErrors.password = "Le mot de passe est requis";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        
        try {
            await dispatch(loginUser({ 
                User: formData.email, 
                Pass: formData.password 
            })).unwrap();
        } catch {
        }
    };

    const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== '';

    return {
        formData,
        errors,
        isLoading,
        authError,
        isFormValid,
        handleChange,
        handleSubmit
    };
};
