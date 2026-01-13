import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faStop, faPlay, faPause, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { convertToWav } from "./audioUtils";
import "./AudioRecorder.css";

const AudioRecorder = ({ onAudioReady }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 22050,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      // Try to use audio/webm;codecs=opus or fallback to default
      let options = { mimeType: 'audio/webm;codecs=opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'audio/webm' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: 'audio/ogg;codecs=opus' };
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options = {};
          }
        }
      }
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setAudioBlob(audioBlob);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  const deleteRecording = () => {
    if (audioURL) URL.revokeObjectURL(audioURL);
    setAudioURL(null);
    setAudioBlob(null);
    setRecordingTime(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleUpload = async () => {
    if (audioBlob) {
      setIsConverting(true);
      try {
        // Convert to WAV format for backend compatibility
        const wavBlob = await convertToWav(audioBlob);
        const file = new File([wavBlob], `recording-${Date.now()}.wav`, { type: "audio/wav" });
        onAudioReady(file);
      } catch (error) {
        console.error("Error converting audio:", error);
        alert("Failed to process audio. Please try recording again.");
      } finally {
        setIsConverting(false);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="audio-recorder">
      <div className="recorder-container">
        {!audioURL ? (
          <>
            <div className="recording-controls">
              {!isRecording ? (
                <button 
                  className="record-btn start-btn" 
                  onClick={startRecording}
                  title="Start Recording"
                >
                  <FontAwesomeIcon icon={faMicrophone} />
                  <span>Start Recording</span>
                </button>
              ) : (
                <div className="recording-active">
                  <button 
                    className="record-btn pause-btn" 
                    onClick={pauseRecording}
                    title={isPaused ? "Resume" : "Pause"}
                  >
                    <FontAwesomeIcon icon={isPaused ? faPlay : faPause} />
                  </button>
                  <button 
                    className="record-btn stop-btn" 
                    onClick={stopRecording}
                    title="Stop Recording"
                  >
                    <FontAwesomeIcon icon={faStop} />
                  </button>
                </div>
              )}
            </div>
            
            {isRecording && (
              <div className="recording-indicator">
                <div className={`recording-dot ${isPaused ? "paused" : ""}`}></div>
                <span className="recording-time">{formatTime(recordingTime)}</span>
                <span className="recording-status">
                  {isPaused ? "Paused" : "Recording..."}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="playback-controls">
            <audio 
              ref={audioRef} 
              src={audioURL} 
              onEnded={handleAudioEnded}
            />
            
            <div className="playback-info">
              <FontAwesomeIcon icon={faMicrophone} className="playback-icon" />
              <span className="playback-duration">{formatTime(recordingTime)}</span>
            </div>

            <div className="playback-buttons">
              <button 
                className="playback-btn play-btn" 
                onClick={togglePlayback}
                title={isPlaying ? "Pause" : "Play"}
              >
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
              </button>
              
              <button 
                className="playback-btn delete-btn" 
                onClick={deleteRecording}
                title="Delete Recording"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
              
              <button 
                className="playback-btn upload-btn" 
                onClick={handleUpload}
                disabled={isConverting}
                title="Use This Recording"
              >
                {isConverting ? (
                  <>
                    <span className="loader-small"></span>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUpload} />
                    <span>Use Recording</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
