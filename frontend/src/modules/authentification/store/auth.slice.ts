import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { type Dependencies } from '../../store/dependencies'; 
import { type AuthGateway } from '../gateway/auth.gateway';

interface AuthState {
    token: string | null;
    isLoading: boolean;
    error: string | null;
    // Demo: store registered credentials to pre-fill login form
    registeredEmail: string | null;
    registeredPassword: string | null; // Demo only 
}

// Response type matching the AuthGateway.login() return type
interface LoginResponse {
    token: string;
}

// Response type matching the AuthGateway.register() return type
interface RegisterResponse {
    id: string;
    email: string;
    password: string; // Demo only 
}

const initialState: AuthState = {
    token: null,
    isLoading: false,
    error: null,
    registeredEmail: null,
    registeredPassword: null,
};

// Using thunk to handle async operations
export const loginUser = createAsyncThunk(
    'auth/login',
    async (payload: {User: string, Pass: string}, { extra }) => {
        const deps = extra as Dependencies;
        
        // Real implementation (commented for demo):
        // const response: LoginResponse = await deps.authGateway.login(payload.User, payload.Pass);
        // return response;
        
        // MOCK IMPLEMENTATION (for demo without backend):
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (payload.User === 'error') throw new Error("Invalid credentials");
        return { token: "fake-jwt-token" } as LoginResponse;
    }
);

// Async Thunk for registration
export const registerUser = createAsyncThunk(
    'auth/register',
    async (payload: { email: string; password: string }, { extra }) => {
        const deps = extra as Dependencies;
        
        // Real implementation (commented for demo):
        // const response: RegisterResponse = await deps.authGateway.register(payload);
        // return response;
        
        // MOCK IMPLEMENTATION (for demo without backend):
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (payload.email === 'existing@test.com') {
            throw new Error("Cet email est déjà utilisé");
        }
        // Return email and password for demo purposes (to pre-fill login form)
        return { id: "new-user-id", email: payload.email, password: payload.password } as RegisterResponse;
    }
);


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => { 
            state.token = null; 
            state.registeredEmail = null;
            state.registeredPassword = null;
        },
        login: (state, action) => { state.token = action.payload.token; },
        clearRegisteredCredentials: (state) => { 
            state.registeredEmail = null; 
            state.registeredPassword = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => { 
                state.isLoading = false; 
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => { 
                state.isLoading = false; 
                state.error = action.error.message || "Erreur inconnue"; 
            })
            // Register
            .addCase(registerUser.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(registerUser.fulfilled, (state, action) => { 
                state.isLoading = false; 
                state.registeredEmail = action.payload.email; 
                state.registeredPassword = action.payload.password; // Demo only!
            })
            .addCase(registerUser.rejected, (state, action) => { 
                state.isLoading = false; 
                state.error = action.error.message || "Erreur inconnue"; 
            });
    }
});

export const { login, logout, clearRegisteredCredentials } = authSlice.actions;
export default authSlice.reducer;