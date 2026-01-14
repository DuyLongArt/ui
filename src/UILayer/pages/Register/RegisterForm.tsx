import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AuthenticateFactor } from "../../../OrchestraLayer/StateManager/XState/AuthenticateMachine";
import { useSelector } from "@xstate/react";
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Globe, Eye, EyeOff, ChevronDown } from 'lucide-react';
import type { RegistrationPayload, CountryType } from '../../../DataLayer/Protocol/RegistrationProtocol';

const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, staggerChildren: 0.05, when: "beforeChildren" }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
};

const RegisterForm = () => {
    // Form State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [bio, setBio] = useState('');
    const [country, setCountry] = useState<CountryType>('VietName');

    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [ipAddress, setIpAddress] = useState<string>('unknown');

    const actorRef = AuthenticateFactor.useActorRef();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchIP = async () => {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                if (data.ip) setIpAddress(data.ip);
            } catch (error) {
                console.error('Failed to fetch IP address:', error);
            }
        };
        fetchIP();
    }, []);

    const isLoading = useSelector(actorRef, (snapshot) => snapshot.matches('registering'));
    const errorFromMachine = useSelector(actorRef, (snapshot) => snapshot.context.error);

    const handleRegistration = (event: React.FormEvent) => {
        // IMPROVEMENT: Prevent default at the very start of the logic
        event.preventDefault();
        setValidationError(null);

        if (password !== confirmPassword) {
            setValidationError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setValidationError("Password must be at least 6 characters.");
            return;
        }

        if (!isLoading) {
            const payload: RegistrationPayload = {
                firstName,
                lastName,
                userName: userName || email.split('@')[0],
                email,
                password,
                bio,
                location: country, // Syncing location with country selection
                country,
                role: 'USER' as const,
                device: navigator.userAgent,
                deviceIP: ipAddress
            };
            actorRef.send({ type: "REGISTER", payload });
        }
    };

    // Styling constants - FIXED TEXT COLORS TO BLACK/GRAY
    const inputClasses = "block w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-base";
    const labelClasses = "block text-left text-sm font-bold text-gray-700 mb-2 ml-1";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 p-4 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 w-[140%] h-[140%] -top-[20%] -left-[20%] bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0)_70%)] pointer-events-none" />

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 w-full max-w-2xl">
                <div className="bg-white/95 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-white/40">
                    <motion.div variants={itemVariants} className="text-center">
                        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Create Account</h1>
                        <p className="text-gray-500 mb-10 text-lg">Join our community and start your journey today</p>
                    </motion.div>

                    <form onSubmit={handleRegistration}>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <motion.div variants={itemVariants}>
                                    <label className={labelClasses}>First Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="John" className={inputClasses} />
                                    </div>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <label className={labelClasses}>Last Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Doe" className={inputClasses} />
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div variants={itemVariants}>
                                <label className={labelClasses}>Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@example.com" className={inputClasses} />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label className={labelClasses}>Location</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <select
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value as CountryType)}
                                        className={`${inputClasses} appearance-none cursor-pointer`}
                                    >
                                        <option value="VietName">🇻🇳 Vietnam</option>
                                        <option value="UnitedStates">🇺🇸 United States</option>
                                        <option value="Japan">🇯🇵 Japan</option>
                                        <option value="United Kingdom">🇬🇧 United Kingdom</option>
                                        <option value="OTHER">🌍 Other</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                </div>
                            </motion.div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <motion.div variants={itemVariants}>
                                    <label className={labelClasses}>Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className={inputClasses} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600">
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <label className={labelClasses}>Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="••••••••" className={inputClasses} />
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {(validationError || errorFromMachine) && (
                            <motion.div variants={itemVariants} className="mt-6 p-3 bg-red-50 rounded-xl border border-red-100">
                                <p className="text-red-600 text-sm font-semibold text-center">
                                    {validationError || errorFromMachine}
                                </p>
                            </motion.div>
                        )}

                        <motion.div variants={itemVariants}>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-10 py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-lg font-black rounded-2xl shadow-lg transition-all"
                            >
                                {isLoading ? "Creating Account..." : 'Sign Up'}
                            </button>
                        </motion.div>

                        <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <span className="text-gray-500 text-sm font-medium">Already have an account? </span>
                            <button
                                type="button"
                                onClick={() => navigate('/login/index')}
                                className="text-sm font-black text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                                Sign In
                            </button>
                        </motion.div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterForm;