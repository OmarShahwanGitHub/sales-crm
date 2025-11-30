import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as callLogsApi from '../api/callLogsApi';

export const fetchCallLogs = createAsyncThunk('callLogs/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await callLogsApi.getCallLogs();
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch call logs');
  }
});

export const fetchCallLogsByClient = createAsyncThunk('callLogs/fetchByClient', async (clientId, { rejectWithValue }) => {
  try {
    const response = await callLogsApi.getCallLogsByClient(clientId);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch call logs');
  }
});

export const addCallLog = createAsyncThunk('callLogs/add', async (callLogData, { rejectWithValue }) => {
  try {
    const response = await callLogsApi.createCallLog(callLogData);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create call log');
  }
});

export const removeCallLog = createAsyncThunk('callLogs/remove', async (id, { rejectWithValue }) => {
  try {
    await callLogsApi.deleteCallLog(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete call log');
  }
});

const callLogsSlice = createSlice({
  name: 'callLogs',
  initialState: {
    callLogs: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCallLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCallLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.callLogs = action.payload;
      })
      .addCase(fetchCallLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCallLogsByClient.fulfilled, (state, action) => {
        state.callLogs = action.payload;
      })
      .addCase(addCallLog.fulfilled, (state, action) => {
        state.callLogs.unshift(action.payload);
      })
      .addCase(removeCallLog.fulfilled, (state, action) => {
        state.callLogs = state.callLogs.filter(log => log._id !== action.payload);
      });
  }
});

export const { clearError } = callLogsSlice.actions;
export default callLogsSlice.reducer;
