import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, User, AtSign } from 'lucide-react';
import LiquidGlassCard from '../../../components/LiquidGlassCard';

/**
 * ContactPage - Refined Flat Glass Design
 * 
 * featuring high-contrast glass inputs and a premium minimalist aesthetic.
 */
const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Signal transmitted:', formData);
        alert('Signal Received. We will respond shortly.');
    };

    return (
        <div className="min-h-screen bg-[#0a0a14] text-white p-6 md:p-10 lg:p-14 overflow-hidden relative selection:bg-indigo-500/30">
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 15, repeat: Infinity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-indigo-600/10 rounded-full blur-[160px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto h-full flex flex-col gap-12">
                <header className="text-center space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-linear-to-b from-white to-white/40 bg-clip-text text-transparent">Connect.</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-xs">Establish a secure communication channel</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                    {/* Information Section */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <LiquidGlassCard containerClassName="h-full" className="p-10 border-white/10" blobColor="bg-indigo-500/20">
                            <h3 className="text-2xl font-black mb-10 tracking-tight">Direct Feed</h3>
                            <div className="space-y-12">
                                <div className="flex items-start gap-5 group">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-indigo-500/20 transition-colors">
                                        <Mail size={22} className="text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Email</p>
                                        <p className="text-sm font-bold text-white/90">hello@duylong.art</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5 group">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-indigo-500/20 transition-colors">
                                        <Phone size={22} className="text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Secure Line</p>
                                        <p className="text-sm font-bold text-white/90">+84 (System) Private</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5 group">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-indigo-500/20 transition-colors">
                                        <MapPin size={22} className="text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Coordinates</p>
                                        <p className="text-sm font-bold text-white/90">Ho Chi Minh City, VN</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 p-6 rounded-3xl bg-white/5 border border-white/5 italic text-slate-500 text-xs leading-relaxed">
                                "Encrypted communication ensures your signals remain private and authenticated within our mainframe."
                            </div>
                        </LiquidGlassCard>
                    </div>

                    {/* Form Section */}
                    <div className="lg:col-span-8">
                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-6xl p-8 md:p-14 shadow-2xl h-full">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                            <User size={12} /> Identity
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your full name"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all placeholder:text-slate-700"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                            <AtSign size={12} /> Contact Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="you@domain.com"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all placeholder:text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                        <MessageSquare size={12} /> Transmit Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Type your transmission here..."
                                        required
                                        rows={6}
                                        className="w-full bg-white/5 border border-white/10 rounded-4xl px-6 py-5 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all resize-none placeholder:text-slate-700"
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_25px_50px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-3"
                                >
                                    Transmit Signal <Send size={16} />
                                </motion.button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
