"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, ChevronDown,
    FileImage, FileCode, PlaySquare, ArrowRightLeft,
    QrCode, Mic, FileText, Minimize, Binary, Palette,
    Braces, KeyRound, Scale, GitCompare, Type, Link2,
    FileEdit, Regex, Sparkles
} from 'lucide-react';

const toolCategories = {
    Media: [
        { name: 'Image to PDF', href: '/tools/image-to-pdf', icon: FileImage, desc: 'Convert img to PDF' },
        { name: 'Image to SVG', href: '/tools/image-to-svg', icon: FileCode, desc: 'Raster to Vector' },
        { name: 'SVG Animator', href: '/tools/svg-animator', icon: PlaySquare, desc: 'Animate vectors' },
        { name: 'Image Converter', href: '/tools/image-converter', icon: ArrowRightLeft, desc: 'Format switcher' },
    ],
    Developer: [
        { name: 'CSS Minifier', href: '/tools/css-minifier', icon: Minimize },
        { name: 'JSON Formatter', href: '/tools/json-formatter', icon: Braces },
        { name: 'Base64', href: '/tools/base64-converter', icon: Binary },
        { name: 'URL Encoder', href: '/tools/url-encoder', icon: Link2 },
        { name: 'Markdown', href: '/tools/markdown-editor', icon: FileEdit, isNew: true },
        { name: 'Regex', href: '/tools/regex-tester', icon: Regex, isNew: true },
        { name: 'Diff', href: '/tools/diff-checker', icon: GitCompare },
    ],
    Utilities: [
        { name: 'Text to Speech', href: '/tools/text-to-speech', icon: Mic },
        { name: 'Word Counter', href: '/tools/word-counter', icon: FileText },
        { name: 'QR Generator', href: '/tools/qr-generator', icon: QrCode },
        { name: 'Color Picker', href: '/tools/color-picker', icon: Palette },
        { name: 'Pass Generator', href: '/tools/password-generator', icon: KeyRound },
        { name: 'Unit Converter', href: '/tools/unit-converter', icon: Scale },
        { name: 'Lorem Ipsum', href: '/tools/lorem-ipsum', icon: Type },
    ]
};

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Desktop Floating Header */}
            <div className="hidden md:flex fixed top-6 inset-x-0 justify-center z-50 pointer-events-none">
                <header className={`
                    pointer-events-auto
                    flex items-center justify-between
                    px-6 py-3
                    rounded-full
                    transition-all duration-300 ease-in-out
                    border
                    ${scrolled
                        ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl border-gray-200/50 dark:border-white/10 shadow-lg shadow-black/5 w-[90%] max-w-5xl'
                        : 'bg-white/50 dark:bg-black/50 backdrop-blur-md border-transparent w-[95%] max-w-6xl'}
                `}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8 flex items-center justify-center bg-gray-900 dark:bg-white rounded-full overflow-hidden transition-transform group-hover:scale-110">
                            <span className="text-white dark:text-gray-900 font-bold text-lg">A</span>
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity">A</span>
                        </div>
                        <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                            Antigravity
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-1">
                        <Link
                            href="/"
                            className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${pathname === '/'
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            {pathname === '/' && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-gray-100 dark:bg-white/10 rounded-full -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            Home
                        </Link>

                        {Object.entries(toolCategories).map(([category, tools]) => {
                            const count = tools.length;
                            const gridCols = count > 10 ? 'grid-cols-3' : count > 5 ? 'grid-cols-2' : 'grid-cols-1';
                            const widthClass = count > 10 ? 'w-[800px]' : count > 5 ? 'w-[550px]' : 'w-72';

                            return (
                                <div
                                    key={category}
                                    className="relative"
                                    onMouseEnter={() => setHoveredCategory(category)}
                                    onMouseLeave={() => setHoveredCategory(null)}
                                >
                                    <button
                                        className={`relative flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-colors ${hoveredCategory === category
                                            ? 'text-gray-900 dark:text-white'
                                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                    >
                                        {hoveredCategory === category && (
                                            <motion.div
                                                layoutId="nav-pill"
                                                className="absolute inset-0 bg-gray-100 dark:bg-white/10 rounded-full -z-10"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        {category}
                                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${hoveredCategory === category ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {hoveredCategory === category && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 ${widthClass} z-50`}
                                            >
                                                <div className="bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-white/10 p-2 overflow-hidden ring-1 ring-black/5">
                                                    <div className={`grid ${gridCols} gap-2 p-1`}>
                                                        {tools.map((tool) => (
                                                            <Link
                                                                key={tool.href}
                                                                href={tool.href}
                                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 group/item transition-all"
                                                                onClick={() => setHoveredCategory(null)}
                                                            >
                                                                <div className="w-8 h-8 shrink-0 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover/item:bg-blue-500 group-hover/item:text-white transition-colors">
                                                                    <tool.icon className="w-4 h-4" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate flex items-center gap-2">
                                                                        {tool.name}
                                                                        {tool.isNew && (
                                                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                                                                                New
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    {tool.desc && (
                                                                        <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                                                                            {tool.desc}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </nav>

                    {/* Action Button */}
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800">
                        <a
                            href="https://github.com"
                            target="_blank"
                            className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
                        </a>
                    </div>
                </header>
            </div>

            {/* Mobile Header (Fixed Top) */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between px-4 h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-900 dark:bg-white rounded-lg">
                            <span className="text-white dark:text-gray-900 font-bold">A</span>
                        </div>
                        <span className="font-bold text-lg">Antigravity</span>
                    </Link>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 -mr-2 text-gray-600 dark:text-gray-300"
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800"
                        >
                            <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
                                <Link
                                    href="/"
                                    className="block px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl font-bold"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Home
                                </Link>
                                {Object.entries(toolCategories).map(([category, tools]) => (
                                    <div key={category}>
                                        <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{category}</h3>
                                        <div className="grid grid-cols-1 gap-1">
                                            {tools.map(tool => (
                                                <Link
                                                    key={tool.href}
                                                    href={tool.href}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <tool.icon className="w-5 h-5 text-gray-400" />
                                                    <span className="font-medium flex items-center gap-2">
                                                        {tool.name}
                                                        {tool.isNew && (
                                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                                                                New
                                                            </span>
                                                        )}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Spacer for Fixed Header */}
            <div className="h-20 md:h-28" />
        </>
    );
}
