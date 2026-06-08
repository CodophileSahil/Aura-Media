import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedia, deleteMediaFile } from '../redux/slices/mediaSlice';
import MediaCard from '../components/ui/MediaCard';
import { Grid, List, Filter, Sparkles, FolderOpen } from 'lucide-react';

export const MediaLibraryPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { mediaItems, loading, error } = useSelector((state) => state.media);

  // Filters State
  const [category, setCategory] = useState('');
  const [mediaType, setMediaType] = useState('');

  // Reload media when filters change
  useEffect(() => {
    dispatch(fetchMedia({ category, mediaType }));
  }, [category, mediaType, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this media item? This will permanently delete the file from the server.')) {
      dispatch(deleteMediaFile(id));
    }
  };

  const handleUpdate = () => {
    // Reload items on metrics change (like download increment)
    dispatch(fetchMedia({ category, mediaType }));
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 flex items-center space-x-2">
            <FolderOpen size={24} className="text-brand-500" />
            <span>Shared Media Library</span>
          </h1>
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
            Access, play, distribute, and analyze platform files
          </p>
        </div>

        {/* Categories / Type Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* MediaType Filter */}
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
            className="glass-input text-xs font-semibold dark:bg-dark-card"
          >
            <option value="">All Formats</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audios</option>
            <option value="document">Documents</option>
          </select>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="glass-input text-xs font-semibold dark:bg-dark-card"
          >
            <option value="">All Categories</option>
            <option value="General">General</option>
            <option value="Technology">Technology</option>
            <option value="Education">Education</option>
            <option value="Finance">Finance</option>
            <option value="Nature">Nature</option>
            <option value="Design">Design</option>
          </select>
        </div>
      </div>

      {/* Media Listings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="glass-card rounded-2xl aspect-video w-full flex flex-col p-4 space-y-3 animate-pulse">
              <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-xl" />
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
          ))}
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-dark-card/20 border border-gray-200/50 dark:border-gray-800/40 rounded-3xl p-6">
          <span className="text-4xl block mb-2">📁</span>
          <h3 className="font-bold text-gray-700 dark:text-gray-300">Your library is empty</h3>
          <p className="text-xs text-gray-400 mt-1">
            Publish contents under the Upload Media link, or check category selection parameters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item) => (
            <MediaCard
              key={item._id}
              item={item}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              currentUser={user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaLibraryPage;
