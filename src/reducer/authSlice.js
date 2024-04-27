// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { loginUser as apiLoginUser } from '../constant/constURL/URLAuth';

// export const loginUser = createAsyncThunk(
//   'auth/loginUser',
//   async (loginData, { rejectWithValue }) => {
//     try {
//       const response = await apiLoginUser(loginData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: null,
//     error: null,
//     status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.user = action.payload;
//         state.status = 'succeeded';
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.error = action.payload;
//         state.status = 'failed';
//       });
//   }
// });

// export default authSlice.reducer;