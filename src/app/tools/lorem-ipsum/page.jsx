"use client";

import React, { useState, useEffect } from 'react';
import { Type, Copy, Check, RefreshCw } from 'lucide-react';

export default function LoremIpsum() {
    const [count, setCount] = useState(3);
    const [type, setType] = useState('paragraphs'); // paragraphs, sentences, words
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        generate();
    }, [count, type]);

    const generate = () => {
        // Simple generator logic - normally use a library but this is lighter
        const words = [
            "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
            "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
            "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
            "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
            "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit",
            "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
            "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
            "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
        ];

        const getSentence = () => {
            const len = Math.floor(Math.random() * 10) + 8;
            const arr = [];
            for (let i = 0; i < len; i++) arr.push(words[Math.floor(Math.random() * words.length)]);
            let s = arr.join(' ');
            return s.charAt(0).toUpperCase() + s.slice(1) + '.';
        };

        const getParagraph = () => {
            const len = Math.floor(Math.random() * 5) + 3;
            const arr = [];
            for (let i = 0; i < len; i++) arr.push(getSentence());
            return arr.join(' ');
        };

        let result = [];
        if (type === 'words') {
            for (let i = 0; i < count; i++) result.push(words[Math.floor(Math.random() * words.length)]);
            setText(result.join(' '));
        } else if (type === 'sentences') {
            for (let i = 0; i < count; i++) result.push(getSentence());
            setText(result.join(' '));
        } else {
            for (let i = 0; i < count; i++) result.push(getParagraph());
            setText(result.join('\n\n'));
        }
    };

    const copy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 pb-8 pt-40">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Lorem Ipsum Generator</h1>
                <p className="text-gray-600 dark:text-gray-400">Generate placeholder text for your designs.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Controls */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex flex-wrap gap-6 items-center justify-between">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Generate</label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={count}
                                onChange={(e) => setCount(Number(e.target.value))}
                                className="w-20 p-2 text-center border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex bg-white dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                            {['paragraphs', 'sentences', 'words'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setType(t)}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${type === t
                                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                        }`}
                                >
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={generate}
                            className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Regenerate"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                        <button
                            onClick={copy}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied' : 'Copy Text'}
                        </button>
                    </div>
                </div>

                {/* Output */}
                <div className="p-8 min-h-[400px]">
                    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {text}
                    </div>
                </div>
            </div>
        </div>
    );
}
