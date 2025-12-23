"use client";

import React, { useState } from 'react';
import * as Diff from 'diff';
import { GitCompare, ArrowRight, RotateCcw } from 'lucide-react';

export default function DiffChecker() {
    const [original, setOriginal] = useState('');
    const [modified, setModified] = useState('');
    const [diff, setDiff] = useState([]);
    const [showDiff, setShowDiff] = useState(false);

    const compare = () => {
        const d = Diff.diffLines(original, modified);
        setDiff(d);
        setShowDiff(true);
    };

    const reset = () => {
        setOriginal('');
        setModified('');
        setDiff([]);
        setShowDiff(false);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 pb-8 pt-40">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Text Diff Checker</h1>
                <p className="text-gray-600 dark:text-gray-400">Compare two text files and see the differences.</p>
            </div>

            {!showDiff ? (
                <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8 h-[500px]">
                        <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                            <label className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Original Text</label>
                            <textarea
                                value={original}
                                onChange={(e) => setOriginal(e.target.value)}
                                className="flex-1 w-full p-4 font-mono text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-950/50 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                placeholder="Paste original text here..."
                            />
                        </div>
                        <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                            <label className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Modified Text</label>
                            <textarea
                                value={modified}
                                onChange={(e) => setModified(e.target.value)}
                                className="flex-1 w-full p-4 font-mono text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-950/50 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                placeholder="Paste modified text here..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={compare}
                            disabled={!original && !modified}
                            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all"
                        >
                            <GitCompare className="w-5 h-5" /> Compare Texts
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-200">Comparison Result</h3>
                        <button
                            onClick={() => setShowDiff(false)}
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                        >
                            <RotateCcw className="w-4 h-4" /> Edit Inputs
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden font-mono text-sm">
                        <div className="grid grid-cols-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/30 font-medium text-gray-500 dark:text-gray-400">
                            <div className="p-3 border-r border-gray-200 dark:border-gray-800">Original</div>
                            <div className="p-3">Modified</div>
                        </div>

                        {/* 
                Visualizing split view diff is complex with just 'diffLines'.
                For a unified view (easier):
             */}
                        <div className="p-4 overflow-x-auto">
                            {diff.map((part, index) => {
                                const color = part.added ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                                    part.removed ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                                        'text-gray-600 dark:text-gray-400';

                                const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';

                                return (
                                    <div key={index} className={`${color} px-2 whitespace-pre-wrap break-all`}>
                                        {prefix}{part.value}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="flex gap-4 justify-center text-sm">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-200 dark:bg-red-900/50"></div> Removed</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-200 dark:bg-green-900/50"></div> Added</div>
                    </div>
                </div>
            )}
        </div>
    );
}
