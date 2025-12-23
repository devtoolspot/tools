"use client";

import React, { useState, useEffect } from 'react';
import { KeyRound, RefreshCw, Copy, Check, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

export default function PasswordGenerator() {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
    });
    const [strength, setStrength] = useState(0);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        generatePassword();
    }, [length, options]);

    const generatePassword = () => {
        const sets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
        };

        let charset = '';
        let newPassword = '';
        let typesCount = 0;

        Object.keys(options).forEach(key => {
            if (options[key]) {
                charset += sets[key];
                newPassword += sets[key][Math.floor(Math.random() * sets[key].length)]; // Ensure one of each type
                typesCount++;
            }
        });

        if (!charset) {
            setPassword('');
            setStrength(0);
            return;
        }

        // Fill rest
        for (let i = newPassword.length; i < length; i++) {
            newPassword += charset[Math.floor(Math.random() * charset.length)];
        }

        // Shuffle
        newPassword = newPassword.split('').sort(() => 0.5 - Math.random()).join('');
        setPassword(newPassword);

        // Calculate strength
        let score = 0;
        if (newPassword.length > 8) score++;
        if (newPassword.length > 12) score++;
        if (typesCount > 2) score++;
        if (typesCount > 3) score++;
        setStrength(score);
    };

    const copyToClipboard = () => {
        if (!password) return;
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const strengthColor = () => {
        switch (strength) {
            case 0: return 'bg-gray-200 dark:bg-gray-700';
            case 1: return 'bg-red-500';
            case 2: return 'bg-orange-500';
            case 3: return 'bg-yellow-500';
            case 4: return 'bg-green-500';
            default: return 'bg-gray-200';
        }
    };

    const strengthLabel = () => {
        switch (strength) {
            case 0: return 'Very Weak';
            case 1: return 'Weak';
            case 2: return 'Fair';
            case 3: return 'Good';
            case 4: return 'Strong';
            default: return '';
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 pb-8 pt-40">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Secure Password Generator</h1>
                <p className="text-gray-600 dark:text-gray-400">Create strong, random passwords to stay safe online.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Output Display */}
                <div className="p-8 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 flex flex-col items-center gap-6">
                    <div className="relative w-full max-w-2xl">
                        <input
                            type="text"
                            readOnly
                            value={password}
                            className="w-full h-16 pl-6 pr-16 text-2xl sm:text-3xl font-mono text-center bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-800 dark:text-gray-100 placeholder-gray-300"
                            placeholder="Result"
                        />
                        <button
                            onClick={copyToClipboard}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Copy"
                        >
                            {copied ? <Check className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
                        </button>
                    </div>

                    <div className="flex items-center gap-4 w-full max-w-2xl px-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${strengthColor()}`}
                                style={{ width: `${(strength / 4) * 100}%` }}
                            />
                        </div>
                        <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 min-w-[80px] text-right">
                            {strengthLabel()}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="p-8 grid md:grid-cols-2 gap-8 md:gap-12">
                    {/* Length */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <label className="text-lg font-medium text-gray-900 dark:text-white">Password Length</label>
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono">{length}</span>
                        </div>
                        <input
                            type="range"
                            min="4"
                            max="64"
                            value={length}
                            onChange={(e) => setLength(Number(e.target.value))}
                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>4</span>
                            <span>32</span>
                            <span>64</span>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-4">
                        <label className="text-lg font-medium text-gray-900 dark:text-white block mb-4">Character Types</label>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 'uppercase', label: 'ABC', desc: 'Uppercase' },
                                { id: 'lowercase', label: 'abc', desc: 'Lowercase' },
                                { id: 'numbers', label: '123', desc: 'Numbers' },
                                { id: 'symbols', label: '#@!', desc: 'Symbols' },
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setOptions(prev => ({ ...prev, [opt.id]: !prev[opt.id] }))}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${options[opt.id]
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500'
                                        }`}
                                >
                                    <span className="text-xl font-bold mb-1">{opt.label}</span>
                                    <span className="text-xs">{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-gray-100 dark:border-gray-800 flex justify-center">
                    <button
                        onClick={generatePassword}
                        className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transform hover:-translate-y-1 transition-all"
                    >
                        <RefreshCw className="w-6 h-6" />
                        Generate New Password
                    </button>
                </div>
            </div>
        </div>
    );
}
