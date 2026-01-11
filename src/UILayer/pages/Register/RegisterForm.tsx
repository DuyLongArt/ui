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
        transition: {
            duration: 0.4,
            staggerChildren: 0.05,
            when: "beforeChildren"
        }
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
    const [location, setLocation] = useState('VietName');
    const [country, setCountry] = useState<CountryType>('VietName');

    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [ipAddress, setIpAddress] = useState<string>('unknown');

    const actorRef = AuthenticateFactor.useActorRef();
    const navigate = useNavigate();

    // Fetch IP Address
    useEffect(() => {
        const fetchIP = async () => {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                if (data.ip) {
                    setIpAddress(data.ip);
                }
            } catch (error) {
                console.error('Failed to fetch IP address:', error);
                // Keep default 'unknown'
            }
        };

        fetchIP();
    }, []);

    // Derive State from XState Machine
    const isLoading = useSelector(actorRef, (snapshot) => snapshot.matches('registering'));
    const errorFromMachine = useSelector(actorRef, (snapshot) => snapshot.context.error);
    const isFailed = !!errorFromMachine;

    const submitEvent = (event: React.FormEvent) => {
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
                firstName: firstName,
                lastName: lastName,
                userName: userName || email.split('@')[0],
                email: email,
                password: password,
                bio: bio,
                location: location,
                country: country,
                role: 'USER' as const,
                device: navigator.userAgent,
                deviceIP: ipAddress
            };

            actorRef.send({ type: "REGISTER", payload });
        }
    };

    const handleLoginClick = () => {
        navigate('/login/index');
    };

    const inputClasses = "block w-full pl-11 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-base";
    const labelClasses = "block text-left text-sm font-bold text-gray-700 mb-2 ml-1";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 p-4 sm:p-8 relative overflow-hidden">
            {/* Abstract Background Glow */}
            <div className="absolute inset-0 w-[140%] h-[140%] -top-[20%] -left-[20%] bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0)_70%)] pointer-events-none" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 w-full max-w-2xl"
            >
                <div className="bg-white/95 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-white/40 text-center">
                    <motion.div variants={itemVariants}>
                        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
                            Create Account
                        </h1>
                        <p className="text-gray-600 mb-10 text-lg">
                            Join our community and start your journey today
                        </p>
                    </motion.div>

                    <form onSubmit={submitEvent}>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                                <motion.div variants={itemVariants} className="group relative">
                                    <label className={labelClasses}>First Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                            placeholder="John"
                                            className={inputClasses}
                                        />
                                    </div>
                                </motion.div>
                                <motion.div variants={itemVariants} className="group relative">
                                    <label className={labelClasses}>Last Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                            placeholder="Doe"
                                            className={inputClasses}
                                        />
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div variants={itemVariants} className="group relative text-left">
                                <label className={labelClasses}>Username</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        required
                                        placeholder="johndoe"
                                        className={inputClasses}
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="group relative text-left">
                                <label className={labelClasses}>Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="name@example.com"
                                        className={inputClasses}
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="group relative text-left">
                                <label className={labelClasses}>Bio</label>
                                <div className="relative">
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        rows={3}
                                        placeholder="Tell us a bit about yourself..."
                                        className="block w-full px-4 py-4 bg-white border-2 border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-base resize-none"
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="group relative text-left">
                                <label className={labelClasses}>Location</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Globe className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <select
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value as CountryType)}
                                        className="block w-full pl-11 pr-10 py-4 bg-white border-2 border-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-base appearance-none cursor-pointer"
                                    >
                                        <option value="VietName">🇻🇳 Vietnam</option>
                                        <option value="UnitedStates">🇺🇸 United States</option>
                                        <option value="Japan">🇯🇵 Japan</option>
                                        <option value="United Kingdom">🇬🇧 United Kingdom</option>
                                        <option value="Canada">🇨🇦 Canada</option>
                                        <option value="Australia">🇦🇺 Australia</option>
                                        <option value="Singapore">🇸🇬 Singapore</option>
                                        <option value="OTHER">🌍 Other</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <ChevronDown className="h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                            </motion.div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                                <motion.div variants={itemVariants} className="group relative">
                                    <label className={labelClasses}>Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="••••••••"
                                            className={inputClasses}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </motion.div>
                                <motion.div variants={itemVariants} className="group relative">
                                    <label className={labelClasses}>Confirm Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            placeholder="••••••••"
                                            className={inputClasses}
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {(validationError || isFailed) && (
                            <motion.div variants={itemVariants} className="mt-6">
                                <p className="text-red-500 text-sm font-semibold">
                                    {validationError || errorFromMachine || "Registration failed. Please try again."}
                                </p>
                            </motion.div>
                        )}

                        <motion.div variants={itemVariants}>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-10 py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-lg font-black rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : 'Sign Up'}
                            </button>
                        </motion.div>

                        <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-gray-100/80 text-center">
                            <span className="text-gray-500 text-sm font-medium">
                                Already have an account?{' '}
                            </span>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLoginClick();
                                }}
                                className="text-sm font-black text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
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
