import React, { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/solid';

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
        console.log('Form data submitted:', formData);
        alert('Thank you for your message!');
    };

    return (
        <div className="min-h-screen border-2 self-center flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex flex-col md:flex-row">

                    {/* Form Section */}
                    <div className="w-full md:w-1/2 p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-white mb-2">Contact Us</h2>
                        <p className="text-white mb-8">We'd love to hear from you! Please fill out the form below.</p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div>
                                <label className="block text-sm font-medium text-white mb-1" htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-1" htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-1" htmlFor="message">Your Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
                                    placeholder="Write your message here..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all hover:-translate-y-0.5"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Info Section */}
                    <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 md:p-12 text-white flex flex-col justify-center">
                        <h3 className="text-2xl font-bold mb-6">Our Information</h3>
                        <div className="flex flex-col gap-8">

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <EnvelopeIcon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white/90">Email</p>
                                    <p className="text-white/80">contact@example.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <PhoneIcon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white/90">Phone</p>
                                    <p className="text-white/80">+1 (234) 567-890</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <MapPinIcon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white/90">Address</p>
                                    <p className="text-white/80">123 Main Street<br />Anytown, USA</p>
                                </div>
                            </div>

                        </div>

                        {/* Decorational Circle */}
                        <div className="mt-12 p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
                            <p className="text-sm text-white/80 italic">
                                "We are committed to providing value and support. Reach out to us anytime!"
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactPage;

