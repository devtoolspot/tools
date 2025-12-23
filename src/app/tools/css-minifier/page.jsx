"use client";

import React, { useState, useEffect } from 'react';
import { Minimize, Copy, Check, ArrowRight, RotateCcw, Eye, Code2, LayoutTemplate } from 'lucide-react';

export default function CSSMinifier() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [htmlInput, setHtmlInput] = useState('<div class="box">\n  Hello World!\n  <span>This is a test.</span>\n</div>');
    const [copied, setCopied] = useState(false);
    const [showPreview, setShowPreview] = useState(true);

    const minifyCSS = () => {
        let css = input;
        try {
            css = css.replace(/\/\*[\s\S]*?\*\//g, ""); // Remove comments
            css = css.replace(/\s+/g, " "); // Compress whitespace
            css = css.replace(/\s*([{}:;,])\s*/g, "$1"); // Remove text around delimiters
            css = css.replace(/;\}/g, "}"); // Remove last semicolon
            css = css.replace(/\s+(!important)/g, "$1"); // Compress !important
            setOutput(css.trim());
        } catch (e) {
            setOutput("Error minifying CSS");
        }
    };

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const clear = () => {
        setInput('');
        setOutput('');
    };

    // Auto-minify when input changes (optional, but requested "advanced")
    // Or keep manual button? Let's keep manual button for control, but maybe auto-preview.

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 pt-40">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Advanced CSS Minifier</h1>
                <p className="text-gray-600 dark:text-gray-400">Minify CSS and preview results instantly with custom HTML.</p>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">

                {/* CSS Input Side */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col h-[400px]">
                        <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-t-xl">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Code2 className="w-4 h-4" /> CSS Input
                            </label>
                            <button
                                onClick={clear}
                                className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                            >
                                <RotateCcw className="w-3 h-3" /> Clear
                            </button>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 w-full p-4 font-mono text-sm bg-transparent focus:ring-0 outline-none resize-none"
                            placeholder=".box { color: red; padding: 20px; }"
                        />
                    </div>
                </div>

                {/* Minified Output Side */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col h-[400px]">
                        <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-t-xl">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Minimize className="w-4 h-4" /> Minified Output
                            </label>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                    {input.length > 0 && output.length > 0 &&
                                        `${Math.round((1 - output.length / input.length) * 100)}% Saved`
                                    }
                                </span>
                                {output && (
                                    <button
                                        onClick={copyOutput}
                                        className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline ml-2"
                                    >
                                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                )}
                            </div>
                        </div>
                        <textarea
                            readOnly
                            value={output}
                            className="flex-1 w-full p-4 font-mono text-sm bg-gray-50 dark:bg-black/20 focus:ring-0 outline-none resize-none text-gray-600 dark:text-gray-400"
                            placeholder="Minified output..."
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-center mb-12">
                <button
                    onClick={minifyCSS}
                    disabled={!input}
                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                >
                    Minify CSS <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            {/* Preview Section */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Eye className="w-5 h-5" /> Live Preview
                    </h2>
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                </div>

                {showPreview && (
                    <div className="grid lg:grid-cols-2 gap-6 min-h-[400px]">
                        {/* HTML Input */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col">
                            <div className="p-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-t-xl">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <LayoutTemplate className="w-4 h-4" /> HTML Structure
                                </label>
                            </div>
                            <textarea
                                value={htmlInput}
                                onChange={(e) => setHtmlInput(e.target.value)}
                                className="flex-1 w-full p-4 font-mono text-sm bg-transparent focus:ring-0 outline-none resize-none m-0"
                                placeholder="<div>Test</div>"
                            />
                        </div>

                        {/* Live Result */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden relative">
                            <div className="p-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-t-xl">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Eye className="w-4 h-4" /> Output Result
                                </label>
                            </div>
                            <div className="flex-1 p-4 bg-white dark:bg-black/20 overflow-auto">
                                <style>{input}</style>
                                <div dangerouslySetInnerHTML={{ __html: htmlInput }} />
                            </div>
                            <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded opacity-50 pointer-events-none">
                                Preview
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
