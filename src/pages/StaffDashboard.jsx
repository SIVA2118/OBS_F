import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    LayoutDashboard, Users, FileText, CheckCircle, XCircle,
    LogOut, Mail, User, Shield, Search, Filter,
    ChevronRight, Clock, AlertCircle, CreditCard, BookOpen,
    ArrowUpRight, ArrowDownLeft, Activity, Info, Menu
} from 'lucide-react';

const StaffDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('customers');
    const [applications, setApplications] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (activeTab === 'applications') fetchApplications();
        if (activeTab === 'customers') fetchCustomers();
    }, [activeTab]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/admin/applications/pending');
            setApplications(res.data);
        } catch (err) {
            console.error('Error fetching applications', err);
        } finally {
            setLoading(false);
        }
    };

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

    const fetchTransactions = async (customerId) => {
        try {
            const res = await axios.get(`/admin/customers/${customerId}/transactions`);
            setTransactions(res.data);
        } catch (err) {
            console.error('Error fetching transactions', err);
        }
    };

    const handleSelectItem = (item) => {
        setSelectedItem(item);
        if (activeTab === 'customers') {
            fetchTransactions(item._id);
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.post(`/admin/applications/${id}/approve`);
            setSelectedItem(null);
            fetchApplications();
        } catch (err) {
            console.error('Approval failed', err);
        }
    };

    const handleGenerateProduct = async (type) => {
        if (!selectedItem) return;
        setActionLoading(true);
        try {
            let endpoint = '';
            let productTitle = '';
            if (type === 'debit') {
                endpoint = `/admin/customers/${selectedItem._id}/generate-debit-card`;
                productTitle = 'Debit Card Generated';
            }
            if (type === 'credit') {
                endpoint = `/admin/customers/${selectedItem._id}/generate-credit-card`;
                productTitle = 'Credit Card Generated';
            }
            if (type === 'passbook') {
                endpoint = `/admin/customers/${selectedItem._id}/issue-passbook`;
                productTitle = 'E-Passbook Issued';
            }

            const res = await axios.post(endpoint);
            Swal.fire({
                icon: 'success',
                title: productTitle,
                text: res.data.message,
                background: '#fff',
                color: '#0f172a',
                confirmButtonColor: '#0ea5e9',
                customClass: { popup: 'rounded-[1.5rem] shadow-xl border border-slate-100' }
            });
            // Refresh customer data
            fetchCustomers();
            const updated = customers.find(c => c._id === selectedItem._id);
            if (updated) setSelectedItem(updated);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Operation Failed',
                text: 'Failed to process request. Please check node connectivity.',
                background: '#fff',
                color: '#0f172a',
                confirmButtonColor: '#0ea5e9',
                customClass: { popup: 'rounded-[1.5rem] shadow-xl border border-slate-100' }
            });
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans">
            {/* Sidebar Overlay for Mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed lg:static inset-y-0 left-0 w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-50 transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-8 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-obs-blue rounded-xl flex items-center justify-center shadow-lg shadow-obs-blue/20">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight">OBS STAFF</h1>
                        <p className="text-[10px] text-obs-blue font-bold uppercase tracking-widest leading-none mt-0.5">Portal</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-4">
                    <button
                        onClick={() => { setActiveTab('applications'); setSelectedItem(null); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'applications' ? 'bg-obs-blue text-white shadow-lg shadow-obs-blue/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Applications</span>
                        {applications.length > 0 && (
                            <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'applications' ? 'bg-white/20' : 'bg-obs-blue text-white'}`}>
                                {applications.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => { setActiveTab('customers'); setSelectedItem(null); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'customers' ? 'bg-obs-blue text-white shadow-lg shadow-obs-blue/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <Users className="w-5 h-5" />
                        <span className="font-medium">Customer Base</span>
                    </button>
                </nav>

                <div className="p-4 mt-auto border-t border-slate-800">
                    <div className="bg-slate-800/50 p-4 rounded-2xl flex items-center gap-3 mb-4 border border-white/5">
                        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold text-obs-blue uppercase">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{user?.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold">Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex justify-between items-center shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-lg md:text-xl font-bold text-slate-800">
                            {activeTab === 'applications' ? 'Queue Management' : 'Customer Relationship Manager'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-slate-500 text-sm font-medium">
                            <Clock className="w-4 h-4 text-obs-blue" />
                            <span>System Synchronized</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto lg:overflow-hidden p-4 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                        {/* List Column */}
                        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm flex flex-col min-h-[400px] lg:h-full overflow-hidden">
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    {activeTab === 'applications' ? <Users className="w-5 h-5 text-obs-blue" /> : <Users className="w-5 h-5 text-sky-500" />}
                                    {activeTab === 'applications' ? 'Waitlist' : 'Active Clients'}
                                </h3>
                                <div className="p-2 bg-slate-100 rounded-xl">
                                    <Search className="w-4 h-4 text-slate-400" />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center h-40 gap-4 opacity-50">
                                        <div className="w-8 h-8 border-4 border-obs-blue/20 border-t-obs-blue rounded-full animate-spin"></div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Streaming Data...</p>
                                    </div>
                                ) : (activeTab === 'applications' ? applications : customers).length === 0 ? (
                                    <div className="text-center py-12 opacity-50">
                                        <CheckCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-sm font-bold text-slate-900 leading-none">Record Empty</p>
                                    </div>
                                ) : (
                                    (activeTab === 'applications' ? applications : customers).map(item => (
                                        <button
                                            key={item._id}
                                            onClick={() => handleSelectItem(item)}
                                            className={`w-full text-left p-4 rounded-2xl transition-all border-2 flex items-center gap-4 group ${selectedItem?._id === item._id ? 'bg-slate-900 border-slate-900 text-white shadow-xl -translate-y-1' : 'bg-white border-transparent hover:border-slate-100 hover:bg-slate-50 text-slate-900 shadow-sm'}`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${selectedItem?._id === item._id ? 'bg-white/10 text-white' : 'bg-slate-100 text-obs-blue'}`}>
                                                {item.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold truncate text-sm">{item.name}</p>
                                                <p className={`text-[10px] uppercase tracking-widest font-bold mt-0.5 ${selectedItem?._id === item._id ? 'text-white/50' : 'text-slate-400'}`}>
                                                    {item.accountNumber || (item.role === 'Customer' ? item.accountType : item.role)}
                                                </p>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${selectedItem?._id === item._id ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Detail Column */}
                        <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
                            {selectedItem ? (
                                <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="p-8 border-b border-slate-50">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center text-3xl font-black text-white shadow-xl">
                                                    {selectedItem.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{selectedItem.name}</h3>
                                                    <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                                                        <Mail className="w-4 h-4 text-obs-blue" /> {selectedItem.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${selectedItem.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                {selectedItem.status}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account</p>
                                                <p className="text-sm font-black text-slate-800">{selectedItem.accountType || 'N/A'}</p>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Balance</p>
                                                <p className="text-sm font-black text-emerald-600">₹{selectedItem.balance?.toLocaleString() || '0'}</p>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Debit Card</p>
                                                <p className={`text-sm font-black ${selectedItem.cardDetails?.debitCard?.isActive ? 'text-blue-600' : 'text-slate-300'}`}>
                                                    {selectedItem.cardDetails?.debitCard?.isActive ? 'ACTIVE' : 'NONE'}
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">E-Passbook</p>
                                                <p className={`text-sm font-black ${selectedItem.passbookIssued ? 'text-obs-blue' : 'text-slate-300'}`}>
                                                    {selectedItem.passbookIssued ? 'ISSUED' : 'PENDING'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                        {activeTab === 'applications' ? (
                                            <div className="space-y-8">
                                                <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-3xl flex gap-4 items-start">
                                                    <Info className="w-6 h-6 text-obs-blue shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-obs-blue font-black text-sm uppercase tracking-wide">Pending Review</p>
                                                        <p className="text-slate-600 text-sm font-medium mt-1 leading-relaxed">
                                                            This user has requested a {selectedItem.accountType} account. Verify credentials before granting access.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => handleApprove(selectedItem._id)}
                                                        className="flex-1 bg-slate-900 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
                                                    >
                                                        <CheckCircle className="w-5 h-5" /> Grant Approval
                                                    </button>
                                                    <button className="flex-1 bg-white border-2 border-slate-200 text-slate-400 font-bold py-4 rounded-2xl cursor-not-allowed">
                                                        Reject (Phase 2 Only)
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-10">
                                                {/* Banking Operations */}
                                                <section>
                                                    <h4 className="text-lg font-black text-slate-900 tracking-tight mb-4 flex items-center gap-2">
                                                        <Shield className="w-5 h-5 text-obs-blue" /> Product Issuance
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <button
                                                            disabled={actionLoading}
                                                            onClick={() => handleGenerateProduct('debit')}
                                                            className="p-6 bg-white border-2 border-slate-100 rounded-3xl hover:border-obs-blue hover:shadow-lg transition-all text-left flex flex-col gap-3 group"
                                                        >
                                                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-obs-blue group-hover:bg-obs-blue group-hover:text-white transition-colors">
                                                                <CreditCard className="w-5 h-5" />
                                                            </div>
                                                            <p className="font-black text-slate-800">Debit Card</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Generate ATM Card</p>
                                                        </button>
                                                        <button
                                                            disabled={actionLoading}
                                                            onClick={() => handleGenerateProduct('credit')}
                                                            className="p-6 bg-white border-2 border-slate-100 rounded-3xl hover:border-sky-500 hover:shadow-lg transition-all text-left flex flex-col gap-3 group"
                                                        >
                                                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                                                                <CreditCard className="w-5 h-5" />
                                                            </div>
                                                            <p className="font-black text-slate-800">Credit Card</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Review & Issue</p>
                                                        </button>
                                                        <button
                                                            disabled={actionLoading}
                                                            onClick={() => handleGenerateProduct('passbook')}
                                                            className="p-6 bg-white border-2 border-slate-100 rounded-3xl hover:border-amber-500 hover:shadow-lg transition-all text-left flex flex-col gap-3 group"
                                                        >
                                                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                                                <BookOpen className="w-5 h-5" />
                                                            </div>
                                                            <p className="font-black text-slate-800">E-Passbook</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Generate Digital Book</p>
                                                        </button>
                                                    </div>
                                                </section>

                                                {/* Transactions */}
                                                <section>
                                                    <h4 className="text-lg font-black text-slate-900 tracking-tight mb-4 flex items-center gap-2">
                                                        <Activity className="w-5 h-5 text-obs-blue" /> Ledger Activity
                                                    </h4>
                                                    <div className="bg-slate-50 rounded-[2rem] border border-slate-100 overflow-hidden">
                                                        {transactions.length === 0 ? (
                                                            <div className="p-10 text-center text-slate-400 font-medium text-sm italic">
                                                                No recent ledger entries found
                                                            </div>
                                                        ) : (
                                                            <div className="divide-y divide-slate-200/50">
                                                                {transactions.map(tx => (
                                                                    <div key={tx._id} className="p-5 flex justify-between items-center bg-white/50">
                                                                        <div className="flex items-center gap-4">
                                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.sender?._id === selectedItem._id ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                                                                                {tx.sender?._id === selectedItem._id ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">
                                                                                    {tx.type} to {tx.receiver?.name || 'External'}
                                                                                </p>
                                                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                                                    {new Date(tx.date).toLocaleDateString()} • {tx.description || 'System Memo'}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <p className={`text-base font-black ${tx.sender?._id === selectedItem._id ? 'text-slate-900' : 'text-emerald-600'}`}>
                                                                            {tx.sender?._id === selectedItem._id ? '-' : '+'}₹{tx.amount.toLocaleString()}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </section>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white border-4 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 h-full opacity-60">
                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                        <Users className="w-10 h-10 text-slate-200" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-400 tracking-tight">Intelligence Hub</h3>
                                    <p className="text-slate-400 font-medium max-w-xs mt-2 italic">Awaiting secure connection to customer records database.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
                {/* Footer */}
                <footer className="mt-8 text-center pb-4 relative z-10">
                    <p className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest leading-none">2026 Online Banking application/Developed NITHIN K A</p>
                </footer>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E0; }
            `}} />
        </div>
    );
};

export default StaffDashboard;
