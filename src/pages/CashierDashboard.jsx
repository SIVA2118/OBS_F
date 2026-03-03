import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    LayoutDashboard, Users, Zap, Shield, Search, Filter,
    ChevronRight, Clock, CreditCard, RotateCw,
    ArrowUpRight, ArrowDownLeft, Activity, Info, Lock,
    CheckCircle, X, DollarSign, Wallet, Fingerprint
} from 'lucide-react';

const CashierDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [customers, setCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [syncing, setSyncing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeModule, setActiveModule] = useState(null); // 'deposit' | 'withdraw'
    const [activeTab, setActiveTab] = useState('records'); // 'station' | 'records' | 'history'
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/admin/customers');
            setCustomers(res.data);
        } catch (err) {
            console.error('Error fetching customers', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const url = selectedCustomer
                ? `/admin/customers/${selectedCustomer._id}/transactions`
                : '/admin/transactions';
            const res = await axios.get(url);
            setHistory(res.data);
        } catch (err) {
            console.error('Error fetching history', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'history') {
            fetchHistory();
        }
    }, [activeTab, selectedCustomer]);

    const handleSync = async (e) => {
        e.preventDefault();
        if (!selectedCustomer || !activeModule) return;

        setSyncing(true);

        try {
            const endpoint = `/admin/customers/${selectedCustomer._id}/${activeModule}`;
            const res = await axios.post(endpoint, {
                amount: Number(amount),
                description: description || `Counter ${activeModule === 'deposit' ? 'Refill' : 'Withdrawal'}`
            });

            Swal.fire({
                icon: 'success',
                title: 'Parity Synchronized',
                text: res.data.message,
                background: '#0a1226',
                color: '#fff',
                iconColor: '#0ea5e9',
                confirmButtonColor: '#0ea5e9',
                customClass: { popup: 'rounded-[4rem] border border-white/10 shadow-2xl backdrop-blur-2xl' }
            });

            // Refresh local data
            const updatedCustomers = customers.map(c =>
                c._id === selectedCustomer._id ? { ...c, balance: res.data.balance } : c
            );
            setCustomers(updatedCustomers);
            setSelectedCustomer({ ...selectedCustomer, balance: res.data.balance });

            setAmount('');
            setDescription('');
            setActiveModule(null);
            setSyncing(false);

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Protocol Violation',
                text: err.response?.data?.error || 'Neural link interrupted during sync.',
                background: '#0a1226',
                color: '#fff',
                confirmButtonColor: '#0ea5e9',
                customClass: { popup: 'rounded-[4rem] border border-white/10 shadow-2xl backdrop-blur-2xl' }
            });
            setSyncing(false);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.accountNumber?.includes(searchQuery) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-[#050b1a] font-sans text-slate-300 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-80 bg-[#0a1226]/80 backdrop-blur-xl flex flex-col border-r border-white/5 shadow-[20px_0_40px_rgba(0,0,0,0.4)] z-30">
                <div className="p-8 flex items-center gap-4 border-b border-white/5 bg-gradient-to-r from-obs-blue/20 to-transparent">
                    <div className="bg-obs-blue/20 p-2.5 rounded-2xl border border-obs-blue/30 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                        <Zap className="w-6 h-6 text-obs-blue animate-pulse" />
                    </div>
                    <div>
                        <h1 className="font-black text-xl tracking-tighter text-white">OBS <span className="text-obs-blue">CASHIER</span></h1>
                        <p className="text-[8px] font-black text-obs-blue uppercase tracking-[0.4em] leading-none mt-1">Operational Node</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-10 space-y-8">
                    <div>
                        <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Main Control</p>
                        <nav className="space-y-4">
                            <SidebarLink
                                icon={<LayoutDashboard size={20} />}
                                label="STATION_CENTER"
                                active={activeTab === 'station'}
                                onClick={() => setActiveTab('station')}
                            />
                            <SidebarLink
                                icon={<Users size={20} />}
                                label="CLIENT_RECORDS"
                                active={activeTab === 'records'}
                                onClick={() => setActiveTab('records')}
                            />
                            <SidebarLink
                                icon={<Activity size={20} />}
                                label="SYNC_HISTORY"
                                active={activeTab === 'history'}
                                onClick={() => setActiveTab('history')}
                            />
                        </nav>
                    </div>

                    <div className="px-4 py-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="w-4 h-4 text-obs-blue" />
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Station Secure</p>
                        </div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase leading-relaxed">System synchronized with global ledger. All transactions encrypted at source.</p>
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-[#0a1226]/50">
                    <div className="bg-[#0f172a]/50 p-4 rounded-3xl flex items-center gap-4 border border-white/10 mb-5 backdrop-blur-md">
                        <div className="w-12 h-12 bg-gradient-to-br from-obs-blue to-indigo-700 rounded-2xl flex items-center justify-center font-black text-white shadow-lg border border-white/10 shrink-0">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-white truncate italic uppercase tracking-tighter leading-none mb-1">{user?.name}</p>
                            <p className="text-[9px] text-obs-blue font-black uppercase tracking-[0.2em]">{user?.role}</p>
                        </div>
                    </div>
                    <button onClick={logout} className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 transition-all group font-black uppercase tracking-widest text-[9px] border border-white/5 hover:border-rose-500/20">
                        <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Terminate Node
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-obs-blue/5 rounded-full blur-[150px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none"></div>

                <header className="px-12 py-8 flex justify-between items-center border-b border-white/5 relative z-10 bg-[#050b1a]/50 backdrop-blur-md">
                    <div>
                        <p className="text-[10px] font-black text-obs-blue uppercase tracking-[0.4em] mb-1">System Location: OBS_STATION_04</p>
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Operational <span className="text-obs-blue">Sync Hub</span></h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Network Latency</p>
                            <div className="flex items-center gap-2 justify-end">
                                <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                                <span className="text-xs font-black text-white italic uppercase tracking-tighter">Synchronized</span>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-white/10"></div>
                        <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 shadow-inner">
                            <Clock className="w-4 h-4 text-obs-blue" />
                            <span className="text-xs font-black text-white italic tabular-nums">{new Date().toLocaleTimeString()}</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-12 overflow-hidden flex flex-col relative z-10">
                    <div className="grid grid-cols-12 gap-12 h-full overflow-hidden">
                        {activeTab === 'station' ? (
                            <>
                                {/* Directory List */}
                                <div className="col-span-12 lg:col-span-4 flex flex-col gap-8 h-full overflow-hidden">
                                    <div className="relative group">
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-obs-blue transition-colors" size={20} />
                                        <input
                                            type="text"
                                            placeholder="SEARCH ENTITY PROTOCOL..."
                                            className="w-full bg-[#0a1226] border border-white/10 rounded-3xl py-6 pl-16 pr-8 text-white font-mono text-xs tracking-widest focus:outline-none focus:border-obs-blue/50 transition-all shadow-inner uppercase"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex-1 bg-[#0a1226]/50 border border-white/5 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl">
                                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                            <h3 className="font-black text-white text-xs uppercase tracking-widest italic">Client Search Results</h3>
                                            <span className="bg-obs-blue/10 text-obs-blue px-3 py-1 rounded-full text-[9px] font-black">{filteredCustomers.length} NODES</span>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar-dark">
                                            {loading ? (
                                                <div className="flex flex-col items-center justify-center h-40 gap-4 opacity-50">
                                                    <RotateCw className="w-8 h-8 text-obs-blue animate-spin" />
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Streaming Node Data...</p>
                                                </div>
                                            ) : filteredCustomers.map(c => (
                                                <button
                                                    key={c._id}
                                                    onClick={() => { setSelectedCustomer(c); setActiveModule(null); setStatus(null); }}
                                                    className={`w-full text-left p-5 rounded-[2rem] border transition-all flex items-center gap-5 group relative overflow-hidden ${selectedCustomer?._id === c._id ? 'bg-obs-blue border-obs-blue text-white shadow-xl shadow-obs-blue/20 -translate-y-1' : 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/[0.05] hover:border-white/10'}`}
                                                >
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl italic ${selectedCustomer?._id === c._id ? 'bg-white/20 text-white' : 'bg-[#0f172a] text-obs-blue border border-white/5'}`}>
                                                        {c.name.charAt(0)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="truncate font-black text-[13px] italic tracking-tight uppercase">{c.name}</p>
                                                        <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${selectedCustomer?._id === c._id ? 'text-white/60' : 'text-slate-600'}`}>ID: {c.accountNumber}</p>
                                                    </div>
                                                    <ChevronRight className={`w-4 h-4 transition-all ${selectedCustomer?._id === c._id ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Operational Command Center */}
                                <div className="col-span-12 lg:col-span-8 h-full overflow-hidden">
                                    {selectedCustomer ? (
                                        <div className="bg-[#0a1226]/50 border border-white/5 rounded-[4rem] h-full flex flex-col overflow-hidden shadow-2xl relative">
                                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                                <Shield size={200} className="text-obs-blue" />
                                            </div>

                                            <div className="p-8 border-b border-white/5 flex flex-col xl:flex-row justify-between items-center gap-6 relative z-10">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-16 h-16 bg-gradient-to-br from-obs-blue to-indigo-700 rounded-[1.5rem] flex items-center justify-center text-2xl font-black text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)] border border-white/20 italic shrink-0">
                                                        {selectedCustomer.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-black text-white tracking-tighter italic uppercase leading-none">{selectedCustomer.name}</h3>
                                                        <div className="flex items-center gap-2.5 mt-2">
                                                            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shadow-lg shadow-emerald-500/5">
                                                                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                                                                <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                                                            </div>
                                                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic">{selectedCustomer.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-[#0f172a]/50 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/10 min-w-[220px] shadow-2xl relative overflow-hidden group/parity">
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-obs-blue/10 to-transparent opacity-0 group-hover/parity:opacity-100 transition-opacity"></div>
                                                    <p className="text-[8px] font-black text-obs-blue uppercase tracking-[0.4em] mb-1.5 relative z-10 text-center text-opacity-80">Asset Parity</p>
                                                    <div className="flex items-baseline justify-center gap-2.5 relative z-10">
                                                        <span className="text-sm font-light text-obs-blue italic">₹</span>
                                                        <p className="text-2xl font-black text-white italic tabular-nums tracking-tighter drop-shadow-2xl">
                                                            {selectedCustomer.balance?.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar-dark relative z-10">
                                                <div className="space-y-12">
                                                    <div>
                                                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                                                            <Zap className="w-4 h-4 text-obs-blue" /> Choose Operational Module
                                                        </h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                            <button
                                                                onClick={() => setActiveModule('deposit')}
                                                                className={`group p-5 rounded-[2rem] border transition-all text-left flex items-center gap-5 relative overflow-hidden h-[100px] ${activeModule === 'deposit' ? 'bg-emerald-500/10 border-emerald-500/40 shadow-2xl shadow-emerald-500/10' : 'bg-white/[0.02] border-white/10 hover:border-emerald-500/30'}`}
                                                            >
                                                                <div className={`p-3 rounded-[1.2rem] transition-all shrink-0 ${activeModule === 'deposit' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40' : 'bg-[#0f172a] text-emerald-500 border border-white/5 group-hover:scale-110'}`}>
                                                                    <ArrowDownLeft className="w-5 h-5" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-base font-black text-white italic uppercase tracking-tight mb-0.5 leading-none">Cash In</p>
                                                                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest leading-none opacity-60">Sync Asset Refill</p>
                                                                </div>
                                                            </button>
                                                            <button
                                                                onClick={() => setActiveModule('withdraw')}
                                                                className={`group p-5 rounded-[2rem] border transition-all text-left flex items-center gap-5 relative overflow-hidden h-[100px] ${activeModule === 'withdraw' ? 'bg-obs-blue/10 border-obs-blue/40 shadow-2xl shadow-obs-blue/10' : 'bg-white/[0.02] border-white/10 hover:border-obs-blue/30'}`}
                                                            >
                                                                <div className={`p-3 rounded-[1.2rem] transition-all shrink-0 ${activeModule === 'withdraw' ? 'bg-obs-blue text-white shadow-lg shadow-obs-blue/40' : 'bg-[#0f172a] text-obs-blue border border-white/5 group-hover:scale-110'}`}>
                                                                    <ArrowUpRight className="w-5 h-5" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-base font-black text-white italic uppercase tracking-tight mb-0.5 leading-none">Cash Out</p>
                                                                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest leading-none opacity-60">Deploy Asset Parity</p>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {activeModule && (
                                                        <div className="animate-in slide-in-from-bottom-8 duration-700 bg-white/[0.02] rounded-[4rem] border border-white/5 p-12 relative overflow-hidden">
                                                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                                                <Activity size={120} className="text-obs-blue" />
                                                            </div>
                                                            <div className="flex items-center gap-6 mb-10">
                                                                <div className={`p-4 rounded-2xl ${activeModule === 'deposit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-obs-blue/10 text-obs-blue'}`}>
                                                                    {activeModule === 'deposit' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                                                                </div>
                                                                <h5 className="text-2xl font-black text-white italic uppercase tracking-tight">
                                                                    {activeModule === 'deposit' ? 'Asset Injection Protocol' : 'Asset Extraction Sync'}
                                                                </h5>
                                                            </div>

                                                            <form onSubmit={handleSync} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                                <div className="space-y-8 col-span-2 md:col-span-1">
                                                                    <div className="relative group">
                                                                        <label className="text-[8px] font-black text-obs-blue uppercase tracking-[0.5em] absolute -top-2 left-8 bg-[#0a1226] px-4 z-10 border-x border-obs-blue/20">Operational Value</label>
                                                                        <div className="relative">
                                                                            <div className="absolute inset-y-0 left-8 flex items-center text-slate-600 group-focus-within:text-obs-blue transition-all text-2xl font-black italic">₹</div>
                                                                            <input
                                                                                type="number"
                                                                                required
                                                                                placeholder="0.00"
                                                                                className="w-full bg-white/[0.02] border border-white/10 rounded-[2.5rem] py-8 pl-16 pr-8 text-white font-mono text-2xl font-black tracking-widest focus:outline-none focus:border-obs-blue/50 focus:bg-white/[0.04] transition-all placeholder:text-slate-800 shadow-inner"
                                                                                value={amount}
                                                                                onChange={(e) => setAmount(e.target.value)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-8 col-span-2 md:col-span-1">
                                                                    <div className="relative group">
                                                                        <label className="text-[8px] font-black text-obs-blue uppercase tracking-[0.5em] absolute -top-2 left-8 bg-[#0a1226] px-4 z-10 border-x border-obs-blue/20">Memo / Log Entry</label>
                                                                        <input
                                                                            type="text"
                                                                            placeholder="SYSTEM_LOG_DEFAULT"
                                                                            className="w-full bg-white/[0.02] border border-white/10 rounded-[2.5rem] py-8 px-10 text-white font-mono text-xs tracking-widest focus:outline-none focus:border-obs-blue/50 focus:bg-white/[0.04] transition-all placeholder:text-slate-800 shadow-inner uppercase"
                                                                            value={description}
                                                                            onChange={(e) => setDescription(e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-span-2 pt-4">
                                                                    <button
                                                                        disabled={syncing}
                                                                        className={`w-full py-8 group relative overflow-hidden bg-gradient-to-r from-obs-blue to-indigo-700 hover:from-obs-blue/80 hover:to-obs-blue rounded-[2.5rem] font-black text-xs uppercase tracking-[0.6em] transition-all shadow-[0_20px_40px_rgba(37,99,235,0.25)] active:scale-[0.98] border border-white/10 flex items-center justify-center gap-5 ${syncing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                    >
                                                                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                                        {syncing ? (
                                                                            <>
                                                                                <RotateCw className="w-5 h-5 animate-spin" />
                                                                                Optimizing Parity...
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                                                Authorize Final Deployment
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-[#0a1226]/30 border-4 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center text-center p-12 h-full opacity-60">
                                            <div className="w-32 h-32 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/5 shadow-inner">
                                                <Users className="w-12 h-12 text-slate-700" />
                                            </div>
                                            <h3 className="text-3xl font-black text-slate-500 tracking-tight uppercase italic">Awaiting Operational Target</h3>
                                            <p className="text-slate-600 font-bold max-w-sm mt-4 italic uppercase tracking-widest text-[10px]">Select a client from the secure directory to begin asset synchronization.</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : activeTab === 'records' ? (
                            <div className="col-span-12 h-full overflow-hidden flex flex-col">
                                <div className="bg-[#0a1226]/50 border border-white/5 rounded-[4rem] flex-1 flex flex-col overflow-hidden shadow-2xl">
                                    <div className="p-12 border-b border-white/5 flex justify-between items-center">
                                        <div>
                                            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Global <span className="text-obs-blue">Client Directory</span></h3>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">Authenticated System Nodes</p>
                                        </div>
                                        <div className="relative group w-96">
                                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-obs-blue transition-colors" size={18} />
                                            <input
                                                type="text"
                                                placeholder="FILTER NODES..."
                                                className="w-full bg-[#050b1a] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white font-mono text-[10px] tracking-widest focus:outline-none focus:border-obs-blue/50 transition-all uppercase"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-12 custom-scrollbar-dark">
                                        <table className="w-full text-left border-separate border-spacing-y-4">
                                            <thead>
                                                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                                                    <th className="px-8 py-4">Node Entity</th>
                                                    <th className="px-8 py-4">Account Protocol</th>
                                                    <th className="px-8 py-4">Contact Link</th>
                                                    <th className="px-8 py-4">Asset Parity</th>
                                                    <th className="px-8 py-4 text-right">Operations</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-xs">
                                                {filteredCustomers.map(c => (
                                                    <tr key={c._id} className="group">
                                                        <td className="px-8 py-6 bg-white/[0.02] border-y border-l border-white/5 rounded-l-[2rem] group-hover:bg-white/[0.04] transition-all">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 bg-gradient-to-br from-obs-blue/20 to-indigo-600/20 rounded-xl flex items-center justify-center font-black text-obs-blue border border-obs-blue/10 italic">
                                                                    {c.name.charAt(0)}
                                                                </div>
                                                                <span className="font-black text-white uppercase italic tracking-tighter text-sm">{c.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6 bg-white/[0.02] border-y border-white/5 group-hover:bg-white/[0.04] transition-all font-mono text-obs-blue">{c.accountNumber}</td>
                                                        <td className="px-8 py-6 bg-white/[0.02] border-y border-white/5 group-hover:bg-white/[0.04] transition-all text-slate-500 font-bold uppercase tracking-widest text-[9px]">{c.email}</td>
                                                        <td className="px-8 py-6 bg-white/[0.02] border-y border-white/5 group-hover:bg-white/[0.04] transition-all font-black text-white tabular-nums">₹ {c.balance?.toLocaleString()}</td>
                                                        <td className="px-8 py-6 bg-white/[0.02] border-y border-r border-white/5 rounded-r-[2rem] group-hover:bg-white/[0.04] transition-all text-right">
                                                            <button
                                                                onClick={() => { setSelectedCustomer(c); setActiveTab('history'); }}
                                                                className="bg-obs-blue/10 hover:bg-obs-blue text-obs-blue hover:text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-obs-blue/20 shadow-lg shadow-obs-blue/5"
                                                            >
                                                                Sync History
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="col-span-12 h-full overflow-hidden flex flex-col">
                                <div className="bg-[#0a1226]/50 border border-white/5 rounded-[3rem] flex-1 flex flex-col overflow-hidden shadow-2xl">
                                    <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-obs-blue/5 to-transparent">
                                        <div className="flex items-center gap-6">
                                            {selectedCustomer && (
                                                <div className="w-12 h-12 bg-obs-blue/20 rounded-xl flex items-center justify-center font-black text-obs-blue border border-obs-blue/20 animate-pulse">
                                                    {selectedCustomer.name.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                                                    {selectedCustomer ? `${selectedCustomer.name} ` : 'Unified '}
                                                    <span className="text-obs-blue">Sync Ledger</span>
                                                </h3>
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2 text-opacity-80">
                                                    {selectedCustomer ? 'Node-Specific Activity' : 'Temporal Asset Movements'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {selectedCustomer && (
                                                <button
                                                    onClick={() => setActiveTab('station')}
                                                    className="px-6 py-2.5 bg-obs-blue/10 hover:bg-obs-blue text-obs-blue hover:text-white rounded-xl border border-obs-blue/20 text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-obs-blue/5 flex items-center gap-2"
                                                >
                                                    <Zap size={14} /> Open Station
                                                </button>
                                            )}
                                            <button onClick={fetchHistory} className="p-3 bg-white/5 hover:bg-obs-blue/20 rounded-xl border border-white/5 text-obs-blue transition-all">
                                                <RotateCw size={14} className={loading ? 'animate-spin' : ''} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-10 custom-scrollbar-dark">
                                        {loading && history.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full gap-4 opacity-40">
                                                <RotateCw className="w-10 h-10 text-obs-blue animate-spin" />
                                                <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">Streaming Ledger History...</p>
                                            </div>
                                        ) : (
                                            <table className="w-full text-left border-separate border-spacing-y-3">
                                                <thead>
                                                    <tr className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">
                                                        <th className="px-6 py-3">Sequence</th>
                                                        <th className="px-6 py-3">Interaction Node</th>
                                                        <th className="px-6 py-3">Type</th>
                                                        <th className="px-6 py-3">Asset Delta</th>
                                                        <th className="px-6 py-3 text-right">Timestamp</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-[11px] font-bold">
                                                    {history.map((tx, idx) => (
                                                        <tr key={tx._id} className="group/row">
                                                            <td className="px-6 py-4 bg-white/[0.01] border-y border-l border-white/5 rounded-l-2xl group-hover/row:bg-white/[0.03] transition-all font-mono text-[9px] text-slate-500">
                                                                #{history.length - idx}
                                                            </td>
                                                            <td className="px-6 py-4 bg-white/[0.01] border-y border-white/5 group-hover/row:bg-white/[0.03] transition-all">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black italic border ${tx.type === 'transfer' ? 'bg-obs-blue/20 text-obs-blue border-obs-blue/20' : tx.type === 'deposit' ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/20 text-rose-500 border-rose-500/20'}`}>
                                                                        {tx.type === 'deposit' ? 'IN' : tx.type === 'withdraw' ? 'OUT' : 'TX'}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-white uppercase tracking-tight leading-none mb-1">
                                                                            {tx.type === 'deposit' ? tx.receiver?.name : tx.sender?.name}
                                                                        </p>
                                                                        <p className="text-[8px] text-slate-500 uppercase tracking-widest leading-none">
                                                                            {tx.type === 'transfer' ? `To: ${tx.receiver?.name}` : tx.description}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 bg-white/[0.01] border-y border-white/5 group-hover/row:bg-white/[0.03] transition-all">
                                                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : tx.type === 'withdraw' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-obs-blue/10 text-obs-blue border-obs-blue/20'}`}>
                                                                    {tx.type}
                                                                </span>
                                                            </td>
                                                            <td className={`px-6 py-4 bg-white/[0.01] border-y border-white/5 group-hover/row:bg-white/[0.03] transition-all font-black italic tabular-nums ${tx.type === 'deposit' ? 'text-emerald-500' : tx.type === 'withdraw' ? 'text-rose-500' : 'text-white'}`}>
                                                                {tx.type === 'deposit' ? '+' : tx.type === 'withdraw' ? '-' : ''}₹{tx.amount?.toLocaleString()}
                                                            </td>
                                                            <td className="px-6 py-4 bg-white/[0.01] border-y border-r border-white/5 rounded-r-2xl group-hover/row:bg-white/[0.03] transition-all text-right font-mono text-[9px] text-slate-500">
                                                                {new Date(tx.date).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                                                                <br />
                                                                {new Date(tx.date).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div >

                <footer className="px-12 py-6 border-t border-white/5 bg-[#050b1a]/50 backdrop-blur-md flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Station: ACTIVE</span>
                        </div>
                        <div className="w-px h-4 bg-white/5"></div>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest underline decoration-obs-blue/40">AUTH_PROTOCOL: OBS_NOVA_SECURE</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Fingerprint className="w-3 h-3 text-obs-blue" size={14} />
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">2026 Online Banking application/Developed NITHIN K A</span>
                    </div>
                </footer>
            </main >

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar-dark::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar-dark::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: rgba(37, 99, 235, 0.2); border-radius: 10px; }
                .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover { background: rgba(37, 99, 235, 0.4); }
            `}} />
        </div >
    );
};

const SidebarLink = ({ icon, label, active = false, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-5 px-6 py-5 rounded-[1.5rem] transition-all duration-500 group relative overflow-hidden ${active ? 'bg-gradient-to-r from-obs-blue/20 to-transparent text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
    >
        {active && <div className="absolute left-0 top-2 bottom-2 w-1 bg-obs-blue rounded-full shadow-[0_0_15px_rgba(37,99,235,0.8)]"></div>}
        <div className={`transition-all duration-500 shrink-0 ${active ? 'text-obs-blue scale-110 drop-shadow-[0_0_8px_rgba(37,99,235,0.6)]' : 'text-slate-500 group-hover:text-obs-blue group-hover:scale-110'}`}>
            {icon}
        </div>
        <span className={`font-black text-[10px] uppercase tracking-[0.4em] transition-all duration-500 ${active ? 'italic translate-x-1' : 'group-hover:translate-x-1'}`}>
            {label}
        </span>
    </button>
);

const LogOut = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

export default CashierDashboard;
