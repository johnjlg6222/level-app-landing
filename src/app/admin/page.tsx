'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input } from '@/components/common';
import { AmbientBackground } from '@/components/landing';

// Component that uses useSearchParams
function AdminLoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn, user, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for error param in URL
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'unauthorized') {
      setError('Vous n\'avez pas les droits d\'acces administrateur.');
    }
  }, [searchParams]);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!isLoading && user && isAdmin) {
      router.push('/admin/closing');
    }
  }, [user, isAdmin, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        setError('Email ou mot de passe incorrect.');
        setIsSubmitting(false);
        return;
      }

      // If sign-in successful but not admin, the useEffect will handle redirect
      router.push('/admin/closing');
    } catch (err) {
      setError('Une erreur est survenue. Veuillez reessayer.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="font-sans antialiased bg-[#050507] min-h-screen text-white selection:bg-blue-500 selection:text-white relative flex items-center justify-center p-4">
      <AmbientBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#0F1115]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-4">
              <Lock className="w-7 h-7 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Administration</h1>
            <p className="text-gray-400">Connectez-vous pour acceder au formulaire de devis</p>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@level-app.fr"
              icon={<Mail className="w-5 h-5" />}
              required
              autoComplete="email"
            />

            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              icon={<Lock className="w-5 h-5" />}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
              disabled={!email || !password || isSubmitting}
            >
              Se connecter
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Espace reserve aux administrateurs Level App
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Loading fallback
function AdminLoginLoading() {
  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );
}

// Wrap with Suspense for useSearchParams
export default function AdminLoginPage() {
  return (
    <Suspense fallback={<AdminLoginLoading />}>
      <AdminLoginContent />
    </Suspense>
  );
}
