import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, Shield, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const SystemAdminRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Admin' // Hardcoded for this specific page
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('/auth/register', formData);
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful',
                text: 'System Admin account created. Redirecting to login...',
                timer: 3000,
                showConfirmButton: false,
                background: '#fff',
                color: '#0f172a',
                iconColor: '#0ea5e9',
                customClass: {
                    popup: 'rounded-[2.5rem] shadow-2xl border border-slate-100'
                }
            });
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: err.response?.data?.error || 'Registration failed. Please try again.',
                background: '#fff',
                color: '#0f172a',
                confirmButtonColor: '#0ea5e9',
                customClass: {
                    popup: 'rounded-[2.5rem] shadow-2xl border border-slate-100'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
                <div className="w-full p-10 md:p-14">
                    <Link to="/" className="inline-flex items-center text-obs-blue font-bold mb-8 group">
                        <Shield className="w-5 h-5 mr-2" />
                        <span>OBS BANK</span>
                    </Link>

                    <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">System Admin</h2>
                    <p className="text-slate-500 mb-10 font-medium">Create a master administrative account</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-obs-blue transition-colors" />
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:border-obs-blue/30 focus:bg-white transition-all font-medium"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Admin Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-obs-blue transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:border-obs-blue/30 focus:bg-white transition-all font-medium"
                                    placeholder="admin@obs.bank"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-obs-blue transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:border-obs-blue/30 focus:bg-white transition-all font-medium"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-obs-blue text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-slate-900/10"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Register System Admin</span>
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-slate-500 font-medium">
                        Already have an account? <Link to="/login" className="text-obs-blue font-bold hover:underline">Login here</Link>
                    </p>
                </div >
            </div >
            {/* Footer */}
            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                <p className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest leading-none">2026 Online Banking application/Developed NITHIN K A</p>
            </div>
        </div >
    );
};

export default SystemAdminRegister;
