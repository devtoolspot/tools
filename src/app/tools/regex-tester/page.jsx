"use client";

import React, { useState, useMemo } from 'react';
import { Regex, Flag, CheckCircle, AlertCircle } from 'lucide-react';

export default function RegexTester() {
    const [pattern, setPattern] = useState('([A-Z])\\w+');
    const [flags, setFlags] = useState('g');
    const [text, setText] = useState('Hello World. This is a Regex Tester.');

    const result = useMemo(() => {
        try {
            const regex = new RegExp(pattern, flags);
            const matches = [];
            let match;

            // If global flag is not set, exec only returns the first match once. 
            // We need to handle that or enforce global for multiple highlighting?
            // Actually standard regex testers usually let you choose.

            if (!flags.includes('g')) {
                const m = regex.exec(text);
                if (m) matches.push({ index: m.index, length: m[0].length, content: m[0] });
            } else {
                // Prevent infinite loops with zero-length matches
                while ((match = regex.exec(text)) !== null) {
                    matches.push({ index: match.index, length: match[0].length, content: match[0] });
                    if (match.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }
                }
            }
            return { valid: true, matches };
        } catch (e) {
            return { valid: false, error: e.message };
        }
    }, [pattern, flags, text]);

    // Highlight logic used for display
    const renderHighlightedText = () => {
        if (!result.valid || result.matches.length === 0) return text;

        let lastIndex = 0;
        const elements = [];

        result.matches.forEach((m, i) => {
            // Text before match
            if (m.index > lastIndex) {
                elements.push(<span key={`text-${i}`}>{text.slice(lastIndex, m.index)}</span>);
            }
            // Match
            elements.push(
                <mark key={`match-${i}`} className="bg-blue-200 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded px-0.5">
                    {text.slice(m.index, m.index + m.length)}
                </mark>
            );
            lastIndex = m.index + m.length;
        });

        // Remaining text
        if (lastIndex < text.length) {
            elements.push(<span key="text-end">{text.slice(lastIndex)}</span>);
        }

        return elements;
    };

    return (
        <div className="max-w-4xl mx-auto px-4 pb-8 pt-40">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Regex Tester</h1>
                <p className="text-gray-600 dark:text-gray-400">Test and debug regular expressions in real-time.</p>
            </div>

            <div className="space-y-6">
                {/* Input Area */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Regular Expression</label>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl focus-within:ring-2 focus-within:ring-blue-500">
                            <span className="text-gray-400 font-mono text-lg select-none">/</span>
                            <input
                                type="text"
                                value={pattern}
                                onChange={(e) => setPattern(e.target.value)}
                                className="flex-1 bg-transparent border-0 focus:ring-0 text-lg font-mono outline-none mx-1"
                                placeholder="pattern"
                            />
                            <span className="text-gray-400 font-mono text-lg select-none">/</span>
                            <input
                                type="text"
                                value={flags}
                                onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ''))} // Filter valid flags
                                className="w-16 bg-transparent border-0 focus:ring-0 text-lg font-mono outline-none text-gray-500"
                                placeholder="g"
                            />
                        </div>
                    </div>
                    {!result.valid && (
                        <div className="mt-2 text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> {result.error}
                        </div>
                    )}
                </div>

                {/* Test String */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Test String</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full h-32 p-4 font-mono text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-950/50 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        spellCheck="false"
                    />
                </div>

                {/* Results */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            Match Results
                            {result.valid && (
                                <span className="text-xs font-normal bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                    {result.matches.length} matches
                                </span>
                            )}
                        </h3>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl font-mono text-sm whitespace-pre-wrap break-all min-h-[100px]">
                        {renderHighlightedText()}
                    </div>
                </div>
            </div>
        </div>
    );
}
