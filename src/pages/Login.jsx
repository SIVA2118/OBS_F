import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, Home } from 'lucide-react';
import Swal from 'sweetalert2';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: 'Welcome back to OBS Bank!',
                timer: 2000,
                showConfirmButton: false,
                background: '#0f172a',
                color: '#fff',
                iconColor: '#0ea5e9',
                customClass: {
                    popup: 'rounded-[1.5rem] border border-white/10 backdrop-blur-xl'
                }
            });
            navigate('/direct');
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: err.response?.data?.error || 'Please check your credentials.',
                background: '#0f172a',
                color: '#fff',
                confirmButtonColor: '#0ea5e9',
                customClass: {
                    popup: 'rounded-[1.5rem] border border-white/10 backdrop-blur-xl'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-obs-dark px-4 py-12 relative">
            <Link to="/" className="absolute top-6 left-6 sm:top-8 sm:left-8 text-slate-400 hover:text-white flex items-center gap-2 transition-colors group">
                <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                <span className="font-medium hidden sm:inline">Back to Home</span>
            </Link>
            <div className="max-w-md w-full backdrop-blur-lg bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20">
                <div className="text-center mb-8">
                    <div className="mx-auto bg-obs-blue/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8 text-obs-blue" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-slate-300">Sign in to manage your finances</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-obs-blue/50 focus:border-obs-blue transition-all"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-obs-blue/50 focus:border-obs-blue transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-obs-blue hover:bg-sky-400 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                        {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <p className="mt-6 text-center text-slate-400">
                    Don't have an account? <Link to="/register" className="text-obs-blue hover:text-sky-400 font-medium transition-colors">Sign up</Link>
                </p>
            </div>
            {/* Footer */}
            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                <p className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest leading-none">2026 Online Banking application/Developed NITHIN K A</p>
            </div>
        </div>
    );
};

export default Login;
