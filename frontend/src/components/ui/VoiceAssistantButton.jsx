import React, { useState } from 'react';
import { Mic, MicOff, Volume2, HelpCircle, X } from 'lucide-react';
import useVoiceAssistant from '../../hooks/useVoiceAssistant';

export const VoiceAssistantButton = ({ onDeleteMedia, onPlayMedia, onGenerateReport }) => {
  const {
    isListening,
    transcript,
    isSupported,
    assistantResponse,
    startListening
  } = useVoiceAssistant({ onDeleteMedia, onPlayMedia, onGenerateReport });

  const [showConsole, setShowConsole] = useState(false);

  if (!isSupported) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
      {/* Voice Assistant Speech Transcript Console */}
      {(showConsole || isListening || transcript || assistantResponse) && (
        <div className="w-80 rounded-2xl glass-card p-4 shadow-2xl border border-brand-500/25 animate-fadeIn">
          <div className="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🎙️</span>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Voice Assistant Console</span>
            </div>
            <button
              onClick={() => setShowConsole(false)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </div>

          {/* Transcript spoken */}
          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">What I Heard:</p>
              <p className="text-xs italic text-gray-800 dark:text-gray-200 mt-0.5">
                {transcript ? `"${transcript}"` : isListening ? 'Listening...' : 'Awaiting voice command...'}
              </p>
            </div>

            {/* Response spoken */}
            {assistantResponse && (
              <div className="bg-brand-500/10 dark:bg-brand-500/20 rounded-lg p-2.5 flex items-start space-x-2 border border-brand-500/15">
                <Volume2 size={16} className="text-brand-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-brand-500">Aura AI:</p>
                  <p className="text-xs text-gray-800 dark:text-gray-200 mt-0.5">{assistantResponse}</p>
                </div>
              </div>
            )}

            {/* Help guidelines */}
            <div className="bg-gray-50 dark:bg-dark-bg/60 rounded-lg p-2.5">
              <div className="flex items-center space-x-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">
                <HelpCircle size={10} />
                <span>Supported Prompts</span>
              </div>
              <ul className="text-[10px] text-gray-500 dark:text-gray-400 list-disc list-inside space-y-0.5">
                <li>"Open dashboard" / "Open library"</li>
                <li>"Upload media" / "Search media"</li>
                <li>"Play media" / "Delete media"</li>
                <li>"Generate report"</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Mic Button and Animation Waves */}
      <div className="flex items-center space-x-3">
        {isListening && (
          <div className="flex items-end space-x-1 bg-brand-500/10 dark:bg-brand-500/20 px-3 py-2.5 rounded-full border border-brand-500/20 h-10">
            <span className="sound-bar h-5 animate-wave-grow" />
            <span className="sound-bar h-7 animate-wave-grow" style={{ animationDelay: '0.1s' }} />
            <span className="sound-bar h-4 animate-wave-grow" style={{ animationDelay: '0.2s' }} />
            <span className="sound-bar h-8 animate-wave-grow" style={{ animationDelay: '0.3s' }} />
            <span className="sound-bar h-5 animate-wave-grow" style={{ animationDelay: '0.4s' }} />
          </div>
        )}

        <button
          onClick={() => {
            setShowConsole(true);
            startListening();
          }}
          className={`p-4 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : 'bg-brand-600 hover:bg-brand-500 text-white'
          }`}
          title={isListening ? 'Stop Listening' : 'Talk to Aura Assistant'}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
      </div>
    </div>
  );
};

export default VoiceAssistantButton;
