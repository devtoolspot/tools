"use client";

import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const footerLinks = {
    Media: [
        { name: 'Image to PDF', href: '/tools/image-to-pdf' },
        { name: 'Image to SVG', href: '/tools/image-to-svg' },
        { name: 'SVG Animator', href: '/tools/svg-animator' },
        { name: 'Image Converter', href: '/tools/image-converter' },
    ],
    Developer: [
        { name: 'CSS Minifier', href: '/tools/css-minifier' },
        { name: 'JSON Formatter', href: '/tools/json-formatter' },
        { name: 'Base64 Converter', href: '/tools/base64-converter' },
        { name: 'URL Encoder', href: '/tools/url-encoder' },
        { name: 'Markdown Editor', href: '/tools/markdown-editor' },
        { name: 'Regex Tester', href: '/tools/regex-tester' },
        { name: 'Diff Checker', href: '/tools/diff-checker' },
    ],
    Utilities: [
        { name: 'Text to Speech', href: '/tools/text-to-speech' },
        { name: 'Word Counter', href: '/tools/word-counter' },
        { name: 'QR Generator', href: '/tools/qr-generator' },
        { name: 'Color Picker', href: '/tools/color-picker' },
        { name: 'Password Gen', href: '/tools/password-generator' },
        { name: 'Unit Converter', href: '/tools/unit-converter' },
        { name: 'Lorem Ipsum', href: '/tools/lorem-ipsum' },
    ]
};

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    <div className="col-span-1 lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">A</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                Antigravity
                            </span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                            Premium developer and design tools to streamline your workflow. Free, fast, and secure. Run entirely in your browser.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 dark:hover:text-blue-400 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Media Tools</h3>
                        <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            {footerLinks.Media.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Dev Tools</h3>
                        <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            {footerLinks.Developer.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Utilities</h3>
                        <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            {footerLinks.Utilities.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-8 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                    <div className="flex items-center justify-center md:justify-start gap-6 order-2 md:order-1">
                        <Link href="/privacy-policy" className="text-xs text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms-conditions" className="text-xs text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-colors">
                            Terms and Conditions
                        </Link>
                    </div>

                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center order-1 md:order-2">
                        © {currentYear} Antigravity Tools. All rights reserved.
                    </p>

                    <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center md:justify-end gap-1 order-3">
                        Made with <span className="text-red-500">♥</span> by DeepMind
                    </p>
                </div>
            </div>
        </footer>
    );
}
