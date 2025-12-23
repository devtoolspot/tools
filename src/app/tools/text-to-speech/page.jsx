"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, Settings, Download, Mic } from 'lucide-react';

export default function TextToSpeech() {
    const [text, setText] = useState('Welcome to the advanced text to speech converter. Type anything here, customize the voice settings, and even record the output.');
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [volume, setVolume] = useState(1);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);

    // Media Recorder Refs
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const streamRef = useRef(null);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            if (!selectedVoice && availableVoices.length > 0) {
                // Prefer Google voices or natural ones if available
                const preferred = availableVoices.find(v => v.name.includes('Google') || v.name.includes('Natural')) || availableVoices[0];
                setSelectedVoice(preferred);
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.cancel();
            stopRecording();
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
                preferCurrentTab: true, // Experimental
            });

            // We only care about audio
            if (stream.getAudioTracks().length === 0) {
                alert("No audio track selected. Please check 'Share Audio' when selecting the tab.");
                stream.getTracks().forEach(t => t.stop());
                return false;
            }

            streamRef.current = stream;
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            audioChunksRef.current = [];

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                stream.getTracks().forEach(track => track.stop());
                setIsRecording(false);
            };

            recorder.start();
            setIsRecording(true);
            return true;
        } catch (err) {
            console.error(err);
            alert("Could not start recording. Ensure you deny video permissions if unnecessary or select the correct tab.");
            return false;
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    };

    const speak = async (record = false) => {
        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            setIsSpeaking(true);
            return;
        }

        window.speechSynthesis.cancel();

        if (record) {
            const success = await startRecording();
            if (!success) return;
            // Wait a bit for recorder to be ready
            await new Promise(r => setTimeout(r, 500));
        }

        const utterance = new SpeechSynthesisUtterance(text);
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
            if (record) {
                // Give a small buffer to catch the end
                setTimeout(stopRecording, 500);
            }
        };

        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
        setIsPaused(false);
    };

    const pause = () => {
        window.speechSynthesis.pause();
        setIsPaused(true);
        setIsSpeaking(false);
    };

    const stop = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
        if (isRecording) stopRecording();
    };

    return (
        <div className="max-w-5xl mx-auto px-4 pb-8 pt-40">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Advanced Text to Speech</h1>
                <p className="text-gray-600 dark:text-gray-400">Convert text to speech, customize voice parameters, and download audio.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Input */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex flex-col min-h-[400px]">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="flex-1 w-full p-4 text-lg border-none bg-transparent focus:ring-0 outline-none resize-none leading-relaxed"
                            placeholder="Type something here to read..."
                        />
                        <div className="flex justify-between items-center text-sm text-gray-400 px-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <span>{text.length} characters</span>
                            <span>{Math.round(text.split(/\s+/).length / (130 * rate))} min read</span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <h3 className="font-semibold mb-6 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-gray-500" />
                            Voice Settings
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Voice</label>
                                <select
                                    value={selectedVoice?.name || ''}
                                    onChange={(e) => {
                                        const voice = voices.find(v => v.name === e.target.value);
                                        setSelectedVoice(voice);
                                    }}
                                    className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm"
                                >
                                    {voices.map((voice) => (
                                        <option key={voice.name} value={voice.name}>
                                            {voice.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Speed</label>
                                    <span className="text-xs text-gray-500">{rate}x</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={rate}
                                    onChange={(e) => setRate(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pitch</label>
                                    <span className="text-xs text-gray-500">{pitch}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={pitch}
                                    onChange={(e) => setPitch(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Volume</label>
                                    <span className="text-xs text-gray-500">{Math.round(volume * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-3">
                        {!isSpeaking && !isPaused ? (
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => speak(false)}
                                    className="col-span-1 flex items-center justify-center gap-2 px-3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium shadow-lg shadow-blue-500/20"
                                >
                                    <Play className="w-4 h-4" /> Speak
                                </button>
                                <button
                                    onClick={() => speak(true)}
                                    className="col-span-1 flex items-center justify-center gap-2 px-3 py-3 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl transition-colors font-medium text-sm"
                                    title="Record System Audio"
                                >
                                    <Mic className="w-4 h-4" /> & Record
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                {isPaused ? (
                                    <button
                                        onClick={() => speak(false)} // Resume
                                        className="col-span-1 flex items-center justify-center gap-2 px-3 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors font-medium"
                                    >
                                        <Play className="w-4 h-4" /> Resume
                                    </button>
                                ) : (
                                    <button
                                        onClick={pause}
                                        className="col-span-1 flex items-center justify-center gap-2 px-3 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors font-medium"
                                    >
                                        <Pause className="w-4 h-4" /> Pause
                                    </button>
                                )}
                                <button
                                    onClick={stop}
                                    className="col-span-1 flex items-center justify-center gap-2 px-3 py-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-colors font-medium"
                                >
                                    <Square className="w-4 h-4 fill-current" /> Stop
                                </button>
                            </div>
                        )}

                        {audioUrl && (
                            <a
                                href={audioUrl}
                                download="speech-audio.webm"
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors font-medium mt-2 animate-in fade-in"
                            >
                                <Download className="w-5 h-5" /> Download Recording
                            </a>
                        )}

                        <div className="text-xs text-gray-400 text-center px-4">
                            To download, click "Speak & Record" and select this tab in "Share Audio" mode.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
