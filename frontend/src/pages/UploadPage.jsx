import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { uploadMediaFile } from '../redux/slices/mediaSlice';
import { UploadCloud, CheckCircle, AlertCircle, FileText, Sparkles, Calendar } from 'lucide-react';

export const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [tags, setTags] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uploading, error } = useSelector((state) => state.media);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // Auto fill title with file name if blank
      if (!title) {
        setTitle(selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('isScheduled', isScheduled);
    if (isScheduled && scheduledDate) {
      formData.append('scheduledDate', scheduledDate);
    }

    dispatch(uploadMediaFile(formData)).then((action) => {
      if (!action.error) {
        setSuccess(true);
        // Reset inputs
        setFile(null);
        setTitle('');
        setDescription('');
        setTags('');
        setIsScheduled(false);
        setScheduledDate('');
        
        // Auto navigate to library after 2 seconds
        setTimeout(() => {
          navigate('/library');
        }, 2000);
      }
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">Upload Media Assets</h1>
        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
          Publish images, documents, audio, or video files
        </p>
      </div>

      {/* Main Form container */}
      <div className="glass-card p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl">
        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-500 text-xs rounded-xl p-4 flex items-center space-x-2.5">
            <CheckCircle size={18} />
            <div>
              <p className="font-bold">File Uploaded Successfully!</p>
              <p className="text-gray-500 mt-0.5">Redirecting to your media library, while AI starts indexing metadata in the background...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl p-4 flex items-center space-x-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File Picker Drag-Drop Dropzone */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Select File</label>
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-800/80 rounded-2xl p-6 text-center hover:border-brand-500 transition relative">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required={!file}
              />
              <div className="space-y-2 text-gray-400">
                <UploadCloud size={36} className="mx-auto text-brand-500" />
                <p className="text-xs font-semibold">
                  {file ? file.name : 'Drag & Drop your media files here or click to browse'}
                </p>
                <p className="text-[10px] text-gray-400">
                  Supported: MP4, MP3, JPEG, PNG, PDF, DOCX (Max size: 50MB)
                </p>
              </div>
            </div>
          </div>

          {/* Title and Category Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Media Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full glass-input text-sm"
                placeholder="Enter title"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full glass-input text-sm dark:bg-dark-card"
              >
                <option value="General">General</option>
                <option value="Technology">Technology</option>
                <option value="Education">Education</option>
                <option value="Finance">Finance</option>
                <option value="Nature">Nature</option>
                <option value="Design">Design</option>
              </select>
            </div>
          </div>

          {/* Manual Tag Inputs */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full glass-input text-sm"
              placeholder="e.g. project, documentation, design"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full glass-input text-sm"
              placeholder="Enter brief description..."
            />
          </div>

          {/* Publishing Schedule Panel */}
          <div className="bg-gray-50 dark:bg-dark-bg/60 p-4 rounded-2xl border border-gray-250/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                <Calendar size={16} className="text-brand-500" />
                <span>Schedule Distribution Release Date</span>
              </div>
              <input
                type="checkbox"
                checked={isScheduled}
                onChange={(e) => setIsScheduled(e.target.checked)}
                className="w-4 h-4 rounded text-brand-500 border-gray-300 focus:ring-brand-500"
              />
            </div>

            {isScheduled && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="text-[9px] font-bold text-gray-400 uppercase">Publish Release Date & Time</label>
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full glass-input text-sm dark:bg-dark-card"
                  required={isScheduled}
                />
              </div>
            )}
          </div>

          {/* Upload and AI Trigger Button */}
          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full py-3.5 rounded-xl font-bold text-sm gradient-btn flex items-center justify-center space-x-2"
          >
            {uploading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>AI Core Processing...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} className="animate-pulse" />
                <span>Publish File & Generate AI Metadata</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
