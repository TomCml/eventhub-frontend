import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { UserProfile, UserGateway } from '../gateway/user.gateway';
import type { Dependencies } from '../../store/dependencies';

interface UserState {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    isUpdating: boolean;
    updateSuccess: boolean;
}

const initialState: UserState = {
    profile: null,
    isLoading: false,
    error: null,
    isUpdating: false,
    updateSuccess: false,
};

// Async Thunk to fetch profile
export const fetchProfile = createAsyncThunk(
    'user/fetchProfile',
    async (_, { extra, getState }) => {
        const deps = extra as Dependencies;
        
        // Real implementation (commented for demo):
        // const profile: UserProfile = await deps.userGateway.getProfile();
        // return profile;
        
        // Mock implementation(for demo without backend):
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Demo: Use registered email from auth slice if available
        const state = getState() as { auth: { registeredEmail: string | null } };
        const registeredEmail = state.auth.registeredEmail;
        
        return {
            id: '1',
            email: registeredEmail || 'user@example.com',
            firstName: '',
            lastName: '',
            phone: '',
            createdAt: new Date().toISOString(),
        } as UserProfile;
    }
);

// Async Thunk to update profile
export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async (data: Partial<UserProfile>, { extra, getState }) => {
        const deps = extra as Dependencies;
        
        // Real implementation (commented for demo):
        // const updatedProfile: UserProfile = await deps.userGateway.updateProfile(data);
        // return updatedProfile;

        // MOCK IMPLEMENTATION (for demo without backend):
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Merge with existing data to simulate update
        const state = getState() as { user: UserState };
        return {
            ...state.user.profile,
            ...data,
        } as UserProfile;
    }
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.profile = null;
        },
        clearUpdateSuccess: (state) => {
            state.updateSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Profile
            .addCase(fetchProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Erreur lors du chargement du profil";
            })
            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
                state.updateSuccess = false;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isUpdating = false;
                state.profile = action.payload;
                state.updateSuccess = true;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.error.message || "Erreur lors de la mise à jour";
            });
    }
});

export const { clearProfile, clearUpdateSuccess } = userSlice.actions;
export default userSlice.reducer;
