"use client";

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, Link as LinkIcon, Palette } from 'lucide-react';

export default function QRGenerator() {
    const [text, setText] = useState('https://example.com');
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [color, setColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [width, setWidth] = useState(300);

    useEffect(() => {
        generateQR();
    }, [text, color, bgColor, width]);

    const generateQR = async () => {
        try {
            const url = await QRCode.toDataURL(text, {
                width: width,
                margin: 2,
                color: {
                    dark: color,
                    light: bgColor
                }
            });
            setQrDataUrl(url);
        } catch (err) {
            console.error(err);
        }
    };

    const downloadQR = () => {
        const link = document.createElement('a');
        link.href = qrDataUrl;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 pb-8 pt-40">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">QR Code Generator</h1>
                <p className="text-gray-600 dark:text-gray-400">Create custom QR codes for your links and text.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Enter URL or text"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Foreground</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="h-10 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                                />
                                <span className="text-sm font-mono text-gray-500">{color}</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Background</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="h-10 w-10 rounded-lg cursor-pointer border-0 bg-transparent"
                                />
                                <span className="text-sm font-mono text-gray-500">{bgColor}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Size (px)</label>
                        <input
                            type="range"
                            min="100"
                            max="1000"
                            step="10"
                            value={width}
                            onChange={(e) => setWidth(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                        />
                        <div className="text-right text-sm text-gray-500 mt-1">{width}px</div>
                    </div>
                </div>

                {/* Preview */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex flex-col items-center justify-center gap-6">
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                        {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="max-w-full h-auto rounded-lg shadow-sm" />}
                    </div>

                    <button
                        onClick={downloadQR}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-500/20"
                    >
                        <Download className="w-5 h-5" />
                        Download PNG
                    </button>
                </div>
            </div>
        </div>
    );
}
