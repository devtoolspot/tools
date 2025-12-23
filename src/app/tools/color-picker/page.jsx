"use client";

import React, { useState, useEffect } from 'react';
import { Palette, Copy, Check } from 'lucide-react';

export default function ColorPicker() {
    const [color, setColor] = useState('#3b82f6');
    const [rgb, setRgb] = useState('rgb(59, 130, 246)');
    const [hsl, setHsl] = useState('hsl(217, 91%, 60%)');
    const [copied, setCopied] = useState(null);

    useEffect(() => {
        // Update conversions when color changes
        const hex = color;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        setRgb(`rgb(${r}, ${g}, ${b})`);

        // RGB to HSL
        let r_ = r / 255;
        let g_ = g / 255;
        let b_ = b / 255;
        let max = Math.max(r_, g_, b_);
        let min = Math.min(r_, g_, b_);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r_: h = (g_ - b_) / d + (g_ < b_ ? 6 : 0); break;
                case g_: h = (b_ - r_) / d + 2; break;
                case b_: h = (r_ - g_) / d + 4; break;
            }
            h /= 6;
        }

        setHsl(`hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`);
    }, [color]);

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 pb-8 pt-40">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Color Picker</h1>
                <p className="text-gray-600 dark:text-gray-400">Pick colors and convert between HEX, RGB, and HSL.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Color Area */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex flex-col items-center justify-center space-y-6">
                    <div
                        className="w-48 h-48 rounded-full shadow-inner border-4 border-white dark:border-gray-700 ring-4 ring-gray-100 dark:ring-gray-800 transition-colors duration-200"
                        style={{ backgroundColor: color }}
                    />
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">Select Color</label>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-full h-12 cursor-pointer border-0 p-0 rounded-lg overflow-hidden"
                        />
                    </div>
                </div>

                {/* Values */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                    {[
                        { label: 'HEX', value: color },
                        { label: 'RGB', value: rgb },
                        { label: 'HSL', value: hsl }
                    ].map((item) => (
                        <div key={item.label}>
                            <label className="block text-sm font-medium text-gray-500 mb-1">{item.label}</label>
                            <div className="flex gap-2">
                                <div className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg font-mono text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
                                    {item.value}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(item.value, item.label)}
                                    className="p-3 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
                                    title="Copy"
                                >
                                    {copied === item.label ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
