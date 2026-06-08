import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Custom hook to trigger Web Speech API recognition and synthesis
export const useVoiceAssistant = (callbacks = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [assistantResponse, setAssistantResponse] = useState('');
  
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  // Web Speech Synthesis (Text to Speech) helper
  const speakText = useCallback((text) => {
    if ('speechSynthesis' in window) {
      // Cancel active speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      setAssistantResponse(text);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Set up Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    rec.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        speakText('Microphone access denied. Please allow microphone permissions.');
      }
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.onresult = async (event) => {
      const resultText = event.results[0][0].transcript;
      setTranscript(resultText);
      setIsListening(false);
      await processVoiceCommand(resultText);
    };

    recognitionRef.current = rec;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [speakText]);

  // Log voice command metrics to backend
  const logCommand = async (rawTranscript, intent, isSuccess, errorDetail = '') => {
    try {
      await axios.post('/api/voice/log', {
        rawTranscript,
        detectedIntent: intent,
        recognizedEntities: {},
        isSuccess,
        errorDetail
      });
    } catch (e) {
      console.warn('Logging voice command to DB failed:', e.message);
    }
  };

  // Main NLP command processing router
  const processVoiceCommand = async (text) => {
    const cleanText = text.toLowerCase().trim();
    console.log('Voice Command Received:', cleanText);

    // 1. Navigation intents
    if (cleanText.includes('open dashboard') || cleanText.includes('show dashboard') || cleanText.includes('go to dashboard')) {
      speakText('Opening your dashboard');
      navigate('/dashboard');
      await logCommand(text, 'navigation_dashboard', true);
      return;
    }

    if (cleanText.includes('upload media') || cleanText.includes('add media') || cleanText.includes('upload file') || cleanText.includes('new upload')) {
      speakText('Navigating to the media upload zone');
      navigate('/upload');
      await logCommand(text, 'navigation_upload', true);
      return;
    }

    if (cleanText.includes('search media') || cleanText.includes('search content') || cleanText.includes('find file') || cleanText.includes('open search')) {
      speakText('Opening search console');
      navigate('/search');
      await logCommand(text, 'navigation_search', true);
      return;
    }

    if (cleanText.includes('recent uploads') || cleanText.includes('show recent') || cleanText.includes('open library') || cleanText.includes('show library')) {
      speakText('Opening your media library');
      navigate('/library');
      await logCommand(text, 'navigation_library', true);
      return;
    }

    if (cleanText.includes('open profile') || cleanText.includes('show profile') || cleanText.includes('my profile')) {
      speakText('Opening your profile credentials');
      navigate('/profile');
      await logCommand(text, 'navigation_profile', true);
      return;
    }

    if (cleanText.includes('open settings') || cleanText.includes('show settings')) {
      speakText('Opening account settings');
      navigate('/settings');
      await logCommand(text, 'navigation_settings', true);
      return;
    }

    if (cleanText.includes('open analytics') || cleanText.includes('show analytics') || cleanText.includes('view charts')) {
      speakText('Opening system analytics');
      navigate('/dashboard'); // analytics graphs are nested inside dashboard
      await logCommand(text, 'navigation_analytics', true);
      return;
    }

    if (cleanText.includes('notifications') || cleanText.includes('show alert') || cleanText.includes('open notification')) {
      speakText('Showing notifications history');
      navigate('/notifications');
      await logCommand(text, 'navigation_notifications', true);
      return;
    }

    // 2. Interactive action callbacks
    if (cleanText.includes('delete media') || cleanText.includes('delete file') || cleanText.includes('remove item')) {
      if (callbacks.onDeleteMedia) {
        speakText('Deleting the selected media item');
        callbacks.onDeleteMedia();
        await logCommand(text, 'action_delete', true);
      } else {
        speakText('I cannot delete files from this page. Please select a file first.');
        await logCommand(text, 'action_delete', false, 'Callback unavailable');
      }
      return;
    }

    if (cleanText.includes('play media') || cleanText.includes('play song') || cleanText.includes('play video') || cleanText.includes('resume play')) {
      if (callbacks.onPlayMedia) {
        speakText('Playing content');
        callbacks.onPlayMedia();
        await logCommand(text, 'action_play', true);
      } else {
        speakText('No active video or audio selected to play.');
        await logCommand(text, 'action_play', false, 'Callback unavailable');
      }
      return;
    }

    if (cleanText.includes('generate report') || cleanText.includes('download log') || cleanText.includes('get metrics')) {
      if (callbacks.onGenerateReport) {
        speakText('Generating system analytics report');
        callbacks.onGenerateReport();
        await logCommand(text, 'action_report', true);
      } else {
        speakText('Reports can only be generated from the admin logs dashboard.');
        await logCommand(text, 'action_report', false, 'Callback unavailable');
      }
      return;
    }

    // 3. Search action fallback
    if (cleanText.startsWith('search for') || cleanText.startsWith('find')) {
      let searchQuery = cleanText.replace('search for', '').replace('find', '').trim();
      if (searchQuery) {
        speakText(`Searching library items for ${searchQuery}`);
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        await logCommand(text, 'action_voice_search', true);
        return;
      }
    }

    // 4. Default fallback: perform search for the exact spoken terms
    speakText(`Searching for spoken text: ${text}`);
    navigate(`/search?q=${encodeURIComponent(cleanText)}`);
    await logCommand(text, 'fallback_search', true);
  };

  // Toggle listening mic state
  const startListening = () => {
    if (!isSupported) return;
    try {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    } catch (e) {
      console.warn('Recognition start exception:', e.message);
    }
  };

  return {
    isListening,
    transcript,
    isSupported,
    assistantResponse,
    startListening,
    speakText
  };
};

export default useVoiceAssistant;
