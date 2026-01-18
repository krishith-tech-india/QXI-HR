import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { API_ENDPOINTS } from '@/config/apiConfig';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (result.isSuccess && result.statusCode === 200) {
        sessionStorage.setItem('token', result.data.token);
        sessionStorage.setItem('role', result.data.role);
        toast({
          title: 'Success!',
          description: 'You have been successfully logged in.',
        });
        navigate('/');
      } else {
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((err) => {
            toast({
              title: 'Login Failed',
              description: err.description || 'An unknown error occurred.',
              variant: 'destructive',
            });
          });
        } else {
           toast({
              title: 'Login Failed',
              description: 'Invalid credentials or server error.',
              variant: 'destructive',
            });
        }
      }
    } catch (error) {
      toast({
        title: 'Network Error',
        description: 'Could not connect to the server. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - QXI HR (OPC) PRIVATE LIMITED</title>
        <meta name="description" content="Access your QXI HR account to manage your profile, applications, and connect with our HR services." />
        <meta property="og:title" content="Login - QXI HR (OPC) PRIVATE LIMITED" />
        <meta property="og:description" content="Secure login portal for QXI HR (OPC) PRIVATE LIMITED clients and candidates." />
      </Helmet>

      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-500/20 blur-3xl"
          animate={{ y: [0, 20, 0], x: [0, 12, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gradient-to-tr from-sky-400/25 to-emerald-400/20 blur-3xl"
          animate={{ y: [0, -20, 0], x: [0, -16, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white space-y-6"
          >
            <p className="uppercase tracking-[0.35em] text-xs text-white/60">
              Secure Access
            </p>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold">
              Welcome back to the QXI HR talent portal.
            </h1>
            <p className="text-white/70 max-w-xl">
              Track applications, update your profile, and stay connected with
              opportunities curated for you.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Private workspace for your profile data',
                'Instant access to applied job history',
                'Secure JWT session handling',
                'Priority updates for shortlisted roles',
              ].map((item) => (
                <div
                  key={item}
                  className="bg-white/10 border border-white/20 rounded-xl p-4 text-sm text-white/80 backdrop-blur"
                >
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
            style={{ perspective: 1200 }}
          >
            <motion.div
              whileHover={{ rotateX: 3, rotateY: -3 }}
              transition={{ duration: 0.3 }}
              className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl border border-white/70 p-8"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-400 flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Sign in</h2>
                  <p className="text-sm text-gray-500">Access your dashboard</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full corporate-gradient text-white"
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-sm text-gray-600">
                New applicant?{' '}
                <a href="/signup" className="text-blue-600 hover:text-blue-500">
                  Create an account
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Login;
