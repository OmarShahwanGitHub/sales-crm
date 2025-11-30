import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as clientsApi from '../api/clientsApi';

export const fetchClients = createAsyncThunk('clients/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await clientsApi.getClients();
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch clients');
  }
});

export const fetchClient = createAsyncThunk('clients/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const response = await clientsApi.getClient(id);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch client');
  }
});

export const addClient = createAsyncThunk('clients/add', async (clientData, { rejectWithValue }) => {
  try {
    const response = await clientsApi.createClient(clientData);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create client');
  }
});

export const editClient = createAsyncThunk('clients/edit', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await clientsApi.updateClient(id, data);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update client');
  }
});

export const removeClient = createAsyncThunk('clients/remove', async (id, { rejectWithValue }) => {
  try {
    await clientsApi.deleteClient(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete client');
  }
});

const clientsSlice = createSlice({
  name: 'clients',
  initialState: {
    clients: [],
    currentClient: null,
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
      // Fetch all clients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single client
      .addCase(fetchClient.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClient.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClient = action.payload;
      })
      .addCase(fetchClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add client
      .addCase(addClient.fulfilled, (state, action) => {
        state.clients.unshift(action.payload);
      })
      // Edit client
      .addCase(editClient.fulfilled, (state, action) => {
        const index = state.clients.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        state.currentClient = action.payload;
      })
      // Remove client
      .addCase(removeClient.fulfilled, (state, action) => {
        state.clients = state.clients.filter(c => c._id !== action.payload);
      });
  }
});

export const { clearError } = clientsSlice.actions;
export default clientsSlice.reducer;
