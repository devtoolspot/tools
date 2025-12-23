"use client";

import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import {
    Download, FileText, Eye, Code, Copy, Check,
    Bold, Italic, Heading1, Heading2, Heading3,
    List, Quote, Link as LinkIcon, Image as ImageIcon,
    Terminal
} from 'lucide-react';

export default function MarkdownEditor() {
    const [markdown, setMarkdown] = useState(`# Welcome to Advanced Markdown Editor
    
Tyoe on the left, see the result on the right.

# Functionality
- Use the toolbar above to format text.
- Standard Markdown syntax is supported.
- Export as HTML when done.

## Features
1. Live Preview
2. Toolbar Helpers
3. HTML Export
`);
    const [html, setHtml] = useState('');
    const [activeTab, setActiveTab] = useState('preview'); // preview | html
    const [copied, setCopied] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        setHtml(marked.parse(markdown));
    }, [markdown]);

    const insertMarkdown = (prefix, suffix = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = markdown;
        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        const newText = before + prefix + selection + suffix + after;
        setMarkdown(newText);

        // Restore focus and cursor
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 0);
    };

    const copyHtml = () => {
        navigator.clipboard.writeText(html);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadHtml = () => {
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'document.html';
        link.click();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 pb-8 pt-40 h-[calc(100vh-64px)] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Markdown Editor</h1>
                    <p className="text-sm text-gray-500">Live preview editor with formatting tools.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={downloadHtml}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
                    >
                        <Download className="w-4 h-4" /> Export HTML
                    </button>
                </div>
            </div>

            <div className="flex-1 grid md:grid-cols-2 gap-6 min-h-0">
                {/* Editor Side */}
                <div className="flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    {/* Toolbar */}
                    <div className="px-2 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-1">
                        <button onClick={() => insertMarkdown('**', '**')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" title="Bold">
                            <Bold className="w-4 h-4" />
                        </button>
                        <button onClick={() => insertMarkdown('*', '*')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" title="Italic">
                            <Italic className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"></div>
                        <button onClick={() => insertMarkdown('# ')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" title="Heading 1">
                            <Heading1 className="w-4 h-4" />
                        </button>
                        <button onClick={() => insertMarkdown('## ')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" title="Heading 2">
                            <Heading2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => insertMarkdown('### ')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" title="Heading 3">
                            <Heading3 className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"></div>
                        <button onClick={() => insertMarkdown('- ')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" title="List">
                            <List className="w-4 h-4" />
                        </button>
                        <button onClick={() => insertMarkdown('> ')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" title="Quote">
                            <Quote className="w-4 h-4" />
                        </button>
                        <button onClick={() => insertMarkdown('```\n', '\n```')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" title="Code Block">
                            <Terminal className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"></div>
                        <button onClick={() => insertMarkdown('[', '](url)')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" title="Link">
                            <LinkIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => insertMarkdown('![alt text](', ')')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" title="Image">
                            <ImageIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <textarea
                        ref={textareaRef}
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        className="flex-1 w-full p-4 font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none resize-none"
                        spellCheck="false"
                        placeholder="# Start typing your markdown..."
                    />
                </div>

                {/* Preview Side */}
                <div className="flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                            <Eye className="w-4 h-4" /> Preview
                        </div>
                        <div className="flex bg-gray-200 dark:bg-gray-700 rounded p-0.5">
                            <button
                                onClick={() => setActiveTab('preview')}
                                className={`px-3 py-1 text-xs font-medium rounded ${activeTab === 'preview' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                                Rendered
                            </button>
                            <button
                                onClick={() => setActiveTab('html')}
                                className={`px-3 py-1 text-xs font-medium rounded ${activeTab === 'html' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                                Raw HTML
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto bg-white dark:bg-gray-950 p-6">
                        {activeTab === 'preview' ? (
                            <article
                                className="prose dark:prose-invert max-w-none prose-img:rounded-xl prose-a:text-blue-600"
                                dangerouslySetInnerHTML={{ __html: html }}
                            />
                        ) : (
                            <div className="relative h-full">
                                <pre className="text-sm font-mono text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-all bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                                    {html}
                                </pre>
                                <button
                                    onClick={copyHtml}
                                    className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 hover:bg-gray-100 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-sm transition-colors"
                                >
                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
