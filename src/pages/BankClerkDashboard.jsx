import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    LayoutDashboard, Users, FileText, CheckCircle, XCircle,
    LogOut, Mail, User, Shield, Search, Filter,
    ChevronRight, Clock, AlertCircle, CreditCard, BookOpen,
    ArrowUpRight, ArrowDownLeft, Activity, Info, Calendar, Link as LinkIcon, Send, Check
} from 'lucide-react';

const BankClerkDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('appointments');
    const [appointments, setAppointments] = useState([]);
    const [formRequests, setFormRequests] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // For appointment issuance
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [appointmentLink, setAppointmentLink] = useState('');

    // For form sending
    const [showSendFormModal, setShowSendFormModal] = useState(false);
    const [selectedFormType, setSelectedFormType] = useState('Account Opening');

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'appointments') {
                const res = await axios.get('/clerk/appointments');
                setAppointments(res.data);
            } else if (activeTab === 'forms') {
                const res = await axios.get('/clerk/forms');
                setFormRequests(res.data);
            } else if (activeTab === 'customers') {
                const res = await axios.get('/admin/customers');
                setCustomers(res.data);
            }
        } catch (err) {
            console.error('Error fetching data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleIssueAppointment = async () => {
        if (!selectedItem) return;
        setActionLoading(true);
        try {
            // Auto-generate a link since manual input is removed
            const generatedLink = `https://meet.nova-sovereign.one/quantum-${selectedItem._id.substring(0, 8)}`;
            await axios.post(`/clerk/appointments/${selectedItem._id}/issue`, {
                appointmentLink: generatedLink,
                status: 'scheduled'
            });
            Swal.fire({
                icon: 'success',
                title: 'Appointment Issued',
                text: 'Temporal meeting link successfully broadcast to customer node.',
                background: '#0a1226',
                color: '#fff',
                iconColor: '#6366f1',
                confirmButtonColor: '#6366f1',
                customClass: { popup: 'rounded-[2rem] border border-white/10 shadow-2xl' }
            });
            setShowIssueModal(false);
            setAppointmentLink('');
            setSelectedItem(null);
            fetchData();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Protocol Violation',
                text: 'Failed to issue appointment node.',
                background: '#0a1226',
                color: '#fff',
                confirmButtonColor: '#ef4444',
                customClass: { popup: 'rounded-[2rem] border border-white/10 shadow-2xl' }
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleSendForm = async (customerId) => {
        setActionLoading(true);
        try {
            await axios.post('/clerk/forms/send', {
                customerId,
                formType: selectedFormType
            });
            setShowSendFormModal(false);
            Swal.fire({
                icon: 'success',
                title: 'Protocol Dispatched',
                text: `${selectedFormType} protocol successfully pushed to customer terminal.`,
                background: '#0a1226',
                color: '#fff',
                iconColor: '#6366f1',
                confirmButtonColor: '#6366f1',
                customClass: { popup: 'rounded-[2rem] border border-white/10 shadow-2xl' }
            });
            if (activeTab === 'forms') fetchData();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Upload Interrupted',
                text: 'Failed to push form protocol to target node.',
                background: '#0a1226',
                color: '#fff',
                confirmButtonColor: '#ef4444',
                customClass: { popup: 'rounded-[2rem] border border-white/10 shadow-2xl' }
            });
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans">
            {/* Sidebar */}
            <div className="w-72 bg-[#0a1226] text-white flex flex-col shadow-2xl z-20">
                <div className="p-8 border-b border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight uppercase italic">Nova_Clerk</h1>
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.3em] leading-none mt-0.5">Sovereign Portal</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-4">
                    <button
                        onClick={() => { setActiveTab('appointments'); setSelectedItem(null); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'appointments' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">Appointments</span>
                        {appointments.filter(a => a.status === 'pending').length > 0 && (
                            <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                                {appointments.filter(a => a.status === 'pending').length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => { setActiveTab('forms'); setSelectedItem(null); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'forms' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">Form Protocols</span>
                    </button>
                    <button
                        onClick={() => { setActiveTab('customers'); setSelectedItem(null); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'customers' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Users className="w-5 h-5" />
                        <span className="font-medium">Customer Base</span>
                    </button>
                </nav>

                <div className="p-4 mt-auto border-t border-white/5">
                    <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3 mb-4 border border-white/5">
                        <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center font-bold text-indigo-400 uppercase">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{user?.name}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold">Protocol Terminate</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm z-10">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 uppercase italic tracking-tight">
                            {activeTab === 'appointments' ? 'Appointment_Synchronizer' : activeTab === 'forms' ? 'Form_Protocol_Manager' : 'Customer_Intelligence'}
                        </h2>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{activeTab} node active</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            <Activity className="w-3 h-3 text-indigo-500" />
                            <span>Neural Link Stable</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-hidden p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                        {/* List Column */}
                        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm flex flex-col overflow-hidden">
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                <h3 className="font-black text-slate-800 flex items-center gap-2 text-xs uppercase tracking-widest">
                                    {activeTab === 'appointments' ? 'Queue' : activeTab === 'forms' ? 'Protocols' : 'Clients'}
                                </h3>
                                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                                    <Search className="w-4 h-4 text-slate-400" />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center h-40 gap-4 opacity-50">
                                        <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing Records...</p>
                                    </div>
                                ) : (activeTab === 'appointments' ? appointments : activeTab === 'forms' ? formRequests : customers).length === 0 ? (
                                    <div className="text-center py-12 opacity-50">
                                        <CheckCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Record Empty</p>
                                    </div>
                                ) : (
                                    (activeTab === 'appointments' ? appointments : activeTab === 'forms' ? formRequests : customers).map(item => (
                                        <button
                                            key={item._id}
                                            onClick={() => setSelectedItem(item)}
                                            className={`w-full text-left p-4 rounded-2xl transition-all border flex items-center gap-4 group ${selectedItem?._id === item._id ? 'bg-[#0a1226] border-[#0a1226] text-white shadow-xl -translate-y-1' : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-900'}`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${selectedItem?._id === item._id ? 'bg-white/10 text-white' : 'bg-slate-100 text-indigo-600'}`}>
                                                {(item.customer?.name || item.name || 'U').charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-black truncate text-sm italic">{item.customer?.name || item.name}</p>
                                                <p className={`text-[10px] uppercase tracking-widest font-black mt-0.5 ${selectedItem?._id === item._id ? 'text-indigo-400' : 'text-slate-400'}`}>
                                                    {activeTab === 'appointments' ? `${item.date} @ ${item.time}` : activeTab === 'forms' ? item.formType : item.accountNumber}
                                                </p>
                                            </div>
                                            <div className={`w-2 h-2 rounded-full ${item.status === 'pending' || item.status === 'sent_by_clerk' ? 'bg-amber-500' : item.status === 'scheduled' || item.status === 'filled_by_customer' ? 'bg-blue-500' : 'bg-emerald-500'} shadow-sm animate-pulse`}></div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Detail Column */}
                        <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
                            {selectedItem ? (
                                <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="p-8 border-b border-slate-50 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                        <div className="flex justify-between items-start mb-6 relative z-10">
                                            <div className="flex items-center gap-6">
                                                <div className="w-20 h-20 bg-[#0a1226] rounded-3xl flex items-center justify-center text-3xl font-black text-white shadow-xl italic border border-white/5">
                                                    {(selectedItem.customer?.name || selectedItem.name || 'U').charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">{selectedItem.customer?.name || selectedItem.name}</h3>
                                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mt-2 bg-slate-100 w-fit px-3 py-1 rounded-full">
                                                        <Mail className="w-3 h-3 text-indigo-500" /> {selectedItem.customer?.email || selectedItem.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${selectedItem.status === 'pending' || selectedItem.status === 'sent_by_clerk' ? 'bg-amber-50 text-amber-600 border-amber-100' : selectedItem.status === 'scheduled' || selectedItem.status === 'filled_by_customer' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                                {selectedItem.status?.replace(/_/g, ' ')}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                                            <div className="bg-[#0a1226] text-white p-4 rounded-2xl border border-white/5 text-center shadow-lg">
                                                <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Entity ID</p>
                                                <p className="text-[10px] font-black tracking-tighter truncate font-mono">{(selectedItem.customer?._id || selectedItem._id).substring(0, 10)}...</p>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Code</p>
                                                <p className="text-[10px] font-black text-slate-800 underline decoration-indigo-500 decoration-2">ACTIVE_NODE</p>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Verified</p>
                                                <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Risk Index</p>
                                                <p className="text-[10px] font-black text-emerald-600 font-mono">0.00%</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-8 relative">
                                        {activeTab === 'appointments' ? (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <div className="bg-indigo-50/50 border border-indigo-100 p-8 rounded-[2.5rem] flex gap-6 items-start shadow-inner">
                                                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
                                                        <Calendar className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-indigo-600 font-black text-xs uppercase tracking-[0.2em] mb-2 italic">Request Decryption Success</p>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Window</p>
                                                                <p className="text-lg font-black text-slate-900 italic tracking-tight">{selectedItem.date} {selectedItem.time}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Request Reason</p>
                                                                <p className="text-sm font-medium text-slate-600 leading-relaxed italic">"{selectedItem.reason || 'No specific objective provided.'}"</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {selectedItem.status === 'pending' ? (
                                                    <div className="space-y-4">
                                                        <button
                                                            onClick={handleIssueAppointment}
                                                            disabled={actionLoading}
                                                            className="w-full bg-[#0a1226] hover:bg-indigo-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-3 uppercase tracking-widest text-xs italic disabled:opacity-50"
                                                        >
                                                            <Send className="w-4 h-4" /> Issue Appointment to Customer
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] flex flex-col items-center gap-4 text-center">
                                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-emerald-100">
                                                            <Check className="w-8 h-8 text-emerald-500" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <h4 className="font-black text-slate-900 uppercase italic">Protocol Established</h4>
                                                            <p className="text-xs text-slate-500 font-medium">This appointment is active on the network.</p>
                                                        </div>
                                                        <div className="bg-white p-4 rounded-2xl border border-emerald-100 w-full font-mono text-xs text-emerald-600 break-all">
                                                            {selectedItem.appointmentLink}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : activeTab === 'forms' ? (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] space-y-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                                                <FileText className="w-5 h-5" />
                                                            </div>
                                                            <h4 className="font-black text-slate-900 uppercase italic">{selectedItem.formType}</h4>
                                                        </div>
                                                        <p className="text-[10px] font-black text-indigo-400 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">Protocol ID: FORM-{(selectedItem._id || '').substring(0, 6)}</p>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <div className="w-1 h-12 bg-indigo-600 rounded-full"></div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status Progression</p>
                                                                <p className="text-sm font-black text-slate-800 uppercase italic mt-1">{selectedItem.status?.replace(/_/g, ' ')}</p>
                                                            </div>
                                                        </div>

                                                        {selectedItem.formData && Object.keys(selectedItem.formData).length > 0 && (
                                                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b pb-2">Injected_Data_Packet</p>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    {Object.entries(selectedItem.formData).map(([key, val]) => (
                                                                        <div key={key}>
                                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{key}</p>
                                                                            <p className="text-xs font-black text-slate-800">{String(val)}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {selectedItem.status === 'filled_by_customer' && (
                                                            <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl">
                                                                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                                    <Shield className="w-3 h-3" /> Waiting for Management Verification
                                                                </p>
                                                                <p className="text-xs text-slate-600 font-medium italic">Data has been successfully aggregated from the customer terminal. Awaiting verification by the General Manager or System Admin.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col gap-4 group hover:bg-[#0a1226] transition-all cursor-pointer">
                                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                            <FileText className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-400">Action Protocol</p>
                                                            <p className="text-lg font-black text-slate-900 italic group-hover:text-white">Send Form</p>
                                                        </div>
                                                        <div className="mt-4 space-y-3">
                                                            <select
                                                                className="w-full bg-white group-hover:bg-white/10 group-hover:text-white border border-slate-200 group-hover:border-white/20 rounded-xl p-2 text-xs font-black focus:outline-none"
                                                                value={selectedFormType}
                                                                onChange={(e) => setSelectedFormType(e.target.value)}
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <option>Account Opening</option>
                                                                <option>Loan Application</option>
                                                                <option>KYC Update</option>
                                                                <option>Node Transfer</option>
                                                            </select>
                                                            <button
                                                                onClick={() => handleSendForm(selectedItem._id)}
                                                                disabled={actionLoading}
                                                                className="w-full bg-[#0a1226] group-hover:bg-indigo-600 text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest shadow-lg group-hover:shadow-indigo-600/30 transition-all italic border border-white/5"
                                                            >
                                                                Initiate Protocol
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col gap-4 opacity-50 cursor-not-allowed grayscale">
                                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                                                            <Activity className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Action Protocol</p>
                                                            <p className="text-lg font-black text-slate-900 italic">Financial Review</p>
                                                        </div>
                                                        <p className="text-[10px] font-bold text-slate-400 italic">Staff Authorization Required</p>
                                                    </div>
                                                </div>

                                                <div className="p-8 border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-center gap-4 opacity-40">
                                                    <Lock className="w-12 h-12 text-slate-200" />
                                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sensitive Ledger Access Encrypted</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white border-4 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 h-full opacity-60">
                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
                                        <Activity className="w-10 h-10 text-slate-200 animate-pulse" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-400 tracking-tight italic uppercase">Sovereign_Synapse</h3>
                                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] max-w-xs mt-2">Neural connection pending selection</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}} />
        </div>
    );
};

export default BankClerkDashboard;

const Lock = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);
