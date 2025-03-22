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
    status: 'loading...' | 'successful ✅' | 'failed ✖';
    error: string | null;
}

// Initial state
const initialState: UserState = {
    users: [],
    status: 'loading...',
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
const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        // Add a new user
        addUser: (state, action: PayloadAction<Omit<User, 'id'>>) => {
            // Generate a new Id
            const newId = state.users.length > 0 ? Math.max(...state.users.map(user => user.id)) + 1 : 1;
            state.users.push({
                ...action.payload,
                id: newId,
            });
        }
    },

        // Update existing user
        updateUser: (state: { users: any[]; }, action: PayloadAction<User>) => {
            const index = state.users.findIndex((user: { id: number; }) =>user.id === action.payload.id );
            if (index !== -1){
                state.users[index] = action.payload;
            }},

        // Delete user
        deleteUser: (state: { users: any[]; }, action: PayloadAction<number>) => {
            state.users = state.users.filter((user: { id: any; }) => user.id !== action.payloadAction);
    },
},
        extraReducers: (builder) {  => {
            builder
            .addCase(fetchUsers.pending, (state: { status: string; }) =>{
                state.status = 'loading...';
            })
            .addCase(fetchUsers.fulfilled, (state: { status: string; users: any; }, action: { payload: any; }) =>{
                state.status = 'successful ✅';
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state: { status: string; users: any; }, action: { error: { message: string; }; }) =>{
                state.status = 'failed ✖';
                state.users = action.error.message || 'Something went wrong';
            });
        }
});

// Export actions and reducer
export const { addUser, updateUser, deleteUser } = userSlice.actions;

// Export reducer
export default userSlice.reducer;