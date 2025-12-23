"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FileUp, Download, Settings, RefreshCw, Palette } from 'lucide-react';
import ImageTracer from 'imagetracerjs';

export default function ImageToSVG() {
    const [svgOutput, setSvgOutput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [colors, setColors] = useState({}); // { "#aabbcc": "#aabbcc" } -> map original to new
    const [options, setOptions] = useState({
        ltres: 1,
        qtres: 1,
        pathomit: 8,
        colorsampling: 2, // 0:disabled, 1:random, 2:deterministic
        numberofcolors: 16,
        mincolorratio: 0,
        colorquantcycles: 3,
        scale: 1,
        blurradius: 0,
        blurdelta: 20
    });

    // Helper to extract unique colors from SVG string
    const extractColors = (svgStr) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgStr, 'image/svg+xml');
        const paths = doc.querySelectorAll('path');
        const uniqueColors = new Set();

        paths.forEach(p => {
            const fill = p.getAttribute('fill');
            // Convert rgb to hex if needed, but ImageTracer usually outputs rgb() or hex
            // We just store exact string for matching
            if (fill && fill !== 'none') uniqueColors.add(fill);
        });

        const initialColors = {};
        Array.from(uniqueColors).forEach(c => initialColors[c] = c);
        setColors(initialColors);
    };

    const handleDetailedImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsProcessing(true);
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    ImageTracer.imageToSVG(
                        event.target.result,
                        (svgstr) => {
                            setSvgOutput(svgstr);
                            extractColors(svgstr);
                            setIsProcessing(false);
                        },
                        options
                    );
                } catch (err) {
                    console.error(err);
                    setIsProcessing(false);
                    alert("Error processing image");
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleColorChange = (originalColor, newColor) => {
        setColors(prev => ({ ...prev, [originalColor]: newColor }));
    };

    // Generate Display SVG with color replacements
    const getProcessedSVG = () => {
        if (!svgOutput) return '';
        // Simple string replacement might be dangerous if color strings overlap (e.g. #111 and #111111)
        // But for distinct rgb values usually fine.
        // Safer to parse and update.

        const parser = new DOMParser();
        const doc = parser.parseFromString(svgOutput, 'image/svg+xml');
        const paths = doc.querySelectorAll('path');

        paths.forEach(p => {
            const fill = p.getAttribute('fill');
            if (fill && colors[fill]) {
                p.setAttribute('fill', colors[fill]);
            }
        });

        return new XMLSerializer().serializeToString(doc);
    };

    const downloadSVG = () => {
        const processed = getProcessedSVG();
        if (!processed) return;
        const blob = new Blob([processed], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'vectorized.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const processedAndReadySVG = getProcessedSVG();

    return (
        <div className="max-w-7xl mx-auto px-4 pb-8 pt-40">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">True Image Vectorizer</h1>
                <p className="text-gray-600 dark:text-gray-400">Convert raster images to SVG paths. Edit path colors individually.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Controls Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Settings Panel */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-gray-500" />
                            Generation Settings
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Number of Colors ({options.numberofcolors})
                                </label>
                                <input
                                    type="range"
                                    min="2"
                                    max="64"
                                    value={options.numberofcolors}
                                    onChange={(e) => setOptions({ ...options, numberofcolors: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Smoothness (Blur)
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="5"
                                    value={options.blurradius}
                                    onChange={(e) => setOptions({ ...options, blurradius: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                                />
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg text-xs text-blue-800 dark:text-blue-300">
                                Tip: Reduce colors for simpler logos. Increase for photos.
                            </div>
                        </div>
                    </div>

                    {/* Colors Panel - Only show if we have output */}
                    {svgOutput && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Palette className="w-5 h-5 text-gray-500" />
                                Path Colors
                            </h3>
                            <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto p-1">
                                {Object.entries(colors).map(([original, current], idx) => (
                                    <div key={idx} className="relative group">
                                        <div
                                            className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 cursor-pointer shadow-sm"
                                            style={{ backgroundColor: current }}
                                        >
                                            <input
                                                type="color"
                                                value={current.startsWith('rgb') ? '#000000' : current} // Simple fallback as input type=color expects hex
                                                // Ideally convert rgb to hex if needed, but modern browsers might handle it or we just let user pick new
                                                onChange={(e) => handleColorChange(original, e.target.value)}
                                                className="opacity-0 w-full h-full cursor-pointer absolute top-0 left-0"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-2 text-center">Click a circle to change that path color.</p>
                        </div>
                    )}
                </div>

                {/* Workflow Area */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 min-h-[600px] flex flex-col">
                        {!svgOutput && !isProcessing ? (
                            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="vector-input"
                                    onChange={handleDetailedImageUpload}
                                />
                                <label htmlFor="vector-input" className="cursor-pointer flex flex-col items-center gap-4 p-8 w-full h-full justify-center">
                                    <div className="p-4 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
                                        <FileUp className="w-10 h-10" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">Upload Raster Image</p>
                                        <p className="text-sm text-gray-500 mt-2">Convert JPG/PNG to editable SVG vectors</p>
                                    </div>
                                </label>
                            </div>
                        ) : isProcessing ? (
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                                <p className="text-lg font-medium">Tracing image...</p>
                                <p className="text-sm text-gray-500">Processing paths locally...</p>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Vector Result</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setSvgOutput(null); setColors({}); }}
                                            className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                                        >
                                            Clear
                                        </button>
                                        <button
                                            onClick={downloadSVG}
                                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-md shadow-blue-500/20"
                                        >
                                            <Download className="w-4 h-4" /> Save SVG
                                        </button>
                                    </div>
                                </div>

                                <div
                                    className="flex-1 flex items-center justify-center bg-[#f0f0f0] dark:bg-[#1a1a1a] rounded-xl overflow-hidden p-8 relative border border-gray-200 dark:border-gray-800"
                                    style={{
                                        backgroundImage: 'radial-gradient(#ccc 1px, transparent 1px)',
                                        backgroundSize: '20px 20px',
                                    }}
                                >
                                    <div
                                        dangerouslySetInnerHTML={{ __html: processedAndReadySVG }}
                                        className="w-full h-full [&>svg]:w-full [&>svg]:h-full drop-shadow-xl"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
