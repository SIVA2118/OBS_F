import { useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';
import {
    LayoutDashboard,
    History,
    Settings,
    User as UserIcon,
    CreditCard,
    ArrowRightLeft,
    Bell,
    MessageSquare,
    ChevronDown,
    MoreVertical,
    Search,
    Menu,
    LogOut,
    Wallet,
    Info,
    ChevronRight,
    Star,
    X,
    Printer,
    Library,
    Zap,
    Cpu,
    Shield,
    RotateCw,
    TrendingUp,
    Fingerprint,
    CheckCircle,
    Activity,
    Filter,
    Lock,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Globe,
    Briefcase,
    FileText
} from 'lucide-react';

const Dashboard = () => {
    const { user, logout, setUser } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isPassbookOpen, setIsPassbookOpen] = useState(false);
    const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);
    const [directTransfer, setDirectTransfer] = useState(false);
    const [activeCardModal, setActiveCardModal] = useState(null); // null, 'debit', or 'credit'
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [activeFormRequest, setActiveFormRequest] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const fetchProfile = useCallback(async () => {
        try {
            const res = await axios.get('/auth/me');
            setUser(res.data);
        } catch (err) {
            console.error('Failed to fetch profile', err);
        }
    }, [setUser]);

    const fetchData = useCallback(async () => {
        try {
            await fetchProfile();
            const res = await axios.get('/transactions/history');
            setHistory(res.data);
        } catch (err) {
            console.error('Failed to fetch history', err);
        } finally {
            setLoading(false);
        }
    }, [fetchProfile]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const hasDebit = user?.cardDetails?.debitCard?.isActive;
    const hasCredit = user?.cardDetails?.creditCard?.isActive;
    const hasPassbook = user?.passbookIssued;

    const historicalData = (history) => {
        if (history && history.length > 0) {
            return history.slice(0, 6).map(tx => ({
                name: tx.receiver?._id === user?._id ? (tx.sender?.name || 'Inbound Sync') : (tx.receiver?.name || 'Outbound Sync'),
                date: new Date(tx.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }),
                amount: tx.amount?.toLocaleString(),
                isNegative: tx.sender?._id === user?._id || tx.sender === user?._id
            }));
        }
        return [
            { name: 'Quant Core', date: '24 FEB 2024', amount: '142,000' },
            { name: 'Reserve Node', date: '22 FEB 2024', amount: '92,500' },
            { name: 'System Sync', date: '20 FEB 2024', amount: '12,400' },
            { name: 'Temporal Ref', date: '19 FEB 2024', amount: '8,200' },
        ];
    };

    const recentTx = historicalData(history);

    const closeAllModals = () => {
        setIsTransactionsOpen(false);
        setDirectTransfer(false);
        setActiveCardModal(null);
        setIsProfileOpen(false);
        setIsAppointmentModalOpen(false);
        setActiveFormRequest(null);
    };

    if (user?.status === 'pending') {
        return (
            <div className="flex h-screen bg-[#050b1a] font-sans text-slate-300 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-obs-blue/5 to-transparent pointer-events-none"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-obs-blue/10 rounded-full blur-[120px] pointer-events-none"></div>

                <main className="flex-1 flex flex-col items-center justify-center p-10 relative z-10">
                    <div className="max-w-2xl w-full space-y-12 text-center animate-in zoom-in-95 duration-1000">
                        <div className="relative inline-block">
                            <div className="absolute -inset-8 bg-obs-blue/20 rounded-full blur-3xl animate-pulse"></div>
                            <div className="relative p-8 bg-[#0a1226] rounded-[2.5rem] border border-obs-blue/30 shadow-2xl">
                                <Shield className="w-16 h-16 text-obs-blue animate-spin-slow" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-[14px] font-black text-obs-blue uppercase tracking-[0.6em]">Protocol Initialization</h2>
                            <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">Waiting for <span className="text-obs-blue">Sync Approval</span></h1>
                        </div>

                        <div className="bg-[#0a1226]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 space-y-6 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-obs-blue/5 rounded-full blur-2xl group-hover:bg-obs-blue/10 transition-all"></div>

                            <div className="flex flex-col gap-4 text-left">
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="p-2 bg-obs-blue/20 rounded-lg">
                                        <Activity className="w-4 h-4 text-obs-blue" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase">Entity Status</p>
                                        <p className="text-sm font-black text-white italic uppercase">{user?.name} - NODE_PENDING</p>
                                    </div>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Your secure financial identity is currently being synchronized with the <span className="text-obs-blue font-bold">Nova Sovereign Network</span>. This protocol verification typically completes within 24 standard cycles.
                                </p>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Support Protocol</p>
                                    <p className="text-[10px] font-black text-obs-blue uppercase">contact_ops@obs_nova.net</p>
                                </div>
                                <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl border border-rose-500/20 transition-all">
                                    <LogOut size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Terminate</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-obs-blue animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-obs-blue animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-obs-blue animate-bounce"></div>
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Synchronizing Ledger...</span>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#050b1a] font-sans text-slate-300 overflow-hidden relative">
            {/* Sidebar Overlay for Mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 bg-[#0a1226]/95 lg:bg-[#0a1226]/80 backdrop-blur-xl transition-all duration-500 flex flex-col border-r border-white/5 shadow-[20px_0_40px_rgba(0,0,0,0.4)] z-50 ${sidebarOpen ? 'w-80' : 'w-24'
                } ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-8 flex items-center gap-4 border-b border-white/5 bg-gradient-to-r from-obs-blue/20 to-transparent">
                    <div className="bg-obs-blue/20 p-2.5 rounded-2xl border border-obs-blue/30 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                        <Cpu className="w-6 h-6 text-obs-blue animate-pulse" />
                    </div>
                    <h1 className={`font-black text-xl tracking-tighter text-white transition-all duration-500 whitespace-nowrap overflow-hidden ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                        OBS <span className="text-obs-blue">NOVA</span>
                    </h1>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar-dark px-4 py-10">
                    <nav className="space-y-4">
                        <SidebarLink icon={<LayoutDashboard size={20} />} label="CORE CENTER" active isOpen={sidebarOpen} />
                        <SidebarLink icon={<History size={20} />} label="LEDGER LOGS" isOpen={sidebarOpen} />
                        <SidebarLink
                            icon={<ArrowRightLeft size={20} />}
                            label="TRANSACTIONS"
                            isOpen={sidebarOpen}
                            onClick={() => setIsTransactionsOpen(true)}
                        />

                        {/* Dynamic Sidebar Links for Assets */}
                        {hasPassbook && (
                            <SidebarLink
                                icon={<Library size={20} />}
                                label="E-PASSBOOK"
                                isOpen={sidebarOpen}
                                onClick={() => setIsPassbookOpen(true)}
                                className="text-emerald-400 group-hover:text-emerald-300"
                            />
                        )}
                        {hasDebit && (
                            <SidebarLink
                                icon={<CreditCard size={20} />}
                                label="DEBIT NODE"
                                isOpen={sidebarOpen}
                                onClick={() => setActiveCardModal('debit')}
                            />
                        )}
                        {hasCredit && (
                            <SidebarLink
                                icon={<Wallet size={20} />}
                                label="CREDIT CORE"
                                isOpen={sidebarOpen}
                                onClick={() => setActiveCardModal('credit')}
                            />
                        )}

                        <SidebarLink icon={<Shield size={20} />} label="SECURITY" isOpen={sidebarOpen} />
                        <SidebarLink
                            icon={<Calendar size={20} />}
                            label="APPOINTMENTS"
                            isOpen={sidebarOpen}
                            onClick={() => setIsAppointmentModalOpen(true)}
                        />
                        <SidebarLink icon={<Settings size={20} />} label="SYSTEM" isOpen={sidebarOpen} />
                    </nav>
                </div>

                <div className="p-6 border-t border-white/5">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-4 px-4 py-4 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-2xl transition-all group border border-transparent hover:border-rose-500/20"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        {sidebarOpen && <span className="font-black text-[11px] uppercase tracking-[0.2em]">Terminate Node</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Background Glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-obs-blue/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

                {/* Header */}
                <header className="bg-[#050b1a]/40 backdrop-blur-xl border-b border-white/5 px-4 md:px-10 py-6 flex items-center justify-between z-20 relative">
                    <div className="flex items-center gap-4 md:gap-6">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 transition-all lg:hidden border border-white/5"
                        >
                            <Menu size={20} />
                        </button>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="hidden lg:block p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 transition-all border border-white/5"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="h-8 w-px bg-white/5"></div>
                        <div>
                            <h2 className="text-[11px] font-black text-obs-blue uppercase tracking-[0.4em] mb-1">Financial Intelligence</h2>
                            <p className="text-lg font-black text-white tracking-tight">DASHBOARD_LIVE_v2.0</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-6 pr-6 border-r border-white/5">
                            <div className="relative group cursor-pointer">
                                <Bell className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-obs-blue rounded-full border-2 border-[#050b1a] shadow-[0_0_10px_rgba(37,99,235,0.8)]"></span>
                            </div>
                            <div className="relative group cursor-pointer">
                                <MessageSquare className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                        <div
                            onClick={() => setIsProfileOpen(true)}
                            className="flex items-center gap-4 bg-white/5 px-5 py-2.5 rounded-[1.25rem] border border-white/5 hover:border-obs-blue/30 transition-all cursor-pointer group/profile active:scale-95"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-black text-white leading-none tracking-tight">{user?.name}</p>
                                <p className="text-[9px] font-black text-obs-blue uppercase tracking-widest mt-1.5 flex items-center gap-1">
                                    <Star className="w-2.5 h-2.5 fill-current" />
                                    VIP ENTITY
                                </p>
                            </div>
                            <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-obs-blue to-indigo-600 flex items-center justify-center text-white font-black shadow-xl shadow-obs-blue/20 ring-1 ring-white/20">
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-10 space-y-8 md:space-y-12 overflow-y-auto custom-scrollbar-dark relative">
                    {/* Simplified Balance Section - HERO */}
                    <section className="animate-in fade-in slide-in-from-top-4 duration-1000">
                        <div className="bg-gradient-to-br from-[#0a1226] to-[#050b1a] border border-white/5 rounded-2xl md:rounded-[3rem] p-6 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] relative overflow-hidden group">
                            {/* Animated Background Elements */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-obs-blue/5 rounded-full blur-[120px] group-hover:bg-obs-blue/10 transition-all duration-1000 pointer-events-none"></div>
                            <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>
                            <div className="absolute top-[20%] left-[30%] w-[1px] h-[60%] bg-gradient-to-b from-transparent via-obs-blue/20 to-transparent opacity-20 group-hover:opacity-40 transition-opacity"></div>

                            <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-16">
                                <div className="space-y-8 text-center xl:text-left flex-1">
                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center justify-center xl:justify-start gap-4">
                                            <div className="p-4 bg-obs-blue/10 rounded-[1.5rem] text-obs-blue border border-obs-blue/20 shadow-2xl shadow-obs-blue/10">
                                                <Shield className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h2 className="text-[14px] font-black text-white tracking-[0.6em] uppercase">Nova Sovereign Vault</h2>
                                                <div className="flex items-center justify-center xl:justify-start gap-2 mt-2">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse"></span>
                                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Quantum Secured & Active</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap justify-center xl:justify-start gap-10 mt-4">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Primary Entity</p>
                                                <p className="text-xl font-black text-white italic uppercase tracking-tighter">{user?.name}</p>
                                            </div>
                                            <div className="w-px h-10 bg-white/5 hidden sm:block"></div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Account Type</p>
                                                <p className="text-xl font-black text-white italic uppercase tracking-tighter">{user?.accountType || 'UNSPECIFIED'}</p>
                                            </div>
                                            <div className="w-px h-10 bg-white/5 hidden sm:block"></div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Daily Sync Limit</p>
                                                <p className="text-xl font-black text-white italic uppercase tracking-tighter">
                                                    {user?.dailyLimit ? `₹ ${user.dailyLimit.toLocaleString()}` : 'UNLIMITED'}
                                                </p>
                                            </div>
                                            <div className="w-px h-10 bg-white/5 hidden sm:block"></div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Vault Protocol</p>
                                                <p className="text-xl font-mono font-black text-obs-blue tracking-wider">#{user?.accountNumber || 'NODE_PENDING'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center xl:items-end flex-1 gap-6">
                                    <div className="flex flex-col items-center xl:items-end">
                                        <div className="px-4 py-1.5 bg-obs-blue/10 rounded-full border border-obs-blue/20 mb-3">
                                            <p className="text-[8px] font-black text-obs-blue uppercase tracking-[0.4em]">Operational Balance</p>
                                        </div>
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-xl font-light text-obs-blue italic">₹</span>
                                            <h3 className="text-4xl font-black text-white tracking-tighter tabular-nums italic">
                                                {user?.balance?.toLocaleString()}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center xl:items-end">
                                        <div className="px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 mb-3">
                                            <p className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em]">Account Base (Initial)</p>
                                        </div>
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-xl font-light text-indigo-400 italic">₹</span>
                                            <h3 className="text-4xl font-black text-slate-300 tracking-tighter tabular-nums italic">
                                                {user?.initialDeposit?.toLocaleString()}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-white/5 w-full flex flex-col items-center xl:items-end">
                                        <div className="flex items-center gap-3">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Sovereign Assets:</p>
                                            <p className="text-xl font-black text-emerald-500 italic tabular-nums">₹ {((user?.balance || 0) + (user?.initialDeposit || 0)).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden 2xl:flex flex-col items-center gap-6 p-8 bg-white/2 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-xl group-hover:border-obs-blue/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20">
                                            <TrendingUp className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-white">+24.8%</p>
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Real-time Growth</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[75%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                    </div>
                                    <Fingerprint className="w-8 h-8 text-white/10 group-hover:text-obs-blue/40 transition-colors" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quick Access Actions */}
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <QuickActionCard
                                icon={<ArrowRightLeft className="w-6 h-6" />}
                                title="Transfer Assets"
                                subtitle="Internal Node Sync"
                                onClick={() => { setIsTransactionsOpen(true); setDirectTransfer(true); }}
                                color="bg-obs-blue"
                            />
                            <QuickActionCard
                                icon={<Zap className="w-6 h-6" />}
                                title="Quick Send"
                                subtitle="Instant Protocol"
                                onClick={() => { setIsTransactionsOpen(true); setDirectTransfer(true); }}
                                color="bg-emerald-500"
                            />
                            <QuickActionCard
                                icon={<Library className="w-6 h-6" />}
                                title="E-Passbook"
                                subtitle="Temporal Ledger"
                                onClick={() => setIsPassbookOpen(true)}
                                color="bg-indigo-600"
                            />
                            <QuickActionCard
                                icon={<CreditCard className="w-6 h-6" />}
                                title="Node Access"
                                subtitle="Virtual Card Sync"
                                onClick={() => setActiveCardModal('debit')}
                                color="bg-slate-700"
                            />
                        </div>
                    </section>

                    {/* Chart & Transactions */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 bg-[#0a1226]/40 rounded-[3.5rem] p-12 backdrop-blur-md border border-white/5 shadow-2xl overflow-hidden relative group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-obs-blue to-transparent opacity-30"></div>
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h3 className="text-[11px] font-black text-obs-blue uppercase tracking-[0.3em] mb-1.5">Network Traffic</h3>
                                    <p className="text-2xl font-black text-white tracking-tight">Transaction Analytics</p>
                                </div>
                                <button className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-[10px] font-black hover:bg-white/10 transition-all uppercase tracking-widest text-slate-400 hover:text-white">
                                    Export Logs
                                </button>
                            </div>
                            <div className="h-[350px] relative">
                                <svg viewBox="0 0 800 300" className="w-full h-full overflow-visible">
                                    {[0, 100, 200, 300, 400, 500].map((val, i) => (
                                        <line key={i} x1="40" y1={300 - (val / 500) * 250} x2="780" y2={300 - (val / 500) * 250} stroke="white" strokeOpacity="0.03" strokeWidth="1" />
                                    ))}
                                    <path
                                        d="M40,250 C100,100 150,220 200,180 S300,50 400,200 S550,150 700,220 S780,180 780,180"
                                        fill="none"
                                        stroke="#2563eb"
                                        strokeWidth="6"
                                        strokeLinecap="round"
                                        className="drop-shadow-[0_0_15px_rgba(37,99,235,0.6)]"
                                    />
                                    <path
                                        d="M40,250 C100,100 150,220 200,180 S300,50 400,200 S550,150 700,220 S780,180 780,180 L780,300 L40,300 Z"
                                        fill="url(#sapphireChartGrad)"
                                        className="opacity-10"
                                    />
                                    <defs>
                                        <linearGradient id="sapphireChartGrad" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#2563eb" />
                                            <stop offset="100%" stopColor="transparent" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>

                        <div className="bg-[#0a1226]/80 rounded-[3.5rem] p-10 border border-white/5 shadow-2xl flex flex-col group relative overflow-hidden h-full">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <h3 className="text-lg font-black text-white tracking-tight">Recent Activity</h3>
                                <div className="p-3 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all border border-white/5">
                                    <Search className="w-4 h-4 text-slate-500 group-hover:text-obs-blue transition-colors" />
                                </div>
                            </div>
                            <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar-dark pr-2 relative z-10">
                                {recentTx.map((tx, i) => (
                                    <TransactionListItem key={i} {...tx} />
                                ))}
                            </div>
                            <button
                                onClick={() => setIsTransactionsOpen(true)}
                                className="w-full mt-10 py-5 bg-gradient-to-r from-obs-blue to-indigo-700 hover:from-obs-blue hover:to-obs-blue text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-obs-blue/30 active:scale-95 border border-white/10 relative z-10"
                            >
                                Explore Ledger History
                            </button>
                        </div>
                    </section>

                    {/* Bank Services Section */}
                    <section className="bg-[#0a1226]/40 rounded-[3rem] p-10 border border-white/5 shadow-2xl overflow-hidden relative group animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-obs-blue/5 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-[11px] font-black text-obs-blue uppercase tracking-[0.4em] mb-1">Human Interaction</h3>
                                <p className="text-2xl font-black text-white tracking-tight uppercase italic">Bank_Services_Nodes</p>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-obs-blue/10 border border-obs-blue/20 rounded-xl">
                                <Activity className="w-3 h-3 text-obs-blue animate-pulse" />
                                <span className="text-[9px] font-black text-obs-blue uppercase tracking-widest">Support Sync Stable</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Appointment Request */}
                            <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] hover:border-obs-blue/30 transition-all group/service">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-14 h-14 bg-obs-blue/20 rounded-2xl flex items-center justify-center text-obs-blue group-hover/service:bg-obs-blue group-hover/service:text-white transition-all shadow-xl shadow-obs-blue/10">
                                        <Calendar size={28} />
                                    </div>
                                    <ArrowRightLeft className="w-5 h-5 text-slate-700 group-hover/service:text-obs-blue transition-colors rotate-45" />
                                </div>
                                <h4 className="text-lg font-black text-white italic uppercase tracking-tighter mb-2">Schedule Synchronizer</h4>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">Request a dedicated neural link with an OBS Bank Clerk for complex asset management or specialized protocol inquiries.</p>
                                <button
                                    onClick={() => setIsAppointmentModalOpen(true)}
                                    className="w-full py-4 bg-[#0a1226] hover:bg-obs-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 shadow-lg active:scale-95"
                                >
                                    Initiate Schedule Request
                                </button>
                            </div>

                            {/* Active Form Protocols */}
                            <ActiveFormProtocolSection setActiveFormRequest={setActiveFormRequest} />
                        </div>
                    </section>
                </div>
            </main>

            {/* E-Passbook Modal */}
            {isPassbookOpen && (
                <PassbookModal
                    onClose={closeAllModals}
                    user={user}
                    history={history}
                />
            )}

            {/* Transactions Modal */}
            {isTransactionsOpen && (
                <TransactionsModal
                    onClose={closeAllModals}
                    user={user}
                    history={history}
                    refreshData={fetchData}
                    initialShowForm={directTransfer}
                />
            )}

            {/* Card Detail Modal */}
            {activeCardModal && (
                <CardModal
                    type={activeCardModal === 'debit' ? 'debit' : 'credit'}
                    user={user}
                    refreshData={fetchData}
                    onClose={closeAllModals}
                />
            )}

            {/* Profile Detail Modal */}
            {isProfileOpen && (
                <ProfileModal
                    user={user}
                    refreshData={fetchData}
                    onClose={closeAllModals}
                />
            )}

            {/* Appointment Modal */}
            {isAppointmentModalOpen && (
                <AppointmentModal
                    onClose={closeAllModals}
                    refreshData={fetchData}
                />
            )}

            {/* Form Request Modal */}
            {activeFormRequest && (
                <CustomerFormModal
                    formRequest={activeFormRequest}
                    onClose={closeAllModals}
                    refreshData={fetchData}
                />
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }

                .custom-scrollbar-dark::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar-dark::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
                .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: rgba(37,99,235,0.2); border-radius: 10px; }
                .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover { background: rgba(37,99,235,0.5); }
                
                .text-shadow-glow { text-shadow: 0 0 20px rgba(255,255,255,0.3); }
                .text-shadow-blue { text-shadow: 0 0 15px rgba(37,99,235,0.4); }
                
                .animate-glow { animation: glow 2s ease-in-out infinite alternate; }
                @keyframes glow {
                    from { box-shadow: 0 0 10px rgba(37,99,235,0.2); border-color: rgba(37,99,235,0.2); }
                    to { box-shadow: 0 0 25px rgba(37,99,235,0.5); border-color: rgba(37,99,235,0.6); }
                }

                .card-inner {
                    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}} />
        </div>
    );
};

// --- Transactions Modal Component ---

function TransactionsModal({ onClose, user, history, refreshData, initialShowForm = false }) {
    const [showTransferForm, setShowTransferForm] = useState(initialShowForm);
    const [receiverAccount, setReceiverAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('Temporal Sync');
    const [syncing, setSyncing] = useState(false);
    const [status, setStatus] = useState(null); // 'success', 'error'

    const handleTransfer = async (e) => {
        e.preventDefault();
        setSyncing(true);
        try {
            await axios.post('/transactions/transfer', {
                receiverAccount,
                amount: Number(amount),
                description
            });
            Swal.fire({
                icon: 'success',
                title: 'Transfer Successful',
                text: `Successfully transferred ₹${Number(amount).toLocaleString()} to ${receiverAccount}`,
                background: '#0a1226',
                color: '#fff',
                iconColor: '#0ea5e9',
                confirmButtonColor: '#0ea5e9',
                customClass: {
                    popup: 'rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-2xl'
                }
            });
            setShowTransferForm(false);
            refreshData();
            setSyncing(false);
            setReceiverAccount('');
            setAmount('');
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Transfer Failed',
                text: err.response?.data?.error || 'Unable to process transaction sync.',
                background: '#0a1226',
                color: '#fff',
                confirmButtonColor: '#0ea5e9',
                customClass: {
                    popup: 'rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-2xl'
                }
            });
            setSyncing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-[#050b1a]/95 backdrop-blur-2xl animate-in fade-in duration-500" onClick={onClose}></div>

            <div className="relative w-full max-w-6xl bg-[#0a1226]/80 rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-700 border border-white/10 flex flex-col h-[85vh]">
                <div className="absolute inset-0 bg-gradient-to-br from-obs-blue/5 to-transparent pointer-events-none"></div>

                {/* Modal Header */}
                <div className="p-8 pb-6 flex justify-between items-center relative z-10 border-b border-white/5">
                    <div className="flex items-center gap-5">
                        <div className="bg-gradient-to-br from-obs-blue to-indigo-600 p-3 rounded-xl shadow-2xl shadow-obs-blue/40 ring-1 ring-obs-blue/10">
                            <ArrowRightLeft className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-obs-blue uppercase tracking-[0.4em] mb-0.5">Network Ledger Protocol</p>
                            <h2 className="text-xl font-black text-white tracking-tight leading-none italic uppercase">ASSET_TRANSFER<span className="text-obs-blue font-light">_LOGS</span></h2>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {!showTransferForm ? (
                            <button
                                onClick={() => setShowTransferForm(true)}
                                className="flex items-center gap-3 bg-obs-blue/20 hover:bg-obs-blue px-8 py-3 rounded-2xl border border-obs-blue/30 text-white transition-all shadow-lg active:scale-95 group"
                            >
                                <Zap className="w-5 h-5 group-hover:animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Transfer Assets</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowTransferForm(false)}
                                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-8 py-3 rounded-2xl border border-white/5 text-slate-300 transition-all active:scale-95"
                            >
                                <History className="w-5 h-5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Back to Ledger</span>
                            </button>
                        )}
                        <button onClick={onClose} className="w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-rose-500 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all group">
                            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                        </button>
                    </div>
                </div>

                {!showTransferForm ? (
                    <>
                        {/* Filters & Stats */}
                        <div className="px-12 py-8 bg-white/2 border-b border-white/5 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all">
                                    <Filter className="w-4 h-4 text-slate-500" />
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Filter Protocol</span>
                                </div>
                                <div className="h-8 w-px bg-white/5"></div>
                                <div className="flex items-center gap-10">
                                    <div>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Entity Balance</p>
                                        <p className="text-xl font-black text-white italic tabular-nums">₹ {user?.balance?.toLocaleString()}</p>
                                    </div>
                                    <div className="w-px h-8 bg-white/5 opacity-50"></div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Network Status</p>
                                        <p className="text-xl font-black text-obs-blue italic uppercase tracking-tighter">SECURE</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Activity className="w-5 h-5 text-obs-blue animate-pulse" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Real-time Sync Active</span>
                            </div>
                        </div>

                        {/* Ledger Body */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar-dark p-8 relative z-10">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-[#0a1226] z-10">
                                    <tr className="border-b border-white/10">
                                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Temporal Hash</th>
                                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Entity Interaction</th>
                                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Delta (Amount)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {history.length > 0 ? history.map((tx, i) => {
                                        const isDebit = tx.sender?._id === user?._id;
                                        return (
                                            <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-2.5 rounded-xl ${isDebit ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                            {isDebit ? <TrendingUp className="w-4 h-4 rotate-180" /> : <TrendingUp className="w-4 h-4" />}
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-black text-white group-hover:text-obs-blue transition-colors uppercase font-mono tracking-tighter">#{tx._id.slice(-12).toUpperCase()}</p>
                                                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">{new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 font-black text-xs border border-white/5">
                                                            {(isDebit ? tx.receiver?.name : tx.sender?.name)?.charAt(0) || 'N'}
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-black text-white group-hover:text-obs-blue transition-colors uppercase tracking-tight italic">
                                                                {isDebit ? `DEPLOY_TO: ${tx.receiver?.name}` : `INGEST_FROM: ${tx.sender?.name}`}
                                                            </p>
                                                            <p className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter mt-1 opacity-60 italic">{isDebit ? tx.receiver?.email : tx.sender?.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CONFIRMED</span>
                                                    </div>
                                                </td>
                                                <td className={`p-6 text-right font-mono text-base font-black italic ${isDebit ? 'text-rose-500' : 'text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]'}`}>
                                                    {isDebit ? '↓' : '↑'} ₹ {tx.amount.toLocaleString()}
                                                </td>
                                            </tr>
                                        )
                                    }) : (
                                        <tr>
                                            <td colSpan="4" className="p-32 text-center text-slate-700 font-black uppercase tracking-[0.4em] opacity-20">No Temporal Logs Found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    /* Interactive Transfer Form */
                    <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 overflow-hidden">
                        <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] bg-obs-blue/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
                        <div className="absolute bottom-[5%] left-[-5%] w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="w-full max-w-sm space-y-6 animate-in slide-in-from-bottom-12 duration-1000 relative">
                            <div className="text-center space-y-3">
                                <div className="relative inline-block">
                                    <div className="absolute -inset-2 bg-obs-blue/20 rounded-full blur-lg animate-pulse"></div>
                                    <div className="relative p-3 bg-[#0a1226] rounded-xl border border-obs-blue/30 shadow-2xl">
                                        <Zap className="w-6 h-6 text-obs-blue" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-tight text-shadow-glow">Add Money / Transfer</h3>
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="h-px w-6 bg-white/10"></div>
                                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">Internal Network Asset Sync</p>
                                        <div className="h-px w-6 bg-white/10"></div>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleTransfer} className="space-y-6">
                                <div className="space-y-6">
                                    <div className="relative group">
                                        <label className="text-[6px] font-black text-obs-blue uppercase tracking-[0.4em] absolute -top-1 left-5 bg-[#0d162d] px-2 z-10 border-x border-obs-blue/20">Receiver Account</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-5 flex items-center text-slate-600 group-focus-within:text-obs-blue transition-all">
                                                <Fingerprint size={14} className="group-focus-within:scale-110 transition-transform" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                placeholder="ENTER ACCOUNT NUMBER..."
                                                className="w-full bg-white/[0.01] border border-white/10 rounded-xl py-4 pl-12 pr-6 text-white font-mono tracking-[0.1em] focus:outline-none focus:border-obs-blue/50 focus:bg-white/[0.03] transition-all placeholder:text-slate-800 uppercase shadow-inner text-[10px]"
                                                value={receiverAccount}
                                                onChange={(e) => setReceiverAccount(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <label className="text-[6px] font-black text-obs-blue uppercase tracking-[0.4em] absolute -top-1 left-5 bg-[#0d162d] px-2 z-10 border-x border-obs-blue/20">Asset Quantity</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-5 flex items-center text-slate-600 group-focus-within:text-obs-blue transition-all text-sm font-black italic">
                                                ₹
                                            </div>
                                            <input
                                                type="number"
                                                required
                                                placeholder="0.00"
                                                className="w-full bg-white/[0.01] border border-white/10 rounded-xl py-4 pl-12 pr-6 text-white font-mono text-base font-black tracking-widest focus:outline-none focus:border-obs-blue/50 focus:bg-white/[0.03] transition-all placeholder:text-slate-800 shadow-inner"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        disabled={syncing}
                                        className={`w-full py-7 group relative overflow-hidden bg-gradient-to-r from-obs-blue to-indigo-700 hover:from-obs-blue/80 hover:to-obs-blue rounded-[2.5rem] font-black text-xs uppercase tracking-[0.6em] transition-all shadow-[0_20px_40px_rgba(37,99,235,0.25)] active:scale-[0.98] border border-white/10 flex items-center justify-center gap-5 ${syncing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        {syncing ? (
                                            <>
                                                <RotateCw className="w-5 h-5 animate-spin" />
                                                Processing Sync...
                                            </>
                                        ) : (
                                            <>
                                                <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                Authorize Deployment
                                            </>
                                        )}
                                    </button>
                                </div>

                                {status === 'success' && (
                                    <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] flex items-center gap-6 animate-in zoom-in-95 duration-500 shadow-lg shadow-emerald-500/5">
                                        <div className="bg-emerald-500 p-2 rounded-full shadow-lg shadow-emerald-500/40">
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-white uppercase tracking-widest">Protocol Success</p>
                                            <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Temporal parity successfully deployed.</p>
                                        </div>
                                    </div>
                                )}

                                {status === 'error' && (
                                    <div className="p-8 bg-rose-500/10 border border-rose-500/20 rounded-[2.5rem] flex items-center gap-6 animate-in shake duration-500 shadow-lg shadow-rose-500/5">
                                        <div className="bg-rose-500 p-2 rounded-full shadow-lg shadow-rose-500/40">
                                            <X className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-white uppercase tracking-widest">Sync Violation</p>
                                            <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest mt-1">Protocol Sync Failure. Verify target node.</p>
                                        </div>
                                    </div>
                                )}
                            </form>

                            <div className="flex items-center justify-center gap-2 pt-4">
                                <Lock className="w-3 h-3 text-slate-600" />
                                <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">End-to-End Quantum Encryption Active</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="p-8 border-t border-white/5 bg-white/[0.02] flex justify-between items-center relative z-10">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.5em]">AUTH_PROTOCOL: OBS_NOVA_SECURE • LOG_INTEGRITY_VERIFIED</p>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Fingerprint className="w-4 h-4 text-obs-blue" />
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Encryption: AES_256_GCM</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Card Modal Component ---

function CardModal({ type, user, onClose, refreshData }) {
    const [issuing, setIssuing] = useState(false);
    const [status, setStatus] = useState(null);

    const card = type === 'debit' ? user.cardDetails?.debitCard : user.cardDetails?.creditCard;
    const isIssued = card && card.cardNumber && card.isActive;
    const requestStatus = card?.requestStatus || 'none';
    const isStaff = user.role === 'Admin' || user.role === 'General Manager';

    const handleRequestCard = async () => {
        setIssuing(true);
        setStatus(null);
        try {
            await axios.post('/auth/request-card', { type });
            setStatus({ type: 'success', message: 'ACCESS_REQUEST_LOGGED' });
            setTimeout(() => {
                refreshData();
                setIssuing(false);
            }, 2000);
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.error || 'REQUEST_FAILURE' });
            setIssuing(false);
        }
    };

    const handleIssueCard = async () => {
        setIssuing(true);
        setStatus(null);
        try {
            const endpoint = type === 'debit'
                ? `/admin/customers/${user._id}/generate-debit-card`
                : `/admin/customers/${user._id}/generate-credit-card`;

            await axios.post(endpoint);
            setStatus({ type: 'success', message: `${type.toUpperCase()} NODE INITIALIZED` });
            setTimeout(() => {
                refreshData();
                setIssuing(false);
            }, 2000);
        } catch (err) {
            setStatus({ type: 'error', message: 'PROTOCOL_INIT_FAILURE' });
            setIssuing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-[#050b1a]/95 backdrop-blur-2xl animate-in fade-in duration-500" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl animate-in zoom-in-95 duration-700 flex flex-col items-center">
                <div className="flex justify-between items-center w-full mb-8 relative z-10 px-8">
                    <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-3xl ${type === 'debit' ? 'bg-obs-blue' : 'bg-indigo-600'} shadow-2xl ring-4 ring-white/5`}>
                            <CreditCard className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-obs-blue uppercase tracking-[0.4em] mb-1">Asset Sovereignty Access</p>
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                                {type === 'debit' ? 'Quantum_Debit_Node' : 'Nebula_Credit_Core'}
                            </h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-rose-500 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all group">
                        <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                    </button>
                </div>

                {isIssued ? (
                    <div className="w-full space-y-12 flex flex-col items-center">
                        <div className="w-full relative z-10 group flex justify-center">
                            <div className="absolute -inset-10 bg-obs-blue/10 rounded-[4rem] blur-[100px] opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-1000"></div>
                            <FullVirtualCard
                                type={type === 'debit' ? 'Quantum Node' : 'Nebula Core'}
                                label={type === 'debit' ? 'Debit Protocol' : 'Credit Protocol'}
                                number={card.cardNumber}
                                expiry={card.expiryDate}
                                cvv={card.cvv || '000'}
                                theme={type === 'debit' ? 'bg-[#0f172a]' : 'bg-gradient-to-br from-[#1e1b4b] to-[#0f172a]'}
                                issuer="General Manager"
                            />
                        </div>

                        <div className="flex flex-col items-center gap-6 text-center max-w-lg relative z-10">
                            <div className="flex items-center gap-3 px-6 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                                <Fingerprint className="w-4 h-4 text-obs-blue" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Biometric Auth Active</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                This asset is strictly assigned to <span className="text-white italic">{user.name}</span>.
                                Unauthorized access or redistribution of node metadata is a temporal protocol violation.
                            </p>
                            <div className="flex gap-4">
                                <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest transition-all">
                                    Freeze Node
                                </button>
                                <button className="px-8 py-3 bg-obs-blue/20 hover:bg-obs-blue text-white rounded-xl border border-obs-blue/30 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-obs-blue/20">
                                    Sync Proxy
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full bg-[#0a1226]/60 backdrop-blur-xl border border-white/5 p-12 rounded-[3.5rem] flex flex-col items-center text-center gap-8 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-obs-blue/5 to-transparent pointer-events-none"></div>
                        <div className="w-32 h-32 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/10 shadow-inner relative">
                            {requestStatus === 'pending' ? (
                                <Activity className="w-16 h-16 text-obs-blue animate-pulse" />
                            ) : (
                                <Shield className={`w-16 h-16 ${issuing ? 'text-obs-blue animate-pulse' : 'text-slate-700'}`} />
                            )}
                            {issuing && (
                                <div className="absolute inset-0 border-2 border-obs-blue rounded-[2.5rem] animate-ping opacity-20"></div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                                {requestStatus === 'pending' ? 'REQUEST_UNDER_SYNC' : 'Initial_Node_Protocol'}
                            </h3>
                            <p className="text-xs text-slate-500 uppercase tracking-widest max-w-sm leading-relaxed">
                                {requestStatus === 'pending'
                                    ? 'Your request for node access has been logged. Authorization by the General Manager or System Admin is required.'
                                    : 'No active node detected for this entity. Initialize a new access link request to the Sovereign Network.'}
                            </p>
                        </div>

                        {isStaff ? (
                            <button
                                onClick={handleIssueCard}
                                disabled={issuing}
                                className={`px-12 py-5 bg-gradient-to-r from-obs-blue to-indigo-700 hover:from-obs-blue hover:to-obs-blue text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all shadow-2xl shadow-obs-blue/30 active:scale-95 border border-white/10 flex items-center gap-4 ${issuing ? 'opacity-50' : ''}`}
                            >
                                {issuing ? <RotateCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-400" />}
                                {issuing ? 'Initializing Node...' : 'Authorize Node Issuance'}
                            </button>
                        ) : (
                            requestStatus !== 'pending' && (
                                <button
                                    onClick={handleRequestCard}
                                    disabled={issuing}
                                    className={`px-12 py-5 bg-obs-blue/20 hover:bg-obs-blue text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] transition-all shadow-2xl shadow-obs-blue/30 active:scale-95 border border-obs-blue/30 flex items-center gap-4 ${issuing ? 'opacity-50' : ''}`}
                                >
                                    {issuing ? <RotateCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4 text-obs-blue" />}
                                    {issuing ? 'Logging Request...' : 'Request Access Protocol'}
                                </button>
                            )
                        )}

                        {status && (
                            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border animate-in zoom-in-95 ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
                                {status.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                <span className="text-[10px] font-black uppercase tracking-widest">{status.message}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 pt-4 opacity-40">
                            <Lock className="w-3 h-3 text-slate-600" />
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">Temporal Encryption Shield Active</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- E-Passbook Modal Component ---

function PassbookModal({ onClose, user, history }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-[#050b1a]/95 backdrop-blur-2xl animate-in fade-in duration-500" onClick={onClose}></div>

            <div className="relative w-full max-w-6xl bg-[#0a1226]/80 rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-700 border border-white/10 flex flex-col h-[85vh]">
                <div className="absolute inset-0 bg-gradient-to-br from-obs-blue/5 to-transparent pointer-events-none"></div>

                {/* Modal Header */}
                <div className="p-12 pb-8 flex justify-between items-center relative z-10 border-b border-white/5">
                    <div className="flex items-center gap-6">
                        <div className="bg-obs-blue p-5 rounded-[2rem] shadow-2xl shadow-obs-blue/40 ring-4 ring-obs-blue/10">
                            <Library className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-obs-blue uppercase tracking-[0.5em] mb-2">Authenticated System Access</p>
                            <h2 className="text-4xl font-black text-white tracking-tight leading-none italic uppercase">NOVA_SLATE<span className="text-obs-blue font-light">_PASSBOOK</span></h2>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all">
                            <Printer className="w-6 h-6" />
                        </button>
                        <button onClick={onClose} className="w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-rose-500 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all group">
                            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                        </button>
                    </div>
                </div>

                {/* Account Details */}
                <div className="px-12 py-10 bg-white/2 border-b border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                    <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Entity Identity</p>
                        <p className="text-lg font-black text-white leading-tight uppercase tracking-tight">{user?.name}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Node Protocol</p>
                        <p className="font-mono text-lg font-black text-obs-blue tracking-wider">SEC_#{user?.accountNumber}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Deployment Hub</p>
                        <p className="text-lg font-black text-white leading-tight uppercase tracking-tight italic">Nova Digital Node 01</p>
                    </div>
                    <div className="bg-obs-blue/10 p-4 rounded-3xl border border-obs-blue/20">
                        <p className="text-[9px] font-black text-obs-blue uppercase tracking-widest mb-2">Vault Balance</p>
                        <p className="text-2xl font-black text-white leading-none tabular-nums italic">₹ {user?.balance?.toLocaleString()}</p>
                    </div>
                </div>

                {/* Ledger Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar-dark p-8 relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-[#0a1226] z-10">
                            <tr className="border-b border-white/10">
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Temporal Log</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Metadata</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Outflow (Debit)</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Inflow (Credit)</th>
                                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Asset Delta</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {history.length > 0 ? history.map((tx, i) => {
                                const isDebit = tx.sender?._id === user?._id;
                                return (
                                    <tr key={i} className="group hover:bg-white/[0.02] transition-colors border-l-2 border-transparent hover:border-obs-blue">
                                        <td className="p-6 font-mono text-[11px] text-slate-500 group-hover:text-white transition-colors">
                                            {new Date(tx.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                                        </td>
                                        <td className="p-6">
                                            <p className="text-[11px] font-black text-white group-hover:text-obs-blue transition-colors uppercase tracking-tight">
                                                {isDebit ? `Node Transfer -> ${tx.receiver?.name}` : `Node Receipt <- ${tx.sender?.name}`}
                                            </p>
                                            <p className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter mt-1.5 opacity-60">Hash: {tx._id}</p>
                                        </td>
                                        <td className="p-6 text-right font-mono text-sm font-black text-rose-500/80 italic">
                                            {isDebit ? `₹ ${tx.amount.toLocaleString()}` : '0.00'}
                                        </td>
                                        <td className="p-6 text-right font-mono text-sm font-black text-emerald-500/80 italic">
                                            {!isDebit ? `₹ ${tx.amount.toLocaleString()}` : '0.00'}
                                        </td>
                                        <td className="p-6 text-right font-mono text-xs font-black text-white/40 group-hover:text-white transition-colors">
                                            ₹ {user.balance.toLocaleString()}
                                        </td>
                                    </tr>
                                )
                            }) : (
                                <tr>
                                    <td colSpan="5" className="p-32 text-center">
                                        <div className="flex flex-col items-center gap-6 opacity-10">
                                            <Cpu className="w-24 h-24 animate-pulse" />
                                            <p className="text-xl font-black uppercase tracking-[0.5em]">No Temporal Records</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-10 border-t border-white/5 bg-white/[0.02] flex justify-between items-center relative z-10">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.5em]">NOVA_PROTOCOL_ENCRYPTION_v4.2 • SECURE_NODE_SYNC</p>
                    <div className="flex items-center gap-3">
                        <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-obs-blue w-[70%] animate-pulse"></div>
                        </div>
                        <span className="text-[10px] font-black text-obs-blue uppercase italic">Quantum Encrypted</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Helper Components ---

function SidebarLink({ icon, label, active = false, isOpen = true, onClick, className = "" }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-5 px-6 py-4.5 rounded-[1.5rem] transition-all duration-500 group relative overflow-hidden ${active ? 'bg-obs-blue text-white shadow-[0_10px_30px_rgba(37,99,235,0.4)] translate-x-2' : 'text-slate-500 hover:text-white hover:bg-white/5'} ${className}`}
        >
            {active && <div className="absolute right-0 top-0 bottom-0 w-1 bg-white opacity-40"></div>}
            <div className={`transition-all duration-500 ${active ? 'text-white scale-110' : 'text-slate-500 group-hover:text-obs-blue group-hover:scale-110'}`}>
                {icon}
            </div>
            {isOpen && <span className="font-black text-[10px] uppercase tracking-[0.3em]">{label}</span>}
        </button>
    );
}

function FullVirtualCard({ type, label, number, expiry, cvv, theme, issuer }) {
    const [flipped, setFlipped] = useState(false);

    return (
        <div
            className="perspective-1000 w-[360px] h-[220px] cursor-pointer group"
            onClick={() => setFlipped(!flipped)}
        >
            <div className={`relative w-full h-full card-inner preserve-3d shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)] rounded-[2rem] ${flipped ? 'rotate-y-180' : ''}`}>
                {/* Front Face */}
                <div className={`absolute inset-0 backface-hidden p-6 border border-white/10 flex flex-col justify-between rounded-[2rem] overflow-hidden ${theme}`}>
                    <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-1000"></div>

                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[8px] font-black text-obs-blue uppercase tracking-[0.4em]">{type}</span>
                                <div className="h-0.5 w-4 bg-obs-blue rounded-full"></div>
                            </div>
                            <h4 className="text-lg font-black text-white italic tracking-tighter">{label}</h4>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                            <div className="w-10 h-7 bg-amber-400/20 rounded-lg border border-amber-400/30 ring-1 ring-amber-400/10 shadow-inner"></div>
                            <div className="bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                                <CheckCircle className="w-2 h-2 text-emerald-500" />
                                <span className="text-[6px] font-black text-emerald-500 uppercase tracking-widest">GM Issued</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex flex-col gap-3">
                        <p className="text-white font-mono text-xl tracking-[0.2em] drop-shadow-2xl text-shadow-blue italic">
                            {number.match(/.{1,4}/g).join('  ')}
                        </p>

                        <div className="flex justify-between items-end border-t border-white/5 pt-3">
                            <div className="space-y-0.5">
                                <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-0.5 opacity-60">Authorized Issuer</p>
                                <p className="text-[10px] font-black text-white uppercase tracking-widest italic leading-none">{issuer}</p>
                            </div>
                            <div className="text-right space-y-0.5">
                                <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-0.5 opacity-60">Validation</p>
                                <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{expiry}</p>
                            </div>
                            <div className="flex items-center gap-1.5 pl-4">
                                <div className="w-6 h-6 rounded-full bg-obs-blue/40 border border-white/10 backdrop-blur-lg"></div>
                                <div className="w-6 h-6 rounded-full bg-indigo-600/40 border border-white/10 backdrop-blur-lg -ml-4"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Face */}
                <div className={`absolute inset-0 backface-hidden rotate-y-180 p-0 border border-white/10 flex flex-col rounded-[2rem] overflow-hidden ${theme} bg-[#020617]`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                    <div className="mt-8 h-10 w-full bg-[#111] shadow-2xl relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse opacity-20"></div>
                        <div className="absolute top-1/2 -translate-y-1/2 right-12 text-[4px] font-black text-white/5 uppercase tracking-[0.5em]">Magnetic_Security_Protocol_v8.4</div>
                    </div>
                    <div className="p-6 space-y-5 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="h-10 flex-1 bg-white/10 rounded-lg flex items-center justify-end px-4 border border-white/5">
                                <span className="text-[8px] font-black text-obs-blue tracking-tighter uppercase mr-4">Security_Terminal_CVV</span>
                                <span className="font-mono text-lg font-black text-white italic bg-[#222] px-2 py-0.5 rounded-md shadow-2xl border border-white/5">{cvv}</span>
                            </div>
                        </div>
                        <div className="space-y-2 opacity-40">
                            <div className="h-1 w-full bg-white/5 rounded-full"></div>
                            <div className="h-1 w-[85%] bg-white/5 rounded-full"></div>
                            <div className="h-1 w-[70%] bg-white/5 rounded-full"></div>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <Library className="w-3 h-3 text-obs-blue" />
                                <div>
                                    <p className="text-[7px] font-black text-white uppercase tracking-widest">Nova Global Network</p>
                                    <p className="text-[5px] font-black text-slate-600 uppercase tracking-tighter mt-0.5">Authorized Entity Asset Control</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[5px] font-black text-slate-600 uppercase tracking-widest">Emergency Sync Status</p>
                                <p className="text-[7px] font-black text-white tracking-widest leading-none">+91 1800-NOVA-SYNC</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function TransactionListItem({ name, email, date, amount, isNegative = false }) {
    return (
        <div className="flex items-center justify-between p-4 bg-white/[0.03] hover:bg-white/[0.08] rounded-2xl transition-all duration-300 group border border-white/5 hover:border-obs-blue/30 shadow-lg relative overflow-hidden active:scale-95 text-xs">
            <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] flex items-center justify-center text-obs-blue font-black text-lg shadow-2xl border border-white/5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ring-1 ring-white/10">
                    {name?.charAt(0) || 'N'}
                </div>
                <div>
                    <p className="font-black text-white text-[11px] group-hover:text-obs-blue transition-colors tracking-tight uppercase italic">{name || 'Network Sync'}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                        <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em]">{date}</p>
                    </div>
                </div>
            </div>
            <div className="text-right relative z-10">
                <p className={`text-base font-black italic tracking-tighter ${isNegative ? 'text-rose-500' : 'text-emerald-500 text-shadow-blue'}`}>
                    {isNegative ? '↓' : '↑'} {amount.toString().startsWith('₹') ? '' : '₹'}{amount}
                </p>
                <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest mt-1 italic group-hover:text-obs-blue/40 transition-colors">Confirmed</p>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1 group-hover:bg-obs-blue transition-all duration-500"></div>
        </div>
    );
}

function QuickActionCard({ icon, title, subtitle, onClick, color = "bg-obs-blue" }) {
    return (
        <button
            onClick={onClick}
            className="group relative bg-[#0a1226]/60 backdrop-blur-xl border border-white/5 p-6 rounded-3xl flex flex-col items-center text-center gap-5 transition-all duration-500 hover:border-obs-blue/30 hover:bg-obs-blue/5 hover:-translate-y-2 shadow-2xl active:scale-95 overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all"></div>
            <div className={`p-4 ${color} rounded-2xl text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                {icon}
            </div>
            <div>
                <h4 className="text-[9px] font-black text-white uppercase tracking-[0.3em] mb-1.5 bg-clip-text group-hover:text-obs-blue transition-colors">{title}</h4>
                <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">{subtitle}</p>
            </div>
            <div className="absolute bottom-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <Zap className="w-2.5 h-2.5 text-obs-blue animate-pulse" />
            </div>
        </button>
    );
}


// --- Profile Modal Component ---

function ProfileModal({ onClose, user, refreshData }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...user });
    const [syncing, setSyncing] = useState(false);
    const [status, setStatus] = useState(null);

    const handleInputChange = (path, value) => {
        const keys = path.split('.');
        setFormData(prev => {
            let next = { ...prev };
            let current = next;
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return next;
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSyncing(true);
        setStatus(null);
        try {
            const res = await axios.put('/auth/update', formData);
            setStatus({ type: 'success', message: res.data.message });
            setTimeout(() => {
                setIsEditing(false);
                refreshData();
                setStatus(null);
                setSyncing(false);
            }, 2000);
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.error || 'Update failed' });
            setSyncing(false);
        }
    };
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-[#050b1a]/95 backdrop-blur-3xl animate-in fade-in duration-700" onClick={onClose}></div>

            <div className="relative w-full max-w-5xl bg-[#0a1226]/80 rounded-[4rem] shadow-[0_0_120px_rgba(0,0,0,0.9)] overflow-hidden animate-in zoom-in-95 duration-700 border border-white/10 flex flex-col h-[90vh]">
                <div className="absolute inset-0 bg-gradient-to-br from-obs-blue/10 to-transparent pointer-events-none"></div>
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Fingerprint size={300} className="text-obs-blue" />
                </div>

                {/* Modal Header */}
                <div className="p-10 pb-8 flex justify-between items-center relative z-10 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-obs-blue to-indigo-600 rounded-[2rem] flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-obs-blue/40 ring-2 ring-white/10 italic">
                            {user?.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-obs-blue uppercase tracking-[0.5em] mb-1.5">Universal Entity Data</p>
                            <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none">{user?.name}</h2>
                            <div className="flex items-center gap-3 mt-3">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${user?.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                    {user?.status}
                                </span>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">{user?.role}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-8 py-3 bg-obs-blue/20 hover:bg-obs-blue text-white rounded-2xl border border-obs-blue/30 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-3 group"
                                type="button"
                            >
                                <Zap size={16} className="group-hover:animate-pulse" />
                                Edit Protocol
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-8 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest transition-all"
                                type="button"
                            >
                                Cancel Sync
                            </button>
                        )}
                        <button onClick={onClose} type="button" className="w-16 h-16 flex items-center justify-center bg-white/5 hover:bg-rose-500 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all group">
                            <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
                        </button>
                    </div>
                </div>

                {/* Profile Body */}
                <form onSubmit={handleUpdate} className="flex-1 overflow-y-auto custom-scrollbar-dark p-12 relative z-10 space-y-16">
                    {/* section grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">

                        {/* 1. Core Identity */}
                        <ProfileSection title="Identity Core" icon={<Fingerprint className="text-obs-blue" size={20} />}>
                            <DataField label="Full Entity Name" value={formData.name} readOnly />
                            <DataField
                                label="Father / Guardian"
                                value={formData.fatherName}
                                isEditing={isEditing}
                                onChange={(val) => handleInputChange('fatherName', val)}
                            />
                            <div className="grid grid-cols-2 gap-6">
                                <DataField
                                    label="Birth Cycle (DOB)"
                                    value={formData.dob}
                                    icon={<Calendar size={12} />}
                                    isEditing={isEditing}
                                    onChange={(val) => handleInputChange('dob', val)}
                                    type="date"
                                />
                                <DataField
                                    label="Gender"
                                    value={formData.gender}
                                    isEditing={isEditing}
                                    onChange={(val) => handleInputChange('gender', val)}
                                    type="select"
                                    options={['Male', 'Female', 'Other']}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <DataField
                                    label="Civil Status"
                                    value={formData.maritalStatus}
                                    isEditing={isEditing}
                                    onChange={(val) => handleInputChange('maritalStatus', val)}
                                    type="select"
                                    options={['Single', 'Married']}
                                />
                                <DataField
                                    label="Nationality"
                                    value={formData.nationality}
                                    icon={<Globe size={12} />}
                                    isEditing={isEditing}
                                    onChange={(val) => handleInputChange('nationality', val)}
                                />
                            </div>
                        </ProfileSection>

                        {/* 2. Communication Node */}
                        <ProfileSection title="Communication Node" icon={<Activity className="text-emerald-500" size={20} />}>
                            <DataField label="Neural Link (Email)" value={formData.email} icon={<Mail size={12} />} lowercase readOnly />
                            <div className="grid grid-cols-2 gap-6">
                                <DataField
                                    label="Primary Frequency"
                                    value={formData.mobileNumber}
                                    icon={<Phone size={12} />}
                                    isEditing={isEditing}
                                    onChange={(val) => handleInputChange('mobileNumber', val)}
                                />
                                <DataField
                                    label="Alternate Frequency"
                                    value={formData.altMobileNumber}
                                    isEditing={isEditing}
                                    onChange={(val) => handleInputChange('altMobileNumber', val)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <DataField
                                    label="Address (House No)"
                                    value={formData.permanentAddress?.houseNo}
                                    isEditing={isEditing}
                                    onChange={(val) => handleInputChange('permanentAddress.houseNo', val)}
                                />
                                <DataField
                                    label="City"
                                    value={formData.permanentAddress?.city}
                                    isEditing={isEditing}
                                    onChange={(val) => handleInputChange('permanentAddress.city', val)}
                                />
                                <DataField
                                    label="State"
                                    value={formData.permanentAddress?.state}
                                    isEditing={isEditing}
                                    onChange={(val) => handleInputChange('permanentAddress.state', val)}
                                />
                                <DataField
                                    label="Pincode"
                                    value={formData.permanentAddress?.pincode}
                                    isEditing={isEditing}
                                    onChange={(val) => handleInputChange('permanentAddress.pincode', val)}
                                />
                            </div>
                        </ProfileSection>

                        {/* 3. Asset Config */}
                        <ProfileSection title="Asset Configuration" icon={<Zap className="text-amber-500" size={20} />}>
                            <div className="grid grid-cols-2 gap-6">
                                <DataField label="Vault Number" value={formData.accountNumber} mono color="text-obs-blue" readOnly />
                                <DataField label="Sync Protocol" value={formData.accountType} readOnly />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <DataField label="Asset Parity" value={`₹ ${formData.balance?.toLocaleString()}`} readOnly />
                                <DataField label="Daily Sync Limit" value={formData.dailyLimit ? `₹ ${formData.dailyLimit.toLocaleString()}` : 'UNLIMITED'} readOnly />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <DataField label="Operation Mode" value={formData.modeOfOperation} readOnly />
                                <DataField label="Passbook Issued" value={formData.passbookIssued ? 'YES' : 'NO'} readOnly />
                            </div>
                        </ProfileSection>

                        {/* 4. Nominee Protection */}
                        <ProfileSection title="Nominee Protection" icon={<Lock className="text-rose-500" size={20} />} className="xl:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                                <DataField
                                    label="Nominee Identity"
                                    value={formData.nominee?.name}
                                    isEditing={isEditing}
                                    onChange={(val) => handleInputChange('nominee.name', val)}
                                />
                                <DataField
                                    label="Relationship Link"
                                    value={formData.nominee?.relationship}
                                    isEditing={isEditing}
                                    onChange={(val) => handleInputChange('nominee.relationship', val)}
                                />
                                <DataField
                                    label="Nominee DOB"
                                    value={formData.nominee?.dob}
                                    isEditing={isEditing}
                                    onChange={(val) => handleInputChange('nominee.dob', val)}
                                    type="date"
                                />
                                <DataField
                                    label="Nominee Residency"
                                    value={formData.nominee?.address}
                                    isEditing={isEditing}
                                    onChange={(val) => handleInputChange('nominee.address', val)}
                                />
                            </div>
                        </ProfileSection>
                    </div>

                    {isEditing && (
                        <div className="pt-8 flex flex-col items-center gap-6">
                            <button
                                type="submit"
                                disabled={syncing}
                                className={`w-full max-w-md py-6 bg-gradient-to-r from-obs-blue to-indigo-700 hover:from-obs-blue hover:to-obs-blue text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.6em] transition-all shadow-2xl shadow-obs-blue/30 active:scale-[0.98] border border-white/10 flex items-center justify-center gap-5 ${syncing ? 'opacity-50' : ''}`}
                            >
                                {syncing ? <RotateCw size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                                {syncing ? 'Synchronizing Data...' : 'Commit Operational Changes'}
                            </button>

                            {status && (
                                <div className={`p-6 rounded-2xl border flex items-center gap-4 animate-in zoom-in-95 ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
                                    {status.type === 'success' ? <CheckCircle size={16} /> : <X size={16} />}
                                    <p className="text-[10px] font-black uppercase tracking-widest">{status.message}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Footer Warning */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="p-3 bg-obs-blue/10 rounded-xl text-obs-blue">
                                <Info size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1.5">Data Integrity Protocol</p>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest max-w-xl">
                                    {isEditing ? 'COMMIT MODE ACTIVE: All changes must adhere to Nova Security standards. Transaction hashes will be logged.' : 'VIEW MODE ACTIVE: Universal entity data synchronized with the global ledger.'}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Temporal Reference</p>
                            <p className="text-[10px] font-black text-white tabular-nums italic uppercase">NODE_{user?._id?.slice(-8).toUpperCase()}</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

function ProfileSection({ title, icon, children, className = "" }) {
    return (
        <div className={`space-y-6 ${className}`}>
            <div className="flex items-center gap-4 mb-2">
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 shadow-inner">
                    {icon}
                </div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] italic">{title}</h3>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-inner relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {children}
            </div>
        </div>
    );
}

function DataField({ label, value, icon, mono = false, color = "text-white", lowercase = false, isEditing = false, onChange, type = "text", options = [], readOnly = false }) {
    return (
        <div className="space-y-1.5 relative z-10">
            <p className="text-[7px] font-black text-obs-blue uppercase tracking-[0.3em] ml-1">{label}</p>
            <div className={`bg-[#050b1a]/50 px-5 py-3.5 rounded-2xl border transition-all flex items-center gap-3 ${isEditing && !readOnly ? 'border-obs-blue/40 bg-obs-blue/5' : 'border-white/5'}`}>
                {icon && <div className="text-slate-600 shrink-0">{icon}</div>}
                <div className="flex-1 overflow-hidden">
                    {isEditing && !readOnly ? (
                        type === 'select' ? (
                            <select
                                className={`w-full bg-transparent text-[11px] font-black italic uppercase text-white focus:outline-none appearance-none cursor-pointer`}
                                value={value || ''}
                                onChange={(e) => onChange(e.target.value)}
                            >
                                <option value="" disabled className="bg-[#0a1226]">Select {label}</option>
                                {options.map(opt => <option key={opt} value={opt} className="bg-[#0a1226]">{opt}</option>)}
                            </select>
                        ) : (
                            <input
                                type={type}
                                className={`w-full bg-transparent text-[11px] font-black italic tracking-tight text-white focus:outline-none ${mono ? 'font-mono' : ''} ${lowercase ? '' : 'uppercase'}`}
                                value={value || ''}
                                onChange={(e) => onChange(e.target.value)}
                            />
                        )
                    ) : (
                        <span className={`text-[11px] font-black italic tracking-tight ${mono ? 'font-mono tracking-wider' : ''} ${color} ${lowercase ? '' : 'uppercase'}`}>
                            {value || 'DATA_NULL'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

function AppointmentModal({ onClose, refreshData }) {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [reason, setReason] = useState('');
    const [syncing, setSyncing] = useState(false);
    const [status, setStatus] = useState(null);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await axios.get('/clerk/customer/appointments');
                setAppointments(res.data);
            } catch (err) {
                console.error('Failed to fetch appointments', err);
            }
        };
        fetchAppointments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSyncing(true);
        try {
            await axios.post('/clerk/appointments/request', { date, time, reason });
            setStatus({ type: 'success', message: 'Appointment Requested' });
            setTimeout(() => {
                onClose();
                refreshData();
            }, 2000);
        } catch (err) {
            setStatus({ type: 'error', message: 'Request Failed' });
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-[#050b1a]/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={onClose}></div>
            <div className="relative w-full max-w-4xl bg-[#0a1226]/80 rounded-[4rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-700 flex flex-col h-[80vh]">
                <div className="p-10 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-obs-blue rounded-2xl shadow-2xl shadow-obs-blue/30">
                            <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-obs-blue uppercase tracking-[0.5em] mb-1">Human Interaction Portal</p>
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Schedule_Synchronizer</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-rose-500 rounded-2xl text-slate-400 hover:text-white transition-all">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-6">
                            <h3 className="text-xs font-black text-white uppercase tracking-widest italic flex items-center gap-3">
                                <Zap className="w-4 h-4 text-obs-blue" /> New Sync Request
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <DataField label="Temporal Link Date" value={date} type="date" isEditing={true} onChange={setDate} />
                                    <DataField label="Temporal Link Time" value={time} type="time" isEditing={true} onChange={setTime} />
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[7px] font-black text-obs-blue uppercase tracking-[0.3em] ml-1">Objective Parameters</p>
                                    <textarea
                                        className="w-full bg-[#050b1a]/50 border border-white/5 rounded-2xl p-4 text-xs font-black italic text-white focus:outline-none focus:border-obs-blue/40 transition-all h-32"
                                        placeholder="Enter the objective for this interaction..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                </div>
                                <button
                                    disabled={syncing || !date || !time}
                                    className="w-full py-5 bg-obs-blue hover:bg-obs-blue/80 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-obs-blue/20 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {syncing ? 'Broadcasting...' : 'Broadcast Sync Request'}
                                </button>
                                {status && (
                                    <div className={`p-4 rounded-xl border text-[10px] font-black uppercase tracking-widest text-center ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
                                        {status.message}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest italic border-b border-white/5 pb-4">Active Sync Channels</h3>
                        <div className="space-y-4">
                            {appointments.length === 0 ? (
                                <div className="text-center py-12 opacity-20">
                                    <Activity size={48} className="mx-auto mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No Active Links</p>
                                </div>
                            ) : appointments.map((appt) => (
                                <div key={appt._id} className="bg-white/5 border border-white/5 p-6 rounded-3xl group hover:border-obs-blue/30 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-sm font-black text-white italic uppercase">{appt.date} @ {appt.time}</p>
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Status: {appt.status}</p>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${appt.status === 'scheduled' ? 'bg-obs-blue shadow-[0_0_10px_rgba(37,99,235,0.8)]' : 'bg-amber-500 animate-pulse'}`}></div>
                                    </div>
                                    {appt.appointmentLink && (
                                        <a href={appt.appointmentLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-obs-blue/10 border border-obs-blue/20 rounded-xl text-[10px] font-black text-obs-blue uppercase tracking-widest hover:bg-obs-blue hover:text-white transition-all">
                                            <Activity size={14} /> Established Link Terminal
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CustomerFormModal({ formRequest, onClose, refreshData }) {
    const [formData, setFormData] = useState({});
    const [syncing, setSyncing] = useState(false);
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSyncing(true);
        try {
            await axios.put(`/clerk/forms/${formRequest._id}/fill`, { formData });
            setStatus({ type: 'success', message: 'Protocol Transmitted' });
            setTimeout(() => {
                onClose();
                refreshData();
            }, 2000);
        } catch (err) {
            setStatus({ type: 'error', message: 'Transmission Failed' });
        } finally {
            setSyncing(false);
        }
    };

    const renderField = (label, key) => (
        <div className="space-y-1.5" key={key}>
            <p className="text-[7px] font-black text-obs-blue uppercase tracking-[0.3em] ml-1">{label}</p>
            <input
                type="text"
                className="w-full bg-[#050b1a]/50 border border-white/5 rounded-2xl py-4 px-6 text-xs font-black italic text-white focus:outline-none focus:border-obs-blue/40 transition-all"
                value={formData[key] || ''}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                required
            />
        </div>
    );

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-[#050b1a]/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl bg-[#0a1226]/80 rounded-[4rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-700 flex flex-col max-h-[90vh]">
                <div className="p-10 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-indigo-600 rounded-2xl">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-1">Form Data Packet</p>
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{formRequest.formType}</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-rose-500 rounded-2xl text-slate-400 hover:text-white transition-all">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-8">
                    <div className="bg-indigo-500/5 border border-indigo-500/10 p-6 rounded-3xl flex gap-4 items-center">
                        <Info className="text-indigo-400 shrink-0" size={20} />
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                            Clerk <span className="text-white italic">Node_{formRequest.clerk?.name}</span> has requested this data injection. Please populate all parameters for GM verification.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {formRequest.formType === 'Account Opening' && (
                            <>
                                {renderField('Source of Funds', 'sourceOfFunds')}
                                {renderField('Annual Synergy (Income)', 'annualIncome')}
                                {renderField('Occupation Node', 'occupation')}
                                {renderField('Expected Monthly Sync Volume', 'monthlyVolume')}
                            </>
                        )}
                        {formRequest.formType !== 'Account Opening' && (
                            <>
                                {renderField('Primary Objective', 'objective')}
                                {renderField('Security Authorization Hash (Aadhaar/PAN)', 'identityHash')}
                                {renderField('Operational Value', 'value')}
                                {renderField('Verification Token', 'token')}
                            </>
                        )}
                    </div>

                    <div className="pt-8">
                        <button
                            disabled={syncing}
                            className="w-full py-6 bg-gradient-to-r from-indigo-600 to-obs-blue hover:from-indigo-500 hover:to-obs-blue text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.6em] transition-all shadow-xl shadow-indigo-900/40 active:scale-95 border border-white/10"
                        >
                            {syncing ? 'Injecting Data...' : 'Transmit Form Protocol'}
                        </button>
                        {status && (
                            <div className={`mt-4 p-4 rounded-xl border text-[10px] font-black uppercase tracking-widest text-center ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
                                {status.message}
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

function ActiveFormProtocolSection({ setActiveFormRequest }) {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const res = await axios.get('/clerk/customer/forms');
                setForms(res.data);
            } catch (err) {
                console.error('Failed to fetch forms', err);
            } finally {
                setLoading(false);
            }
        };
        fetchForms();
    }, []);

    return (
        <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] hover:border-obs-blue/30 transition-all group/service">
            <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400 group-hover/service:bg-indigo-600 group-hover/service:text-white transition-all shadow-xl shadow-indigo-900/10">
                    <FileText size={28} />
                </div>
                <Zap className="w-5 h-5 text-indigo-900 group-hover/service:text-indigo-400 transition-colors" />
            </div>
            <h4 className="text-lg font-black text-white italic uppercase tracking-tighter mb-2">Form Protocol Hub</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">Active data packets sent by Bank Clerks awaiting your injection for Sovereign Network verification.</p>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-4 opacity-50"><RotateCw className="animate-spin text-indigo-400" /></div>
                ) : forms.length === 0 ? (
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                        <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none">All Protocols Synced</p>
                    </div>
                ) : forms.map(form => (
                    <button
                        key={form._id}
                        onClick={() => setActiveFormRequest(form)}
                        className="w-full p-4 bg-white/5 hover:bg-indigo-600 border border-white/5 hover:border-indigo-400 rounded-2xl flex justify-between items-center group/item transition-all"
                    >
                        <div className="text-left">
                            <p className="text-[10px] font-black text-white uppercase italic">{form.formType}</p>
                            <p className="text-[8px] font-black text-slate-500 group-hover/item:text-indigo-200 uppercase tracking-widest mt-1">Clerk Sync: {form.clerk?.name}</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-700 group-hover/item:text-white group-hover/item:translate-x-1 transition-all" />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
