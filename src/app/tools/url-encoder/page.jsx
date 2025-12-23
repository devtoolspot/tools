"use client";

import React, { useState } from 'react';
import { Link2, ArrowDown, Copy, Check } from 'lucide-react';

export default function UrlEncoder() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState('encode'); // encode | decode
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);

    const process = () => {
        setError(null);
        try {
            if (mode === 'encode') {
                setOutput(encodeURIComponent(input));
            } else {
                setOutput(decodeURIComponent(input));
            }
        } catch (err) {
            setError('Invalid input for decoding.');
            setOutput('');
        }
    };

    const copy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 pb-8 pt-40">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">URL Encoder / Decoder</h1>
                <p className="text-gray-600 dark:text-gray-400">Encode text to URL-safe format or decode URLs.</p>
            </div>

            <div className="grid gap-6">
                {/* Input */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Input</label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full h-40 p-4 font-mono text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-950/50 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        placeholder={mode === 'encode' ? 'Paste text to encode...' : 'Paste URL to decode...'}
                    />
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center gap-4">
                    <div className="bg-white dark:bg-gray-900 p-1 rounded-lg inline-flex border border-gray-200 dark:border-gray-700 shadow-sm">
                        <button
                            onClick={() => setMode('encode')}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${mode === 'encode'
                                ? 'bg-blue-600 text-white shadow'
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            Encode
                        </button>
                        <button
                            onClick={() => setMode('decode')}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${mode === 'decode'
                                ? 'bg-blue-600 text-white shadow'
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            Decode
                        </button>
                    </div>

                    <button
                        onClick={process}
                        className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                    >
                        <ArrowDown className="w-6 h-6" />
                    </button>
                </div>

                {/* Output */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 relative">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Result</label>
                        <button
                            onClick={copy}
                            disabled={!output}
                            className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        >
                            {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>

                    {error ? (
                        <div className="w-full h-40 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 flex items-center justify-center">
                            {error}
                        </div>
                    ) : (
                        <textarea
                            readOnly
                            value={output}
                            className="w-full h-40 p-4 font-mono text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-950/50 focus:ring-0 outline-none resize-none"
                            placeholder="Output will appear here..."
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
