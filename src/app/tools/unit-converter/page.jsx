"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Scale, Ruler, Zap, HardDrive, Thermometer } from 'lucide-react';

const CATEGORIES = {
    length: {
        name: 'Length',
        icon: Ruler,
        units: {
            m: { name: 'Meter', factor: 1 },
            km: { name: 'Kilometer', factor: 1000 },
            cm: { name: 'Centimeter', factor: 0.01 },
            mm: { name: 'Millimeter', factor: 0.001 },
            in: { name: 'Inch', factor: 0.0254 },
            ft: { name: 'Foot', factor: 0.3048 },
            yd: { name: 'Yard', factor: 0.9144 },
            mi: { name: 'Mile', factor: 1609.344 },
        }
    },
    mass: {
        name: 'Mass',
        icon: Scale,
        units: {
            kg: { name: 'Kilogram', factor: 1 },
            g: { name: 'Gram', factor: 0.001 },
            mg: { name: 'Milligram', factor: 0.000001 },
            lb: { name: 'Pound', factor: 0.453592 },
            oz: { name: 'Ounce', factor: 0.0283495 },
            t: { name: 'Ton (Metric)', factor: 1000 },
        }
    },
    data: {
        name: 'Digital',
        icon: HardDrive,
        units: {
            b: { name: 'Byte', factor: 1 },
            kb: { name: 'Kilobyte', factor: 1024 },
            mb: { name: 'Megabyte', factor: 1048576 },
            gb: { name: 'Gigabyte', factor: 1073741824 },
            tb: { name: 'Terabyte', factor: 1099511627776 },
        }
    },
    temp: {
        name: 'Temperature',
        icon: Thermometer,
        units: {
            c: { name: 'Celsius' },
            f: { name: 'Fahrenheit' },
            k: { name: 'Kelvin' },
        }
    }
};

export default function UnitConverter() {
    const [category, setCategory] = useState('length');
    const [amount, setAmount] = useState(1);
    const [fromUnit, setFromUnit] = useState('m');
    const [toUnit, setToUnit] = useState('ft');
    const [result, setResult] = useState(0);

    useEffect(() => {
        // defaults when category changes
        const units = Object.keys(CATEGORIES[category].units);
        if (!units.includes(fromUnit)) setFromUnit(units[0]);
        if (!units.includes(toUnit)) setToUnit(units[1] || units[0]);
    }, [category]);

    useEffect(() => {
        convert();
    }, [amount, fromUnit, toUnit, category]);

    const convert = () => {
        if (category === 'temp') {
            let val = amount;
            // Convert to Celsius first
            if (fromUnit === 'f') val = (amount - 32) * 5 / 9;
            if (fromUnit === 'k') val = amount - 273.15;

            // Convert Celsius to Target
            if (toUnit === 'c') setResult(val);
            if (toUnit === 'f') setResult(val * 9 / 5 + 32);
            if (toUnit === 'k') setResult(val + 273.15);
        } else {
            const fromFactor = CATEGORIES[category].units[fromUnit]?.factor || 1;
            const toFactor = CATEGORIES[category].units[toUnit]?.factor || 1;
            setResult((amount * fromFactor) / toFactor);
        }
    };

    const swap = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 pb-8 pt-40">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Unit Converter</h1>
                <p className="text-gray-600 dark:text-gray-400">Convert between common units of measurement.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Category Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto scrollbar-hide">
                    {Object.entries(CATEGORIES).map(([key, cat]) => (
                        <button
                            key={key}
                            onClick={() => setCategory(key)}
                            className={`flex-1 min-w-[100px] flex flex-col items-center gap-2 py-4 px-6 transition-colors border-b-2 ${category === key
                                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            <cat.icon className="w-6 h-6" />
                            <span className="text-sm font-medium">{cat.name}</span>
                        </button>
                    ))}
                </div>

                <div className="p-8">
                    <div className="grid md:grid-cols-7 gap-6 items-center">
                        {/* From */}
                        <div className="md:col-span-3 space-y-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Convert From</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full text-3xl font-bold p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <select
                                value={fromUnit}
                                onChange={(e) => setFromUnit(e.target.value)}
                                className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl"
                            >
                                {Object.entries(CATEGORIES[category].units).map(([key, unit]) => (
                                    <option key={key} value={key}>{unit.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Swap Button */}
                        <div className="md:col-span-1 flex justify-center">
                            <button
                                onClick={swap}
                                className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                title="Swap Units"
                            >
                                <ArrowRightLeft className="w-6 h-6 text-gray-600 dark:text-gray-400 md:rotate-0 rotate-90" />
                            </button>
                        </div>

                        {/* To */}
                        <div className="md:col-span-3 space-y-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Convert To</label>
                            <div
                                className="w-full text-3xl font-bold p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30 rounded-xl flex items-center overflow-x-auto"
                            >
                                {Number.isInteger(result) ? result : result.toFixed(6)}
                            </div>
                            <select
                                value={toUnit}
                                onChange={(e) => setToUnit(e.target.value)}
                                className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl"
                            >
                                {Object.entries(CATEGORIES[category].units).map(([key, unit]) => (
                                    <option key={key} value={key}>{unit.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
