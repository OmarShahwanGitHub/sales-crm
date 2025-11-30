import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as statsApi from '../api/statsApi';

export const fetchDashboardStats = createAsyncThunk('stats/dashboard', async (_, { rejectWithValue }) => {
  try {
    const response = await statsApi.getDashboardStats();
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
  }
});

export const fetchAllAgentsStats = createAsyncThunk('stats/allAgents', async (_, { rejectWithValue }) => {
  try {
    const response = await statsApi.getAllAgentsStats();
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch agents stats');
  }
});

export const fetchAgentStats = createAsyncThunk('stats/agent', async (id, { rejectWithValue }) => {
  try {
    const response = await statsApi.getAgentStats(id);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch agent stats');
  }
});

const statsSlice = createSlice({
  name: 'stats',
  initialState: {
    dashboardStats: null,
    agentsStats: [],
    currentAgentStats: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllAgentsStats.fulfilled, (state, action) => {
        state.agentsStats = action.payload;
      })
      .addCase(fetchAgentStats.fulfilled, (state, action) => {
        state.currentAgentStats = action.payload;
      });
  }
});

export default statsSlice.reducer;
