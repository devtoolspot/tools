"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FileUp, Download, Play, Pause, Plus, Trash2, Code, Copy, Video, Settings, Layout } from 'lucide-react';

const PRESETS = [
    { name: 'Spin', css: `animation: spin 2s linear infinite; transform-box: fill-box; transform-origin: center;`, keyframes: `@keyframes spin { 100% { transform: rotate(360deg); } }` },
    { name: 'Pulse', css: `animation: pulse 1.5s ease-in-out infinite; transform-box: fill-box; transform-origin: center;`, keyframes: `@keyframes pulse { 50% { transform: scale(1.1); } }` },
    { name: 'Bounce', css: `animation: bounce 1s cubic-bezier(0.28, 0.84, 0.42, 1) infinite; transform-box: fill-box; transform-origin: center;`, keyframes: `@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }` },
    { name: 'Fade In', css: `animation: fade-in 2s ease-in forwards;`, keyframes: `@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }` },
    { name: 'Float', css: `animation: float 3s ease-in-out infinite; transform-box: fill-box; transform-origin: center;`, keyframes: `@keyframes float { 50% { transform: translateY(-10px); } }` },
    { name: 'Line Draw', css: `stroke-dasharray: 1; stroke-dashoffset: 1; animation: line-draw 2s ease-in-out forwards;`, keyframes: `@keyframes line-draw { to { stroke-dashoffset: 0; } }`, needsPathLength: true },
    { name: 'Loading Lines', css: `stroke-dasharray: 1; stroke-dashoffset: 1; animation: line-loop 2s ease-in-out infinite;`, keyframes: `@keyframes line-loop { 0% { stroke-dashoffset: 1; } 50% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -1; } }`, needsPathLength: true },
    { name: 'Shake', css: `animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both infinite; transform-box: fill-box; transform-origin: center;`, keyframes: `@keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }` },
    { name: 'Heartbeat', css: `animation: heartbeat 1.5s ease-in-out infinite both; transform-box: fill-box; transform-origin: center;`, keyframes: `@keyframes heartbeat { from { transform: scale(1); transform-origin: center center; animation-timing-function: ease-out; } 10% { transform: scale(0.91); animation-timing-function: ease-in; } 17% { transform: scale(0.98); animation-timing-function: ease-out; } 33% { transform: scale(0.87); animation-timing-function: ease-in; } 45% { transform: scale(1); animation-timing-function: ease-out; } }` },
    { name: 'Color Cycle', css: `animation: color-cycle 4s linear infinite;`, keyframes: `@keyframes color-cycle { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }` },
];

export default function SVGAnimator() {
    const [svgContent, setSvgContent] = useState('');
    const [animations, setAnimations] = useState([]);
    const [viewMode, setViewMode] = useState('split'); // split | preview-top
    const [isRecording, setIsRecording] = useState(false);
    const previewRef = useRef(null);

    // Force pathLength injection
    useEffect(() => {
        if (!previewRef.current) return;
        animations.forEach(anim => {
            const preset = PRESETS.find(p => p.name === anim.presetName);
            if (preset?.needsPathLength) {
                const el = previewRef.current.querySelector(`#${anim.id}`);
                if (el) el.setAttribute('pathLength', '1');
            }
        });
    }, [animations, svgContent]);

    const recordVideo = async () => {
        if (!svgContent || animations.length === 0) return;
        setIsRecording(true);

        const svgOutput = generateOutput();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgOutput, 'image/svg+xml');
        doc.documentElement.setAttribute('width', '800');
        doc.documentElement.setAttribute('height', '600');

        const width = 800;
        const height = 600;
        canvas.width = width;
        canvas.height = height;

        const blob = new Blob([new XMLSerializer().serializeToString(doc)], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise(r => { img.onload = r; img.src = url; });

        const stream = canvas.captureStream(30);
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        const chunks = [];
        recorder.ondataavailable = e => chunks.push(e.data);
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const vidUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = vidUrl;
            a.download = 'animation.webm';
            a.click();
            setIsRecording(false);
            URL.revokeObjectURL(url);
        };

        recorder.start();
        const startTime = performance.now();
        const recordDuration = Math.max(Math.max(...animations.map(a => a.duration + a.delay)) * 1000, 5000);

        const draw = () => {
            if (performance.now() - startTime > recordDuration) {
                recorder.stop();
                return;
            }
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            try { ctx.drawImage(img, 0, 0, width, height); } catch (e) { }
            requestAnimationFrame(draw);
        };
        draw();
    };

    const handleUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setSvgContent(ev.target.result);
                setAnimations([]);
            };
            reader.readAsText(file);
        }
    };

    const handleElementClick = (e) => {
        e.stopPropagation();
        let target = e.target;
        if (target.tagName === 'tspan') target = target.parentElement;
        if (target.closest('.anim-ignore')) return;

        let id = target.id;
        if (!id) {
            id = 'anim-' + Math.random().toString(36).substr(2, 6);
            target.id = id;
            if (previewRef.current) {
                const svgEl = previewRef.current.querySelector('svg');
                if (svgEl) setSvgContent(new XMLSerializer().serializeToString(svgEl));
            }
        }

        const exists = animations.find(a => a.id === id);
        if (!exists) {
            setAnimations([...animations, { id, presetName: 'Spin', duration: 2, delay: 0 }]);
        }
    };

    const updateAnimation = (index, field, value) => {
        const newAnims = [...animations];
        newAnims[index][field] = value;
        setAnimations(newAnims);
    };

    const removeAnimation = (index) => {
        setAnimations(animations.filter((_, i) => i !== index));
    };

    const generateOutput = () => {
        if (!previewRef.current) return '';
        const clone = previewRef.current.cloneNode(true);
        const svg = clone.querySelector('svg');
        if (!svg) return '';

        let css = '';
        const usedKeyframes = new Set();

        animations.forEach(anim => {
            const preset = PRESETS.find(p => p.name === anim.presetName);
            if (preset) {
                const uniqueName = `anim-${anim.presetName.toLowerCase().replace(/\s/g, '-')}-${anim.id}`;
                const scopedKeyframes = preset.keyframes.replace(/@keyframes\s+([a-zA-Z0-9_-]+)/, `@keyframes ${uniqueName}`);
                usedKeyframes.add(scopedKeyframes);

                const el = svg.getElementById(anim.id);
                if (el) {
                    el.classList.add(`anim-${anim.id}`);
                    if (preset.needsPathLength && ['path', 'line', 'polyline', 'circle', 'rect'].includes(el.tagName)) {
                        el.setAttribute('pathLength', '1');
                    }
                }

                let rule = `.${`anim-${anim.id}`} { 
                            animation: ${uniqueName} ${anim.duration}s infinite; 
                            animation-delay: ${anim.delay}s; 
                            animation-timing-function: ease-in-out;
                            transform-box: fill-box; 
                            transform-origin: center; 
                        }`;
                if (preset.css.includes('stroke-dasharray')) {
                    rule = `.${`anim-${anim.id}`} {
                                 ${preset.css.replace(/animation:\s*[^;]+;/, `animation: ${uniqueName} ${anim.duration}s infinite;`)}
                                 animation-delay: ${anim.delay}s;
                             }`;
                }
                css += rule + '\n';
            }
        });

        const styleEl = document.createElement('style');
        styleEl.textContent = `${Array.from(usedKeyframes).join('\n')}\n${css}`;
        svg.insertBefore(styleEl, svg.firstChild);
        return new XMLSerializer().serializeToString(svg);
    };

    const download = () => {
        const output = generateOutput();
        const blob = new Blob([output], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'animated.svg';
        link.click();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 pb-8 pt-40">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Advanced SVG Animator</h1>
                    <p className="text-gray-600 dark:text-gray-400">Animate specific elements or entire SVG.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setViewMode(viewMode === 'split' ? 'preview-top' : 'split')} className="p-2 border rounded-lg hover:bg-gray-100 flex items-center gap-2 text-sm">
                        <Layout className="w-4 h-4" /> Toggle Layout
                    </button>
                    {!svgContent && (
                        <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                            <FileUp className="w-4 h-4" /> Upload SVG
                            <input type="file" accept=".svg" className="hidden" onChange={handleUpload} />
                        </label>
                    )}
                </div>
            </div>

            <div className={`grid gap-8 ${viewMode === 'preview-top' ? 'grid-cols-1' : 'lg:grid-cols-3'}`}>

                {/* Preview Area - Conditional Layout */}
                <div className={`${viewMode === 'preview-top' ? 'w-full h-[500px]' : 'lg:col-span-2 h-[600px]'} bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col order-1`}>
                    {!svgContent ? (
                        <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-500">
                            <p>Upload an SVG to start animating</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-hidden relative group">
                            <div className="absolute top-4 left-4 z-10 bg-black/70 text-white text-xs px-3 py-1 rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
                                Click elements to animate
                            </div>
                            <div className="w-full h-full flex items-center justify-center bg-[#f0f0f0] dark:bg-[#111]"
                                style={{ backgroundImage: 'radial-gradient(#999 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                            >
                                <style>
                                    {animations.map(anim => {
                                        const preset = PRESETS.find(p => p.name === anim.presetName);
                                        if (!preset) return '';
                                        const uniqueName = `anim-${anim.presetName.toLowerCase().replace(/\s/g, '-')}-${anim.id}`;
                                        const scopedKeyframes = preset.keyframes.replace(/@keyframes\s+([a-zA-Z0-9_-]+)/, `@keyframes ${uniqueName}`);
                                        let overrides = '';
                                        if (preset.css.includes('stroke-dasharray')) overrides = preset.css.replace(/animation:\s*[^;]+;/, '');
                                        return `
                                            ${scopedKeyframes}
                                            #${anim.id} {
                                                animation: ${uniqueName} ${anim.duration}s infinite;
                                                animation-delay: ${anim.delay}s;
                                                animation-timing-function: ease-in-out;
                                                transform-box: fill-box;
                                                transform-origin: center;
                                                filter: drop-shadow(0 0 2px rgba(37, 99, 235, 0.5));
                                                ${overrides}
                                                ${preset.needsPathLength ? 'stroke-dasharray: 1; stroke-dashoffset: 1;' : ''}
                                            }
                                        `;
                                    }).join('\n')}
                                </style>
                                <div
                                    ref={previewRef}
                                    className="w-full h-full p-8 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full"
                                    dangerouslySetInnerHTML={{ __html: svgContent }}
                                    onClick={handleElementClick}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls Area */}
                <div className={`${viewMode === 'preview-top' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'lg:col-span-1 space-y-6'} order-2`}>

                    {/* Animations List */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <h3 className="font-semibold mb-4 flex justify-between items-center">
                            Animations <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{animations.length}</span>
                        </h3>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                            {animations.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-4">No animations added.</p>
                            ) : (
                                animations.map((anim, idx) => (
                                    <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-mono font-medium text-gray-500">#{anim.id}</span>
                                            <button onClick={() => removeAnimation(idx)} className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                        <div>
                                            <select
                                                value={anim.presetName}
                                                onChange={(e) => updateAnimation(idx, 'presetName', e.target.value)}
                                                className="w-full text-sm p-1.5 rounded border bg-white dark:bg-gray-900"
                                            >
                                                {PRESETS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="number" step="0.1" placeholder="Dur"
                                                value={anim.duration}
                                                onChange={(e) => updateAnimation(idx, 'duration', e.target.value)}
                                                className="text-sm p-1 rounded border bg-white dark:bg-gray-900"
                                            />
                                            <input
                                                type="number" step="0.1" placeholder="Dly"
                                                value={anim.delay}
                                                onChange={(e) => updateAnimation(idx, 'delay', e.target.value)}
                                                className="text-sm p-1 rounded border bg-white dark:bg-gray-900"
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                        <button
                            onClick={download}
                            disabled={animations.length === 0}
                            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center gap-2 font-medium shadow-lg shadow-green-500/20 disabled:opacity-50"
                        >
                            <Download className="w-5 h-5" /> Download SVG
                        </button>
                        <button
                            onClick={recordVideo}
                            disabled={animations.length === 0 || isRecording}
                            className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium disabled:opacity-50 transition-colors ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-800 text-white hover:bg-gray-900'}`}
                        >
                            {isRecording ? 'Recording...' : <><Video className="w-5 h-5" /> Export Video</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
