"use client";

import React, { useState } from 'react';
import { Binary, Copy, Check, ArrowRightLeft, Image as ImageIcon, FileText, Upload, Download, Settings } from 'lucide-react';

export default function Base64Converter() {
    const [mode, setMode] = useState('encode'); // encode | decode
    const [type, setType] = useState('text'); // text | image | file
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState('');

    const [options, setOptions] = useState({
        urlSafe: false,
        includeDataUri: true, // for image/file
    });

    const handleTextProcess = (text) => {
        try {
            setError(null);
            if (!text) {
                setOutput('');
                return;
            }

            if (mode === 'encode') {
                let result = btoa(text);
                if (options.urlSafe) {
                    result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
                }
                setOutput(result);
            } else {
                let cleanInput = text;
                if (options.urlSafe) {
                    cleanInput = cleanInput.replace(/-/g, '+').replace(/_/g, '/');
                    while (cleanInput.length % 4) {
                        cleanInput += '=';
                    }
                }
                setOutput(atob(cleanInput));
            }
        } catch (err) {
            setError('Invalid Base64 input');
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);
        setFileType(file.type);

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target.result;
            if (mode === 'encode') {
                setOutput(options.includeDataUri ? result : result.split(',')[1]);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleBase64FileDecode = () => {
        // For file decoding, we usually prepare a download link or preview
        // This is handled in the UI rendering part
    };

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadFile = () => {
        try {
            const link = document.createElement('a');
            let content = input;

            // If input doesn't have data URI scheme but we need to download, 
            // we might need to know the mime type or assume it.
            // For this simple version, we assume the user pastes a full Data URI or we construct one if they provide mime type.

            if (!content.startsWith('data:')) {
                // If just base64, try to prepend generic octet-stream if unknown
                content = `data:${fileType || 'application/octet-stream'};base64,${content}`;
            }

            link.href = content;
            link.download = fileName || 'downloaded-file';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            setError('Error downloading file');
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 pb-8 pt-40">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Advanced Base64 Converter</h1>
                <p className="text-gray-600 dark:text-gray-400">Convert text, images, and files to and from Base64.</p>
            </div>

            {/* Main Tools Container */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">

                {/* Type Selection Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-800">
                    {[
                        { id: 'text', label: 'Text', icon: FileText },
                        { id: 'image', label: 'Image', icon: ImageIcon },
                        { id: 'file', label: 'File', icon: Binary },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setType(tab.id); setInput(''); setOutput(''); setError(null); }}
                            className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-all ${type === tab.id
                                ? 'bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* Mode Selection (Encode/Decode) */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex">
                            <button
                                onClick={() => { setMode('encode'); setInput(''); setOutput(''); }}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${mode === 'encode'
                                    ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                Encode
                            </button>
                            <button
                                onClick={() => { setMode('decode'); setInput(''); setOutput(''); }}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${mode === 'decode'
                                    ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                Decode
                            </button>
                        </div>
                    </div>

                    {/* Options Bar */}
                    <div className="flex flex-wrap gap-4 mb-6 text-sm">
                        {type === 'text' && (
                            <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={options.urlSafe}
                                    onChange={(e) => {
                                        setOptions({ ...options, urlSafe: e.target.checked });
                                        handleTextProcess(input); // Re-process immediately
                                    }}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                URL Safe URL Encoding
                            </label>
                        )}
                        {(type === 'image' || type === 'file') && mode === 'encode' && (
                            <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={options.includeDataUri}
                                    onChange={(e) => setOptions({ ...options, includeDataUri: e.target.checked })}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                Include Data URI Scheme (data:image/...)
                            </label>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Input Section */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {mode === 'encode' ? 'Input' : 'Base64 Input'}
                            </label>

                            {type === 'text' ? (
                                <textarea
                                    value={input}
                                    onChange={(e) => { setInput(e.target.value); handleTextProcess(e.target.value); }}
                                    className="w-full h-64 p-4 font-mono text-xs md:text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    placeholder={mode === 'encode' ? 'Type text here...' : 'Paste Base64 string here...'}
                                />
                            ) : mode === 'encode' ? (
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl h-64 flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        accept={type === 'image' ? "image/*" : "*"}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Click to upload {type}
                                        </span>
                                    </label>
                                    {fileName && <p className="mt-2 text-sm text-blue-500">{fileName}</p>}
                                </div>
                            ) : (
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="w-full h-64 p-4 font-mono text-xs md:text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    placeholder="Paste Base64 string here..."
                                />
                            )}
                        </div>

                        {/* Output Section */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center h-5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Output
                                </label>
                                {output && mode === 'encode' && (
                                    <button
                                        onClick={copyOutput}
                                        className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                )}
                            </div>

                            {/* Conditional Rendering for Result */}
                            {type === 'text' ? (
                                <div className="relative">
                                    <textarea
                                        readOnly
                                        value={output}
                                        className="w-full h-64 p-4 font-mono text-xs md:text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                        placeholder="Result will appear here..."
                                    />
                                </div>
                            ) : mode === 'decode' && input ? (
                                <div className="border border-gray-300 dark:border-gray-700 rounded-xl h-64 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center p-4 overflow-hidden relative">
                                    {type === 'image' && (
                                        <img
                                            src={input.startsWith('data:') ? input : `data:image/png;base64,${input}`}
                                            alt="Decoded Preview"
                                            className="max-w-full max-h-full object-contain rounded-lg"
                                            onError={(e) => { e.target.style.display = 'none'; setError('Invalid Image Data'); }}
                                        />
                                    )}
                                    {type === 'file' && (
                                        <div className="text-center">
                                            <Binary className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500 mb-4">Ready to download</p>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="filename.ext"
                                                    className="px-2 py-1 text-sm border rounded bg-white dark:bg-black"
                                                    onChange={(e) => setFileName(e.target.value)}
                                                />
                                                <button onClick={downloadFile} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Download</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <textarea
                                    readOnly
                                    value={output}
                                    className="w-full h-64 p-4 font-mono text-xs md:text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    placeholder={mode === 'encode' ? "Encoded string will appear here..." : "Result will appear here..."}
                                />
                            )}

                            {error && (
                                <div className="absolute bottom-4 right-6 text-xs text-red-500">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
