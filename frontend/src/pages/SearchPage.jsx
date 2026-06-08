import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { searchMediaFiles, resetSearchResults, deleteMediaFile } from '../redux/slices/mediaSlice';
import MediaCard from '../components/ui/MediaCard';
import { Search, Mic, Sparkles, Filter, AlertCircle, HelpCircle, Activity } from 'lucide-react';

export const SearchPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { user } = useSelector((state) => state.auth);
  const { searchResults, loading, error } = useSelector((state) => state.media);

  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('text'); // 'text' | 'semantic'
  const [category, setCategory] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [voiceListening, setVoiceListening] = useState(false);

  // Sync with URL query parameter if present
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      dispatch(searchMediaFiles({ query: q, type: searchType, category, mediaType }));
    } else {
      dispatch(resetSearchResults());
    }
  }, [searchParams, dispatch]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setSearchParams({ q: query });
    dispatch(searchMediaFiles({ query, type: searchType, category, mediaType }));
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setVoiceListening(true);
    };

    rec.onerror = (e) => {
      console.error(e.error);
      setVoiceListening(false);
    };

    rec.onend = () => {
      setVoiceListening(false);
    };

    rec.onresult = (event) => {
      const spoke = event.results[0][0].transcript;
      setQuery(spoke);
      setSearchParams({ q: spoke });
      dispatch(searchMediaFiles({ query: spoke, type: searchType, category, mediaType }));
    };

    rec.start();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this media asset?')) {
      dispatch(deleteMediaFile(id)).then(() => {
        // Remove from local search results list
        handleSearch();
      });
    }
  };

  return (
    <div className="p-6 space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 flex items-center space-x-2">
          <Search size={24} className="text-brand-500" />
          <span>Smart Search Console</span>
        </h1>
        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
          Query content databases using keyword indexing or AI vector semantics
        </p>
      </div>

      {/* Search Console Input Bar */}
      <div className="glass-card p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 space-y-4 shadow-xl">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-3">
          {/* Main search bar */}
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-24 py-3 glass-input text-sm rounded-xl focus:ring-2 focus:ring-brand-500/35"
              placeholder="Search by keywords, transcripts, summaries..."
              required
            />
            {/* Voice microphone button */}
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`absolute right-4 top-2 p-1.5 rounded-lg transition ${
                voiceListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              title="Voice Search Query"
            >
              <Mic size={16} />
            </button>
          </div>

          {/* Search Type Selector */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setSearchType('text')}
              className={`flex-1 md:flex-none px-4 py-3 text-xs font-bold rounded-xl border transition flex items-center justify-center space-x-1.5 ${
                searchType === 'text'
                  ? 'bg-brand-500/10 border-brand-500 text-brand-500'
                  : 'bg-white dark:bg-dark-card border-gray-200 dark:border-gray-800'
              }`}
            >
              <span>Standard</span>
            </button>
            <button
              type="button"
              onClick={() => setSearchType('semantic')}
              className={`flex-1 md:flex-none px-4 py-3 text-xs font-bold rounded-xl border transition flex items-center justify-center space-x-1.5 ${
                searchType === 'semantic'
                  ? 'bg-indigo-500/10 border-indigo-500 text-indigo-500'
                  : 'bg-white dark:bg-dark-card border-gray-200 dark:border-gray-800'
              }`}
            >
              <Sparkles size={12} className="text-indigo-500" />
              <span>Semantic AI</span>
            </button>
          </div>

          {/* Trigger Button */}
          <button type="submit" disabled={loading} className="w-full md:w-auto gradient-btn px-6 py-3 rounded-xl text-sm font-semibold">
            Search
          </button>
        </form>

        {/* Categories / Formats filters */}
        <div className="flex flex-wrap items-center gap-4 border-t border-gray-100 dark:border-gray-850 pt-4 text-xs">
          <div className="flex items-center space-x-1 text-gray-400">
            <Filter size={14} />
            <span>Search Filters:</span>
          </div>

          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
            className="glass-input text-[11px] font-bold py-1 px-3 dark:bg-dark-card"
          >
            <option value="">All Formats</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audios</option>
            <option value="document">Documents</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="glass-input text-[11px] font-bold py-1 px-3 dark:bg-dark-card"
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

      {/* Voice listening status dialog overlays */}
      {voiceListening && (
        <div className="bg-brand-500/10 border border-brand-500/20 rounded-2xl p-4 flex items-center space-x-3 text-brand-500 text-xs animate-pulse">
          <Activity className="animate-pulse" />
          <span>Listening... Please speak your search query clearly into your microphone.</span>
        </div>
      )}

      {/* Results grid views */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-44 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : searchResults.length === 0 ? (
        query && (
          <div className="text-center py-16 bg-white dark:bg-dark-card/20 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/40">
            <AlertCircle size={32} className="mx-auto text-gray-400 mb-2" />
            <h3 className="font-bold text-gray-700 dark:text-gray-300">No results found</h3>
            <p className="text-xs text-gray-400 mt-1">
              Try modifying your search query or switching from Semantic to Standard keyword search.
            </p>
          </div>
        )
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider">
            <span>Matches Found ({searchResults.length})</span>
            {searchType === 'semantic' && (
              <span className="text-indigo-500 flex items-center space-x-1">
                <Sparkles size={12} />
                <span>Sorted by AI Similarity Index</span>
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((result) => (
              <div key={result.media._id} className="relative">
                <MediaCard item={result.media} onDelete={handleDelete} currentUser={user} />
                
                {/* Score percentage overlay badge */}
                <span className={`absolute top-4 right-4 text-[9px] font-bold px-2 py-0.5 rounded-full z-10 shadow uppercase tracking-wider ${
                  result.score > 80 
                    ? 'bg-green-500 text-white' 
                    : result.score > 50 
                    ? 'bg-brand-500 text-white' 
                    : 'bg-indigo-500 text-white'
                }`}>
                  {result.score}% Match
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
