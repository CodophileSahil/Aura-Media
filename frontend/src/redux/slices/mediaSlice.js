import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/media';

const initialState = {
  mediaItems: [],
  selectedMedia: null,
  recommendations: [],
  searchResults: [],
  loading: false,
  uploading: false,
  error: null,
};

// Async Thunks
export const fetchMedia = createAsyncThunk(
  'media/fetchAll',
  async (filters, thunkAPI) => {
    try {
      let url = API_URL;
      if (filters) {
        const params = new URLSearchParams(filters).toString();
        url += `?${params}`;
      }
      const response = await axios.get(url);
      return response.data.media;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const uploadMediaFile = createAsyncThunk(
  'media/upload',
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateMediaMetadata = createAsyncThunk(
  'media/update',
  async ({ id, mediaData }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, mediaData);
      return response.data.media;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteMediaFile = createAsyncThunk(
  'media/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const searchMediaFiles = createAsyncThunk(
  'media/search',
  async ({ query, type, category, mediaType }, thunkAPI) => {
    try {
      const params = new URLSearchParams({ query, type: type || 'text' });
      if (category) params.append('category', category);
      if (mediaType) params.append('mediaType', mediaType);
      
      const response = await axios.get(`/api/search?${params.toString()}`);
      return response.data.results;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    clearMediaError: (state) => {
      state.error = null;
    },
    resetSearchResults: (state) => {
      state.searchResults = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.mediaItems = action.payload;
      })
      .addCase(fetchMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload
      .addCase(uploadMediaFile.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadMediaFile.fulfilled, (state, action) => {
        state.uploading = false;
        state.mediaItems.unshift(action.payload.media);
      })
      .addCase(uploadMediaFile.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateMediaMetadata.fulfilled, (state, action) => {
        const index = state.mediaItems.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.mediaItems[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteMediaFile.fulfilled, (state, action) => {
        state.mediaItems = state.mediaItems.filter((item) => item._id !== action.payload);
      })
      // Search
      .addCase(searchMediaFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMediaFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchMediaFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMediaError, resetSearchResults } = mediaSlice.actions;
export default mediaSlice.reducer;
