import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Smartphone, ChevronRight } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="bg-gradient-to-br from-obs-blue to-sky-400 p-2 rounded-xl text-white shadow-lg shadow-sky-500/30 group-hover:scale-105 transition-transform">
                            <Zap className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                            OBS Banking
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="hidden md:block text-slate-600 hover:text-obs-blue font-medium transition-colors">
                            Dashboard
                        </Link>
                        <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium transition-colors px-4 py-2">
                            Sign In
                        </Link>
                        <Link to="/register" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 transform">
                            Open Account
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-sky-200/40 rounded-full blur-[100px] opacity-70 animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[500px] h-[500px] bg-obs-blue/20 rounded-full blur-[80px] opacity-70"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-100 text-sky-700 font-medium text-sm mb-8 shadow-sm">
                                <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse"></span>
                                Welcome to the Future of Banking
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                                Banking made <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-obs-blue to-sky-400">
                                    beautifully simple.
                                </span>
                            </h1>
                            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl">
                                Experience seamless money transfers, real-time tracking, and bank-grade security all in one gorgeous application. Your finances, elevated.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/register" className="inline-flex justify-center items-center gap-2 bg-obs-blue hover:bg-sky-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:-translate-y-1 group">
                                    Get Started Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/login" className="inline-flex justify-center items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-semibold text-lg transition-all hover:border-slate-300">
                                    Sign In to Account
                                </Link>
                            </div>

                            <div className="mt-12 flex items-center gap-8 text-sm font-medium text-slate-500">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-green-500" />
                                    Fdic Insured
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map(i => (
                                            <img key={i} className="w-8 h-8 rounded-full border-2 border-white" src={`https://i.pravatar.cc/100?img=${i}`} alt="User" />
                                        ))}
                                    </div>
                                    <span>10k+ Users</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative hidden lg:block perspective-1000">
                            {/* App Mockup */}
                            <div className="relative w-full max-w-md mx-auto aspect-[9/19] bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl shadow-obs-blue/20 rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-all duration-700 ease-out transform-gpu">
                                <div className="absolute top-0 w-full h-8 flex justify-center pt-2 z-20">
                                    <div className="w-1/3 h-6 bg-black rounded-b-3xl"></div>
                                </div>
                                <div className="w-full h-full bg-slate-50 rounded-[2rem] overflow-hidden relative border border-slate-800">
                                    {/* Mockup Content */}
                                    <div className="h-40 bg-gradient-to-br from-obs-dark to-slate-800 p-6 text-white">
                                        <p className="opacity-80 text-sm mt-4">Total Balance</p>
                                        <p className="text-3xl font-bold mt-1">$24,562.00</p>
                                    </div>
                                    <div className="p-4 relative top-[-20px]">
                                        <div className="bg-white rounded-2xl shadow-lg p-4 flex justify-around mb-6">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center"><ArrowRight className="w-5 h-5 -rotate-45" /></div>
                                                <span className="text-xs font-medium">Send</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><ArrowRight className="w-5 h-5 rotate-135" /></div>
                                                <span className="text-xs font-medium">Receive</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-slate-800 text-sm mb-3">Recent Activity</h4>
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse"></div>
                                                        <div className="space-y-2">
                                                            <div className="w-20 h-2 bg-slate-200 rounded animate-pulse"></div>
                                                            <div className="w-12 h-2 bg-slate-100 rounded animate-pulse"></div>
                                                        </div>
                                                    </div>
                                                    <div className="w-12 h-3 bg-slate-200 rounded animate-pulse"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Element 1 */}
                            <div className="absolute -left-12 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce-slow">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">Transfer Success</p>
                                        <p className="text-[10px] text-slate-500">Just now</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to manage your money</h2>
                        <p className="text-lg text-slate-600">We've built a platform that puts you in control, with elegant tools designed for the modern user.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow group">
                            <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Lightning Fast</h3>
                            <p className="text-slate-600 leading-relaxed">Send and receive money instantly. No more waiting days for funds to clear.</p>
                        </div>

                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow group">
                            <div className="w-14 h-14 bg-obs-blue/10 text-obs-blue rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Bank-Grade Security</h3>
                            <p className="text-slate-600 leading-relaxed">Your data is fully encrypted and protected by the latest security standards.</p>
                        </div>

                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow group">
                            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Smartphone className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Beautiful Interface</h3>
                            <p className="text-slate-600 leading-relaxed">A joy to use every day, with a premium design that updates in real-time.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Staff Portal Section */}
            <div className="py-20 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-obs-blue/10 rounded-full blur-[100px]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-obs-blue/20 text-obs-blue text-xs font-bold mb-4 uppercase tracking-wider">
                                Staff Portal
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Are you an OBS Administrator?</h2>
                            <p className="text-slate-400 max-w-lg">Access the secure staff dashboard to manage applications, review KYC documents, and oversee bank operations.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                            <Link to="/login" className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all text-center w-full sm:w-auto">
                                Staff Login
                            </Link>
                            <Link to="/system-admin/register" className="text-white/60 hover:text-white text-sm font-medium transition-colors">
                                Register as System Admin
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simple Footer */}
            <footer className="py-12 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-obs-blue" />
                        <span className="font-bold text-slate-800">OBS Banking System</span>
                    </div>
                    <p className="text-slate-400 text-sm">2026 Online Banking application/Developed NITHIN K A</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
