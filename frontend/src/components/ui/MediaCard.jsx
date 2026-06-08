import React, { useState } from 'react';
import { 
  FileText, Image as ImageIcon, Video as VideoIcon, Music, 
  Download, Trash2, Share2, Eye, Calendar, Sparkles, ChevronDown, ChevronUp, Copy, Check
} from 'lucide-react';
import axios from 'axios';

export const MediaCard = ({ item, onUpdate, onDelete, currentUser }) => {
  const [isOpenAI, setIsOpenAI] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  // Check delete privilege
  const canModify = 
    currentUser && 
    (currentUser.role === 'admin' || item.owner?._id === currentUser._id || item.owner === currentUser._id);

  // Get corresponding File Icon
  const getIcon = () => {
    switch (item.mediaType) {
      case 'image': return <ImageIcon className="text-pink-500" size={18} />;
      case 'video': return <VideoIcon className="text-purple-500" size={18} />;
      case 'audio': return <Music className="text-cyan-500" size={18} />;
      default: return <FileText className="text-yellow-500" size={18} />;
    }
  };

  // Trigger downloading
  const handleDownload = () => {
    window.open(`/api/media/${item._id}/download`, '_blank');
    if (onUpdate) onUpdate();
  };

  // Generate sharing token url
  const handleShare = async () => {
    try {
      setSharing(true);
      const response = await axios.post(`/api/media/${item._id}/share`, { hours: 24 });
      if (response.data.success) {
        const fullLink = `${window.location.origin}${response.data.shareUrl}`;
        setShareLink(fullLink);
      }
    } catch (e) {
      console.error('Error generating share link:', e.message);
    } finally {
      setSharing(false);
    }
  };

  // Copy sharing link text
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format file size helper
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full border border-gray-200/40 dark:border-gray-800/40">
      {/* File Preview Display Area */}
      <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center overflow-hidden">
        {item.mediaType === 'image' && (
          <img
            src={item.fileUrl}
            alt={item.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        )}
        
        {item.mediaType === 'video' && (
          <video
            src={item.fileUrl}
            controls
            className="w-full h-full object-contain"
            poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60"
          />
        )}

        {item.mediaType === 'audio' && (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#16223f] to-[#0f172a] space-y-3">
            <div className="p-3 bg-brand-500/20 rounded-full text-brand-400 animate-pulse">
              <Music size={32} />
            </div>
            <audio src={item.fileUrl} controls className="w-4/5 h-8 scale-90" />
          </div>
        )}

        {item.mediaType === 'document' && (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-950/40 space-y-2">
            <FileText size={42} className="text-amber-500" />
            <a 
              href={item.fileUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="text-xs font-semibold text-brand-500 hover:underline"
            >
              Open Resource Document
            </a>
          </div>
        )}

        {/* Media type badge */}
        <span className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider flex items-center space-x-1">
          {getIcon()}
          <span>{item.mediaType}</span>
        </span>

        {/* Scheduled Status Overlay */}
        {item.status === 'draft' && item.isScheduled && (
          <span className="absolute top-3 right-3 bg-amber-500/95 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1 animate-pulse">
            <Calendar size={10} />
            <span>Scheduled</span>
          </span>
        )}
      </div>

      {/* Main Metadata Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-base text-gray-800 dark:text-gray-200 line-clamp-1" title={item.title}>
              {item.title}
            </h3>
            <span className="text-[10px] font-medium bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-500">
              {formatBytes(item.fileSize)}
            </span>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {item.description || 'No description provided.'}
          </p>

          {/* Tag Chips */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {item.tags.slice(0, 4).map((tag, idx) => (
                <span 
                  key={idx} 
                  className="text-[9px] font-semibold bg-brand-500/10 text-brand-500 dark:bg-brand-500/20 px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Details */}
        <div className="mt-4 border-t border-gray-100 dark:border-gray-800/80 pt-3 flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center space-x-1.5">
            <span>By:</span>
            <span className="font-semibold text-gray-600 dark:text-gray-300">
              {item.owner?.username || 'System'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-0.5">
              <Eye size={12} />
              <span>{item.viewsCount}</span>
            </span>
            <span className="flex items-center space-x-0.5">
              <Download size={12} />
              <span>{item.downloadsCount}</span>
            </span>
          </div>
        </div>
      </div>

      {/* AI Metadata Dropdown Toggle */}
      <div className="border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={() => setIsOpenAI(!isOpenAI)}
          className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-[#121824]/50 flex items-center justify-between text-xs font-semibold text-brand-500 hover:bg-gray-100 dark:hover:bg-gray-850/30 transition-all"
        >
          <span className="flex items-center space-x-1.5">
            <Sparkles size={14} className="text-brand-500 shrink-0" />
            <span>AI Processing Details</span>
          </span>
          {isOpenAI ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {isOpenAI && (
          <div className="p-4 bg-gray-50/30 dark:bg-[#121824]/30 border-t border-gray-100 dark:border-gray-800 text-xs space-y-3 animate-fadeIn">
            {/* AI Summary */}
            <div>
              <p className="font-bold text-gray-500 dark:text-gray-400">AI Summary:</p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-0.5">
                {item.aiSummary || 'Analysis is running in the background...'}
              </p>
            </div>

            {/* AI Keywords */}
            {item.aiKeywords && item.aiKeywords.length > 0 && (
              <div>
                <p className="font-bold text-gray-500 dark:text-gray-400">AI Generated Keywords:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.aiKeywords.map((kw, idx) => (
                    <span key={idx} className="text-[10px] bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 px-2 py-0.5 rounded">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AI Transcript */}
            {item.aiTranscript && (
              <div>
                <p className="font-bold text-gray-500 dark:text-gray-400">AI Speech Transcript:</p>
                <p className="text-gray-600 dark:text-gray-300 italic max-h-24 overflow-y-auto leading-relaxed border-l-2 border-brand-500/50 pl-2 mt-1">
                  "{item.aiTranscript}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action panel */}
      <div className="bg-gray-100/50 dark:bg-slate-900/40 p-3 flex items-center justify-between border-t border-gray-200/40 dark:border-gray-800/40 text-gray-500">
        <div className="flex items-center space-x-1.5">
          {/* Share button */}
          <button
            onClick={handleShare}
            disabled={sharing}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-brand-500 transition-colors"
            title="Generate Share Link"
          >
            <Share2 size={16} />
          </button>
          
          {/* Download button */}
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-indigo-500 transition-colors"
            title="Download Media File"
          >
            <Download size={16} />
          </button>
        </div>

        {/* Delete option */}
        {canModify && (
          <button
            onClick={() => onDelete(item._id)}
            className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors"
            title="Delete File"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Shared URL overlay notification */}
      {shareLink && (
        <div className="p-3 bg-brand-500/10 dark:bg-brand-950/20 text-xs border-t border-brand-500/20 animate-fadeIn">
          <p className="text-[10px] font-bold text-brand-500 uppercase">Share URL (expires in 24h):</p>
          <div className="flex items-center justify-between bg-white dark:bg-[#161e2f] border border-brand-500/25 p-1.5 rounded-lg mt-1 gap-2">
            <span className="truncate text-gray-600 dark:text-gray-300 font-mono text-[10px]">{shareLink}</span>
            <button
              onClick={copyToClipboard}
              className="p-1 text-brand-500 hover:bg-brand-500/10 rounded shrink-0"
              title="Copy link"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaCard;
