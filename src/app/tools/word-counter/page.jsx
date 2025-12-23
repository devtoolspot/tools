"use client";

import React, { useState } from 'react';
import { AlignLeft, Copy, Check } from 'lucide-react';

export default function WordCounter() {
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);

    const stats = {
        words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
        chars: text.length,
        charsNoSpace: text.replace(/\s/g, '').length,
        lines: text === '' ? 0 : text.split('\n').length,
        paragraphs: text === '' ? 0 : text.split(/\n\n+/).length,
        readingTime: text.trim() === '' ? 0 : Math.ceil(text.trim().split(/\s+/).length / 200)
    };

    const copyText = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 pb-8 pt-40">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Word Counter</h1>
                <p className="text-gray-600 dark:text-gray-400">Analyze your text count, characters, and reading time.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
                {/* Stats Sidebar */}
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <div className="space-y-6">
                            <div>
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.words}</div>
                                <div className="text-sm font-medium text-gray-500">Words</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.chars}</div>
                                <div className="text-sm font-medium text-gray-500">Characters</div>
                            </div>
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">No Spaces</span>
                                    <span className="font-medium">{stats.charsNoSpace}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Lines</span>
                                    <span className="font-medium">{stats.lines}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Paragraphs</span>
                                    <span className="font-medium">{stats.paragraphs}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Reading Time</span>
                                    <span className="font-medium">~{stats.readingTime} min</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Editor */}
                <div className="md:col-span-3">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col h-[600px]">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <AlignLeft className="w-4 h-4" />
                                Text Editor
                            </span>
                            <button
                                onClick={copyText}
                                className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                title="Copy text"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="flex-1 w-full p-6 text-lg bg-transparent border-0 focus:ring-0 outline-none resize-none"
                            placeholder="Start typing or paste your text here to analyze..."
                            spellCheck="false"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
