"use client";

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import {
  FileImage, FileCode, PlaySquare, ArrowRightLeft,
  QrCode, Mic, FileText, Minimize, Binary, Palette, ArrowRight,
  Braces, KeyRound, Scale, GitCompare, Type, Link2,
  FileEdit, Regex, Zap, Shield, Heart, CheckCircle, Globe, Award,
  Sparkles, Command, Cpu
} from 'lucide-react';

const toolCategories = [
  {
    title: "Media Tools",
    description: "Transform, convert, and animate your media files.",
    tools: [
      { name: 'Image to PDF', description: 'Convert your images to PDF documents instantly.', href: '/tools/image-to-pdf', icon: FileImage, color: 'text-red-500 bg-red-50 dark:bg-red-500/10' },
      { name: 'Image to SVG', description: 'Trace rasters into real SVG vectors.', href: '/tools/image-to-svg', icon: FileCode, color: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10' },
      { name: 'SVG Animator', description: 'Animate SVGs with timeline and export code.', href: '/tools/svg-animator', icon: PlaySquare, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10' },
      { name: 'Image Converter', description: 'Convert between PNG, JPG, and WEBP formats.', href: '/tools/image-converter', icon: ArrowRightLeft, color: 'text-green-500 bg-green-50 dark:bg-green-500/10' },
    ]
  },
  {
    title: "Developer Tools",
    description: "Essential utilities for coding and debugging.",
    tools: [
      { name: 'CSS Minifier', description: 'Minify your CSS code for better performance.', href: '/tools/css-minifier', icon: Minimize, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' },
      { name: 'JSON Formatter', description: 'Validate, format, and minify JSON data.', href: '/tools/json-formatter', icon: Braces, color: 'text-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-500/10' },
      { name: 'Base64 Converter', description: 'Encode and decode Base64 strings easily.', href: '/tools/base64-converter', icon: Binary, color: 'text-violet-500 bg-violet-50 dark:bg-violet-500/10' },
      { name: 'URL Encoder', description: 'Encode and decode URLs safely.', href: '/tools/url-encoder', icon: Link2, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
      { name: 'Markdown Editor', description: 'Write Markdown with real-time preview.', href: '/tools/markdown-editor', icon: FileEdit, color: 'text-zinc-600 bg-zinc-50 dark:text-zinc-400 dark:bg-zinc-500/10', isNew: true },
      { name: 'Regex Tester', description: 'Test regular expressions against text.', href: '/tools/regex-tester', icon: Regex, color: 'text-lime-600 bg-lime-50 dark:bg-lime-500/10', isNew: true },
      { name: 'Diff Checker', description: 'Compare text files side-by-side.', href: '/tools/diff-checker', icon: GitCompare, color: 'text-slate-500 bg-slate-50 dark:bg-slate-500/10' },
    ]
  },
  {
    title: "Utilities & Text",
    description: "Everyday tools for productivity and content.",
    tools: [
      { name: 'Text to Speech', description: 'Convert written text into spoken words.', href: '/tools/text-to-speech', icon: Mic, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-500/10' },
      { name: 'Word Counter', description: 'Count words, characters, and reading time.', href: '/tools/word-counter', icon: FileText, color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
      { name: 'QR Generator', description: 'Generate customizable QR codes for any link.', href: '/tools/qr-generator', icon: QrCode, color: 'text-teal-500 bg-teal-50 dark:bg-teal-500/10' },
      { name: 'Color Picker', description: 'Pick, convert, and generate color palettes.', href: '/tools/color-picker', icon: Palette, color: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10' },
      { name: 'Password Generator', description: 'Generate secure, random passwords.', href: '/tools/password-generator', icon: KeyRound, color: 'text-pink-500 bg-pink-50 dark:bg-pink-500/10' },
      { name: 'Unit Converter', description: 'Convert length, mass, area, and more.', href: '/tools/unit-converter', icon: Scale, color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' },
      { name: 'Lorem Ipsum', description: 'Generate placeholder text.', href: '/tools/lorem-ipsum', icon: Type, color: 'text-gray-500 bg-gray-50 dark:bg-gray-500/10' },
    ]
  }
];

const FloatingIcon = ({ icon: Icon, delay, x, y, size = 6, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0.4, 0.8, 0.4],
      y: [0, -20, 0],
      x: [0, 10, 0]
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
    className={`absolute ${color} p-3 rounded-2xl shadow-lg backdrop-blur-sm z-0 hidden lg:block`}
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <Icon className={`w-${size} h-${size}`} />
  </motion.div>
);

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <div className="overflow-hidden bg-white dark:bg-black selection:bg-blue-500 selection:text-white pt-20" ref={containerRef}>

      {/* New "Cosmic" Hero Section */}
      <div className="relative min-h-[90vh] flex flex-col justify-center items-center pt-10 overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-white to-white dark:from-blue-950/40 dark:via-black dark:to-black" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

        {/* Floating Icons Background */}
        <FloatingIcon icon={FileCode} delay={0} x={15} y={20} color="text-blue-500 bg-blue-100 dark:bg-blue-900/30" />
        <FloatingIcon icon={Palette} delay={1.5} x={80} y={15} color="text-purple-500 bg-purple-100 dark:bg-purple-900/30" />
        <FloatingIcon icon={Zap} delay={2} x={10} y={60} color="text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30" />
        <FloatingIcon icon={Binary} delay={3} x={85} y={55} color="text-green-500 bg-green-100 dark:bg-green-900/30" />
        <FloatingIcon icon={Shield} delay={1} x={25} y={80} color="text-red-500 bg-red-100 dark:bg-red-900/30" />
        <FloatingIcon icon={Cpu} delay={2.5} x={70} y={75} color="text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md shadow-sm mb-8"
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">The Ultimate Developer Toolkit</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-black tracking-tight text-gray-900 dark:text-white mb-8 leading-tight"
          >
            Code Less. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 animate-gradient-x">
              Create More.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Over 20+ powerful, client-side tools designed to supercharge your workflow.
            No logins, no paywalls, just pure utility.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => document.getElementById('search-tools').scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-2xl flex items-center justify-center gap-2"
            >
              <Command className="w-5 h-5" /> Start Building
            </button>
            <Link href="/tools/image-to-pdf" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl font-bold text-lg transition-all backdrop-blur-sm flex items-center justify-center gap-2">
              Try Image to PDF
            </Link>
          </motion.div>
        </div>

        {/* Decorative Blur at Bottom */}
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-white dark:from-black to-transparent z-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" id="search-tools">

        {/* Quick Stats or Trust Indicators could go here */}

        <div className="space-y-32">
          {toolCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-gray-100 dark:border-gray-800 pb-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-3">
                    {idx === 0 && <span className="p-2 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"><FileImage /></span>}
                    {idx === 1 && <span className="p-2 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"><Binary /></span>}
                    {idx === 2 && <span className="p-2 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"><Zap /></span>}
                    {category.title}
                  </h2>
                  <p className="text-lg text-gray-500 dark:text-gray-400">{category.description}</p>
                </div>
                <div className="hidden md:block h-px flex-1 bg-gray-100 dark:bg-gray-800 mx-8" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.tools.map((tool) => (
                  <Link key={tool.href} href={tool.href} className="group relative">
                    {tool.isNew && (
                      <span className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-lg z-10 uppercase tracking-wider">
                        New
                      </span>
                    )}
                    <div className="h-full bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between">
                      <div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${tool.color} group-hover:scale-110 transition-transform duration-300`}>
                          <tool.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {tool.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/50 flex items-center text-xs font-semibold text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        Launch Tool <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-32 rounded-[2.5rem] bg-gradient-to-br from-blue-900 to-black p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to optimize your workflow?</h2>
            <p className="text-blue-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of developers who trust Antigravity for their daily tasks. Free forever.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-3 bg-white text-blue-900 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-white/10"
            >
              Start Using Tools
            </button>
          </div>

          {/* Abstract Background Shapes */}
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" />
        </div>
      </div>
    </div>
  );
}
