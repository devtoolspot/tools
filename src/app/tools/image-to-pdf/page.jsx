"use client";

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { motion } from 'framer-motion';
import { FileUp, Trash2, Download, FileImage, Settings } from 'lucide-react';

export default function ImageToPDF() {
    const [images, setImages] = useState([]);
    const [isHovering, setIsHovering] = useState(false);
    const [converting, setConverting] = useState(false);

    const handleImageUpload = (e) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files).map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                file,
                preview: URL.createObjectURL(file)
            }));
            setImages([...images, ...newImages]);
        }
    };

    const removeImage = (id) => {
        setImages(images.filter(img => img.id !== id));
    };

    const convertToPDF = async () => {
        if (images.length === 0) return;
        setConverting(true);

        try {
            const doc = new jsPDF();

            for (let i = 0; i < images.length; i++) {
                if (i > 0) doc.addPage();

                const img = images[i];
                const imgData = await readFileAsDataURL(img.file);

                const imgProps = doc.getImageProperties(imgData);
                const pdfWidth = doc.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                doc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            }

            doc.save('converted-images.pdf');
        } catch (error) {
            console.error('Conversion failed', error);
            alert('Failed to convert images. Please try again.');
        } finally {
            setConverting(false);
        }
    };

    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 pb-8 pt-40">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Image to PDF Converter</h1>
                <p className="text-gray-600 dark:text-gray-400">Combine multiple images into a single PDF document.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8">
                {/* Upload Area */}
                <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isHovering ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'
                        }`}
                    onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
                    onDragLeave={() => setIsHovering(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsHovering(false);
                        if (e.dataTransfer.files) {
                            const newImages = Array.from(e.dataTransfer.files)
                                .filter(file => file.type.startsWith('image/'))
                                .map(file => ({
                                    id: Math.random().toString(36).substr(2, 9),
                                    file,
                                    preview: URL.createObjectURL(file)
                                }));
                            setImages([...images, ...newImages]);
                        }
                    }}
                >
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        id="image-input"
                        onChange={handleImageUpload}
                    />
                    <label htmlFor="image-input" className="cursor-pointer flex flex-col items-center gap-4">
                        <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                            <FileUp className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">Click or drag images here</p>
                            <p className="text-sm text-gray-500 mt-1">Supports JPG, PNG, WEBP</p>
                        </div>
                    </label>
                </div>

                {/* Image Grid */}
                {images.length > 0 && (
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((img, index) => (
                            <motion.div
                                key={img.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative group aspect-[3/4] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
                            >
                                <img src={img.preview} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => removeImage(img.id)}
                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                    Page {index + 1}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Action Bar */}
                <div className="mt-8 flex justify-end gap-4 border-t border-gray-100 dark:border-gray-800 pt-6">
                    <button
                        onClick={() => setImages([])}
                        disabled={images.length === 0}
                        className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium disabled:opacity-50"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={convertToPDF}
                        disabled={images.length === 0 || converting}
                        className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {converting ? (
                            <>Converting...</>
                        ) : (
                            <>
                                <Download className="w-5 h-5" />
                                Convert to PDF
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
