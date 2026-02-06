import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AuthenticateFactor } from "../../../OrchestraLayer/StateManager/XState/AuthenticateMachine";
import { useSelector } from "@xstate/react";
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import LiquidGlassCard from '@/UILayer/components/LiquidGlassCard';

// Utility function to set a cookie for the JWT
const setAuthCookie = (jwt: string) => {
  if (!jwt) return;
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);
  document.cookie = `auth_jwt=${jwt}; expires=${expiryDate.toUTCString()}; path=/;Secure;  SameSite=Lax`;
};

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/login/register');
    // window.location.href = '/login/register';
  };

  const actorRef = AuthenticateFactor.useActorRef();

  // Derive State from XState Machine
  const currentState = useSelector(actorRef, (snapshot) => snapshot.value);
  const jwt = useSelector(actorRef, (snapshot) => snapshot.context.jwt);
  const isLoading = useSelector(actorRef, (snapshot) => snapshot.matches('authenticating'));
  const error = useSelector(actorRef, (snapshot) => snapshot.context.error);

  // Handle Login Submission
  const submitEvent = (event: React.FormEvent) => {
    event.preventDefault();

    if (!isLoading) {
      actorRef.send({ type: "SUBMIT", username, password, token: "" } as any);
    }
  };

  // Cookie Saving and Error Reset Logic
  useEffect(() => {
    if (currentState === 'onLogin' && jwt) {
      setAuthCookie(jwt);
    }
  }, [currentState, jwt]);



  return (
    <div className="min-h-screen flex items-center justify-center  relative overflow-hidden">
      {/* Abstract Background Glow */}
      <LiquidGlassCard className='backdrop-blur-[200px] opacity-80'>


        <div className="absolute inset-0 w-[140%] h-[140%] -top-[20%] -left-[20%] bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0)_70%)] pointer-events-none" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-md"
        >

          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-black text-black mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-black mb-10 text-lg">
              Sign in to manage your account
            </p>
          </motion.div>

          <form onSubmit={submitEvent} className="space-y-6">
            <motion.div variants={itemVariants} className="relative group">
              <label className="block text-left text-sm font-bold text-black mb-2 ml-1">
                Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-black group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter email or username"
                  className="block w-full pl-11 pr-4 py-4 border-2 border-gray-100 rounded-2xl text-white placeholder-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-base"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative group">
              <label className="block text-left text-sm font-bold text-white mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-12 py-4 border-2 border-gray-100 rounded-2xl text-white placeholder-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white hover:text-white active:text-indigo-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </motion.div>


            {error && (
              <motion.div variants={itemVariants}>
                <p className="text-red-500 text-sm font-semibold">
                  {error}
                </p>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-lg font-black rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-gray-100/80 text-center">
            <span className="text-indigo-700 text-sm font-medium">
              Don't have an account?{' '}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleRegisterClick();
              }}
              className="text-sm font-black text-white hover:text-indigo-700 hover:underline transition-colors"
            >
              Sign Up
            </button>
          </motion.div>

        </motion.div>
      </LiquidGlassCard>
    </div>
  );
};

export default LoginForm;