import { createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';

// Define users interface
interface User {
    id: number;
    name: string;
    email: string;
    address: { 
        city: string;
        suite?: string;
        street: string;
        zipcode: string;
    };
}

// State interface
interface UserState{
    users: User[];
    status: 'idle' | 'loading...' | 'successful ✅' | 'failed ✖';
    error?: string | null;
}

// Initial state
const initialState: UserState = {
    users: [],
    status: 'idle',
    error: null
}

// Async thunk to fetch initial user data from API
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return await response.json() as User[];
});

// User slice
interface AddUserPayload {
    name: string;
    email: string;
    address: {
        city: string;
        suite?: string;
        street: string;
        zipcode: string;
    };
}

// Removed UpdateUserPayload as it is equivalent to User

type DeleteUserPayload = number;

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        // Add a new user
        addUser: (state: UserState, action: PayloadAction<AddUserPayload>) => {
            // Generate a new Id
            const newId = state.users.length > 0 ? Math.max(...state.users.map(user => user.id)) + 1 : 1;
            state.users.push({
                ...action.payload,
                id: newId,
            });
        },

        // Update existing user
        updateUser: (state: UserState, action: PayloadAction<User>) => {
            const index = state.users.findIndex(user => user.id === action.payload.id);
            if (index !== -1) {
                state.users[index] = action.payload;
            }
        },

        // Delete user
        deleteUser: (state: UserState, action: PayloadAction<DeleteUserPayload>) => {
            state.users = state.users.filter(user => user.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state: UserState) => {
                state.status = "loading...";
            })
            .addCase(fetchUsers.fulfilled, (state: UserState, action: PayloadAction<User[]>) => {
                state.status = "successful ✅";
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state: UserState, action) => {
                state.status = "failed ✖";
                state.error = action.error?.message || "Sorry, something went wrong.";
            });
    }
});

// Export actions and reducer
export const { addUser, updateUser, deleteUser } = userSlice.actions;

// Export reducer
// Removed unused declaration
export const useReducer = userSlice.reducer;
