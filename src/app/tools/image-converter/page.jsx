"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileUp, Download, ArrowRightLeft, Image as ImageIcon, Settings, RefreshCw } from 'lucide-react';

const FORMATS = [
    { value: 'image/png', label: 'PNG', ext: 'png' },
    { value: 'image/jpeg', label: 'JPEG', ext: 'jpg' },
    { value: 'image/webp', label: 'WEBP', ext: 'webp' },
    { value: 'image/bmp', label: 'BMP', ext: 'bmp' },
    { value: 'image/x-icon', label: 'ICO', ext: 'ico' },
    { value: 'image/gif', label: 'GIF (Static)', ext: 'gif' },
];

export default function ImageConverter() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [format, setFormat] = useState(FORMATS[0]);
    const [quality, setQuality] = useState(0.9);
    const [scale, setScale] = useState(100);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [originalDimensions, setOriginalDimensions] = useState({ w: 0, h: 0 });
    const [convertedUrl, setConvertedUrl] = useState(null);
    const [convertStatus, setConvertStatus] = useState('idle'); // idle, processing, done
    const [fileSize, setFileSize] = useState({ original: 0, converted: 0 });

    const handleUpload = (e) => {
        const f = e.target.files?.[0];
        if (f) {
            setFile(f);
            setPreview(URL.createObjectURL(f));
            setFileSize(prev => ({ ...prev, original: f.size }));
            setConvertedUrl(null);

            // Get dimensions
            const img = new Image();
            img.onload = () => {
                setOriginalDimensions({ w: img.width, h: img.height });
                setWidth(img.width);
                setHeight(img.height);
            };
            img.src = URL.createObjectURL(f);
        }
    };

    const handleDimensionChange = (type, value) => {
        const val = parseInt(value) || 0;
        if (type === 'scale') {
            setScale(val);
            setWidth(Math.round(originalDimensions.w * (val / 100)));
            setHeight(Math.round(originalDimensions.h * (val / 100)));
        } else if (type === 'width') {
            setWidth(val);
            const ratio = val / originalDimensions.w;
            setHeight(Math.round(originalDimensions.h * ratio));
            setScale(Math.round(ratio * 100));
        } else {
            setHeight(val);
            const ratio = val / originalDimensions.h;
            setWidth(Math.round(originalDimensions.w * ratio));
            setScale(Math.round(ratio * 100));
        }
    };

    const convertImage = () => {
        if (!file) return;
        setConvertStatus('processing');

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width || img.width;
            canvas.height = height || img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const url = canvas.toDataURL(format.value, quality);
            setConvertedUrl(url);

            // Calculate approximate size
            const head = 'data:' + format.value + ';base64,';
            const size = Math.round((url.length - head.length) * 3 / 4);
            setFileSize(prev => ({ ...prev, converted: size }));
            setConvertStatus('done');
        };
        img.src = preview;
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    useEffect(() => {
        if (file) convertImage();
    }, [format, quality, width, height]);

    return (
        <div className="max-w-5xl mx-auto px-4 pb-8 pt-40">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Advanced Image Converter</h1>
                <p className="text-gray-600 dark:text-gray-400">Convert, resize, and optimize images in multiple formats.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 md:p-8">
                {!file ? (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-12 text-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="converter-input"
                            onChange={handleUpload}
                        />
                        <label htmlFor="converter-input" className="cursor-pointer flex flex-col items-center gap-4">
                            <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                                <ArrowRightLeft className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-lg font-medium text-gray-900 dark:text-white">Upload Image to Convert</p>
                                <p className="text-sm text-gray-500 mt-1">Supports PNG, JPG, WEBP, BMP, ICO, GIF</p>
                            </div>
                        </label>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-12 gap-8">
                        {/* Sidebar Controls */}
                        <div className="md:col-span-4 space-y-6">
                            {/* Format Selection */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Settings className="w-4 h-4" /> Output Format
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {FORMATS.map((f) => (
                                        <button
                                            key={f.value}
                                            onClick={() => setFormat(f)}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${format.value === f.value
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30'
                                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                                                }`}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Dimensions */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                    Dimensions & Scale
                                </label>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Scale ({scale}%)</label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="200"
                                            value={scale}
                                            onChange={(e) => handleDimensionChange('scale', e.target.value)}
                                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">Width (px)</label>
                                            <input
                                                type="number"
                                                value={width}
                                                onChange={(e) => handleDimensionChange('width', e.target.value)}
                                                className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">Height (px)</label>
                                            <input
                                                type="number"
                                                value={height}
                                                onChange={(e) => handleDimensionChange('height', e.target.value)}
                                                className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quality */}
                            {format.value !== 'image/png' && (
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-bold text-gray-900 dark:text-white">Quality</label>
                                        <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">{Math.round(quality * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="1"
                                        step="0.05"
                                        value={quality}
                                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Preview Area */}
                        <div className="md:col-span-8 flex flex-col h-full">
                            <div className="flex-1 bg-gray-100 dark:bg-black/20 rounded-xl overflow-hidden flex items-center justify-center p-8 border border-gray-200 dark:border-gray-800 relative min-h-[400px]">
                                {convertStatus === 'processing' && (
                                    <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
                                        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                                    </div>
                                )}
                                <div className="relative shadow-2xl rounded-sm overflow-hidden" style={{ maxWidth: '100%', maxHeight: '100%' }}>
                                    {/* Using convertedUrl if available for true preview */}
                                    <img
                                        src={convertedUrl || preview}
                                        alt="Preview"
                                        className="max-w-full max-h-[500px] object-contain"
                                    />
                                </div>
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                                    <div className="bg-black/75 text-white px-3 py-1 rounded-full text-xs backdrop-blur-md border border-white/10">
                                        Original: {originalDimensions.w} x {originalDimensions.h} ({formatSize(fileSize.original)})
                                    </div>
                                    <div className="bg-blue-600/90 text-white px-3 py-1 rounded-full text-xs backdrop-blur-md border border-blue-400/30">
                                        New: {width} x {height} (~{formatSize(fileSize.converted)})
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                                <button onClick={() => { setFile(null); setPreview(null); }} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm font-medium">
                                    Start Over
                                </button>
                                <a
                                    href={convertedUrl}
                                    download={`converted-image.${format.ext}`}
                                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center gap-2 transform active:scale-95"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Converted {format.label}
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
