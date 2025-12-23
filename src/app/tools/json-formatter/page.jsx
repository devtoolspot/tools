"use client";

import React, { useState } from 'react';
import { Braces, Copy, Check, Minimize, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

export default function JsonFormatter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const formatJson = () => {
        setError(null);
        if (!input.trim()) return;
        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed, null, 2));
        } catch (err) {
            setError(err.message);
            setOutput('');
        }
    };

    const minifyJson = () => {
        setError(null);
        if (!input.trim()) return;
        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed));
        } catch (err) {
            setError(err.message);
            setOutput('');
        }
    };

    const copyOutput = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 pb-8 pt-40">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">JSON Formatter & Validator</h1>
                <p className="text-gray-600 dark:text-gray-400">Beautify, minify, and validate your JSON data.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 h-[600px]">
                {/* Input */}
                <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Input JSON</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setInput('')}
                                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                title="Clear"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 w-full p-4 font-mono text-xs sm:text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-950/50 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        placeholder='Paste your JSON here like {"key": "value"}...'
                    />
                </div>

                {/* Output */}
                <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Output</label>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={formatJson}
                                disabled={!input}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                            >
                                <Braces className="w-3 h-3" /> Format
                            </button>
                            <button
                                onClick={minifyJson}
                                disabled={!input}
                                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                            >
                                <Minimize className="w-3 h-3" /> Minify
                            </button>
                            <button
                                onClick={copyOutput}
                                disabled={!output}
                                className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                            >
                                {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    <div className="relative flex-1">
                        {error ? (
                            <div className="absolute inset-0 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 font-mono text-sm overflow-auto">
                                <div className="flex items-center gap-2 mb-2 font-bold">
                                    <AlertCircle className="w-4 h-4" />
                                    Invalid JSON
                                </div>
                                {error}
                            </div>
                        ) : (
                            <textarea
                                readOnly
                                value={output}
                                className={`w-full h-full p-4 font-mono text-xs sm:text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-950/50 focus:ring-0 outline-none resize-none ${output ? 'text-green-600 dark:text-green-400' : ''}`}
                                placeholder="Result will appear here..."
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
