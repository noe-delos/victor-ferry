/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CameraOff,
  Mic,
  MicOff,
  Play,
  Square,
  Pause,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

interface DeclarationRecorderProps {
  onTranscriptionComplete: (transcript: string) => void;
  onBack: () => void;
}

export function DeclarationRecorder({
  onTranscriptionComplete,
  onBack,
}: DeclarationRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timerStartRef = useRef(0);
  const timerPausedAtRef = useRef(0);
  const audioVisualizationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState("00:00:00");
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [hasRecordingEnded, setHasRecordingEnded] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [fileCreationLoading, setFileCreationLoading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    initializeMedia();

    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    if (audioVisualizationIntervalRef.current) {
      clearInterval(audioVisualizationIntervalRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setIsInitializing(false);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setCameraEnabled(false);
      setIsInitializing(false);
      toast.error("Impossible d'accéder à la caméra ou au microphone");
    }
  };

  const setupAudioAnalysis = (stream: MediaStream) => {
    const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();

    analyserRef.current.fftSize = 32;
    analyserRef.current.smoothingTimeConstant = 0.3;
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);
  };

  const startRecording = async () => {
    if (!streamRef.current) {
      toast.error("Aucun flux audio disponible");
      return;
    }

    try {
      audioChunksRef.current = [];
      setRecordedBlob(null);
      setHasRecordingEnded(false);

      setupAudioAnalysis(streamRef.current);
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setFileCreationLoading(true);
        setTimeout(() => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          setRecordedBlob(audioBlob);
          setHasRecordingEnded(true);
          setFileCreationLoading(false);
        }, 500);

        if (audioVisualizationIntervalRef.current) {
          clearInterval(audioVisualizationIntervalRef.current);
          audioVisualizationIntervalRef.current = null;
        }

        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }

        analyserRef.current = null;
      };

      mediaRecorder.start(10);
      setIsRecording(true);
      setIsPaused(false);

      timerStartRef.current = Date.now();
      startTimer();
      toast.success("Enregistrement démarré");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Impossible de démarrer l'enregistrement");
    }
  };

  const pauseRecording = () => {
    if (
      !mediaRecorderRef.current ||
      mediaRecorderRef.current.state !== "recording"
    )
      return;

    mediaRecorderRef.current.pause();
    setIsPaused(true);

    timerPausedAtRef.current = Date.now() - timerStartRef.current;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const resumeRecording = () => {
    if (
      !mediaRecorderRef.current ||
      mediaRecorderRef.current.state !== "paused"
    )
      return;

    mediaRecorderRef.current.resume();
    setIsPaused(false);

    timerStartRef.current = Date.now() - timerPausedAtRef.current;
    startTimer();
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current = null;

    setIsRecording(false);
    setIsPaused(false);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    toast.success("Enregistrement terminé");
  };

  const startTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    timerIntervalRef.current = setInterval(() => {
      const elapsedTime = Date.now() - timerStartRef.current;

      const hours = Math.floor(elapsedTime / 3600000);
      const minutes = Math.floor((elapsedTime % 3600000) / 60000);
      const seconds = Math.floor((elapsedTime % 60000) / 1000);

      const formattedTime = [
        hours < 10 ? "0" + hours : hours,
        minutes < 10 ? "0" + minutes : minutes,
        seconds < 10 ? "0" + seconds : seconds,
      ].join(":");

      setTimer(formattedTime);
    }, 1000);
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    try {
      console.log("🎙️ Starting transcription process...");
      console.log("Audio blob size:", audioBlob.size, "bytes");
      console.log("Audio blob type:", audioBlob.type);

      setIsTranscribing(true);
      toast.loading("Transcription en cours...", { duration: 10000 });

      const formData = new FormData();
      formData.append("audio", audioBlob, "declaration.webm");

      console.log("📤 Sending transcription request to /api/transcribe-audio");

      const response = await fetch("/api/transcribe-audio", {
        method: "POST",
        body: formData,
      });

      console.log("📥 Transcription response status:", response.status);
      console.log(
        "📥 Transcription response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        console.error(
          "❌ Transcription request failed with status:",
          response.status
        );
        const errorText = await response.text();
        console.error("❌ Error response text:", errorText);
        throw new Error("Transcription failed");
      }

      const data = await response.json();
      console.log("✅ Transcription response data:", data);

      toast.dismiss();

      const transcript = data.transcript || "";
      console.log("📝 Extracted transcript:", transcript);
      console.log("📝 Transcript length:", transcript.length, "characters");

      if (transcript) {
        toast.success("Transcription terminée!");
        console.log("✅ Transcription successful, returning transcript");
      } else {
        console.warn("⚠️ Transcription succeeded but transcript is empty");
        toast.warning("Transcription réussie mais vide");
      }

      return transcript;
    } catch (error) {
      console.error("💥 Transcription error:", error);
      toast.dismiss();
      toast.error("Erreur lors de la transcription");
      return "";
    } finally {
      setIsTranscribing(false);
      console.log("🏁 Transcription process completed");
    }
  };

  const handleDeclarationComplete = async () => {
    console.log("🚀 handleDeclarationComplete called");

    if (!recordedBlob) {
      console.error("❌ No recorded blob available");
      toast.error("Aucun enregistrement disponible");
      return;
    }

    console.log("📱 Recorded blob available, starting transcription...");
    const transcript = await transcribeAudio(recordedBlob);

    console.log("📋 Transcription result:", transcript);
    console.log("📋 Transcript length:", transcript.length);

    if (transcript) {
      console.log("✅ Calling onTranscriptionComplete with transcript");
      // Show success message and automatically transition
      toast.success("Déclaration transcrite ! Passons aux questions...", {
        duration: 3000,
      });

      // Wait a moment for user to see the success message, then transition
      setTimeout(() => {
        onTranscriptionComplete(transcript);
      }, 1500);
    } else {
      console.warn("⚠️ Empty transcript, not calling onTranscriptionComplete");
      toast.error("Transcription vide - veuillez réessayer");
    }
  };

  const toggleCamera = () => {
    if (cameraEnabled && videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach((track) => track.stop());
    } else if (!cameraEnabled) {
      initializeMedia();
    }
    setCameraEnabled(!cameraEnabled);
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !micEnabled;
      });
    }
    setMicEnabled(!micEnabled);
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleTogglePause = () => {
    if (isPaused) {
      resumeRecording();
    } else {
      pauseRecording();
    }
  };

  return (
    <div className="flex flex-col justify-between h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-blue-200 backdrop-blur-sm bg-white/80 shadow-sm">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          disabled={isRecording}
          className="rounded-full hover:bg-blue-50 border-blue-200 text-blue-600 h-10 w-10"
        >
          <Icon
            icon="material-symbols:arrow-back-rounded"
            className="h-4 w-4"
          />
        </Button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Icon
              icon="material-symbols:mic-rounded"
              className="h-6 w-6 text-blue-600"
            />
            <h1 className="text-xl font-bold victor-gradient-text">
              Formation Prise de Parole
            </h1>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full ml-2">
              Phase 1/2
            </span>
          </div>
          <p className="text-xs text-gray-600">
            Victor Ferry • Coach Rhétorique
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right text-xs">
            <div className="font-mono text-blue-600 font-semibold">{timer}</div>
            <div className="text-gray-500">15:00</div>
          </div>
        </div>
      </div>

      {/* Main Content - Centered Video */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="relative flex flex-col items-center">
          {/* User Video */}
          <Card className="overflow-hidden h-[400px] w-[600px] victor-card border-blue-200 shadow-xl rounded-3xl mb-8">
            <div className="h-full w-full relative rounded-3xl overflow-hidden">
              {cameraEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover transform scale-x-[-1] rounded-3xl"
                  style={{ objectPosition: "center 20%" }}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                  <div className="text-center">
                    <CameraOff className="h-10 w-10 mx-auto mb-3 text-blue-400" />
                    <p className="text-blue-600 text-sm">Caméra désactivée</p>
                  </div>
                </div>
              )}

              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm rounded-full px-3 py-2 flex items-center border border-red-400">
                  <div className="w-3 h-3 bg-red-300 rounded-full animate-pulse mr-2" />
                  <span className="text-white text-sm font-medium">
                    {isPaused ? "PAUSE" : "ENREGISTREMENT"}
                  </span>
                </div>
              )}

              {/* Timer */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 border border-blue-200">
                <span className="text-blue-600 text-sm font-mono font-semibold">
                  {timer}
                </span>
              </div>

              {/* Mic status indicator */}
              <div className="absolute bottom-4 right-4">
                <div
                  className={`p-2 rounded-full ${
                    micEnabled
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {micEnabled ? (
                    <Mic className="h-4 w-4" />
                  ) : (
                    <MicOff className="h-4 w-4" />
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-4 border-t border-blue-200 backdrop-blur-sm bg-white/80">
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleCamera}
            className="rounded-full h-12 w-12 shadow-lg bg-white border-blue-200 hover:bg-blue-50 text-blue-600 hover:text-blue-700"
          >
            {cameraEnabled ? (
              <Icon icon="material-symbols:camera-rounded" className="size-4" />
            ) : (
              <Icon
                icon="material-symbols:camera-off-rounded"
                className="size-4"
              />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleMic}
            className={`rounded-full h-12 w-12 shadow-lg ${
              micEnabled
                ? "bg-white border-blue-200 hover:bg-blue-50 text-blue-600 hover:text-blue-700"
                : "bg-red-50 border-red-200 hover:bg-red-100 text-red-600 hover:text-red-700"
            }`}
          >
            {micEnabled ? (
              <Mic className="size-4" />
            ) : (
              <MicOff className="size-4" />
            )}
          </Button>

          {/* Main recording controls */}
          {!hasRecordingEnded ? (
            <>
              {isRecording && (
                <Button
                  onClick={handleTogglePause}
                  className="rounded-full h-14 w-14 shadow-lg victor-gradient hover:bg-blue-700 text-white"
                  size="icon"
                >
                  {isPaused ? (
                    <Play className="h-5 w-5" />
                  ) : (
                    <Pause className="h-5 w-5" />
                  )}
                </Button>
              )}

              <Button
                onClick={handleToggleRecording}
                className={`rounded-full h-16 w-16 shadow-lg transition-colors duration-300 ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "victor-gradient hover:bg-blue-700 text-white"
                }`}
                size="icon"
                disabled={!micEnabled || fileCreationLoading}
              >
                {fileCreationLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
                ) : isRecording ? (
                  <Square className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
            </>
          ) : recordedBlob ? (
            <Button
              onClick={handleDeclarationComplete}
              disabled={isTranscribing}
              className="rounded-full h-16 w-16 shadow-lg bg-green-600 hover:bg-green-700 text-white"
            >
              {isTranscribing ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <Check className="h-5 w-5" />
              )}
            </Button>
          ) : null}
        </div>

        <div className="text-center text-xs text-gray-600 mt-2">
          <p>
            {isRecording
              ? isPaused
                ? "Enregistrement en pause"
                : "Enregistrement en cours..."
              : recordedBlob
              ? "Présentation prête à transcrire"
              : "Prêt à enregistrer votre présentation"}
          </p>
        </div>
      </div>
    </div>
  );
}
