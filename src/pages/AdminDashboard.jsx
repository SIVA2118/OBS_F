import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Users, FileText, CheckCircle, XCircle, Shield, LogOut, Mail, Lock, User as UserIcon, ArrowRight, Menu } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'staff'
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Applications Data
    const [pendingApps, setPendingApps] = useState([]);
    const [loadingApps, setLoadingApps] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);

    // Staff Data
    const [staff, setStaff] = useState([]);
    const [loadingStaff, setLoadingStaff] = useState(true);

    // Add Staff Form Data
    const [addStaffData, setAddStaffData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Bank Clerk'
    });
    const [addStaffLoading, setAddStaffLoading] = useState(false);

    const rolesList = [
        'Customer', 'Bank Clerk', 'Cashier', 'Customer Service Executive',
        'Probationary Officer (PO)', 'Assistant Manager', 'Deputy Manager',
        'Branch Manager', 'Relationship Manager', 'Loan Officer', 'Credit Officer',
        'Risk Analyst', 'Investment Banker', 'Treasury Officer', 'Forex Officer',
        'Compliance Officer', 'Auditor', 'IT Officer', 'Cyber Security Officer',
        'Digital Banking Officer', 'Operations Manager', 'Regional Manager',
        'General Manager', 'Chief Financial Officer', 'Chief Executive Officer', 'Admin'
    ];

    const fetchApplications = useCallback(async () => {
        setLoadingApps(true);
        try {
            const res = await axios.get('/admin/applications/pending');
            setPendingApps(res.data);
        } catch (err) {
            console.error('Failed to fetch applications', err);
        } finally {
            setLoadingApps(false);
        }
    }, []);

    const fetchStaff = useCallback(async () => {
        setLoadingStaff(true);
        try {
            const res = await axios.get('/admin/staff');
            setStaff(res.data);
        } catch (err) {
            console.error('Failed to fetch staff', err);
        } finally {
            setLoadingStaff(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'applications') fetchApplications();
        if (activeTab === 'staff') fetchStaff();
    }, [activeTab, fetchApplications, fetchStaff]);

    const handleApprove = async (id) => {
        try {
            await axios.post(`/admin/applications/${id}/approve`);
            setSelectedApp(null);
            fetchApplications();
        } catch (err) {
            console.error('Approval failed', err);
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.post(`/admin/applications/${id}/reject`);
            setSelectedApp(null);
            fetchApplications();
        } catch (err) {
            console.error('Rejection failed', err);
        }
    };

    const handleAddStaffSubmit = async (e) => {
        e.preventDefault();
        setAddStaffLoading(true);

        try {
            await axios.post('/auth/register', addStaffData);
            Swal.fire({
                icon: 'success',
                title: 'Staff Registered',
                text: 'Staff member profile created successfully!',
                background: '#fff',
                color: '#0f172a',
                confirmButtonColor: '#0ea5e9',
                customClass: { popup: 'rounded-[1.5rem] shadow-xl border border-slate-100' }
            });
            setAddStaffData({ name: '', email: '', password: '', role: 'Bank Clerk' });
            setActiveTab('staff');
            fetchStaff();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: err.response?.data?.error || 'Unable to register staff.',
                background: '#fff',
                color: '#0f172a',
                confirmButtonColor: '#0ea5e9',
                customClass: { popup: 'rounded-[1.5rem] shadow-xl border border-slate-100' }
            });
        } finally {
            setAddStaffLoading(false);
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            await axios.put(`/admin/staff/${id}/role`, { role: newRole });
            Swal.fire({
                icon: 'success',
                title: 'Role Updated',
                text: 'Employee role has been synchronized.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
            fetchStaff();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'Only system admins can modify node permissions.',
                background: '#fff',
                color: '#0f172a',
                confirmButtonColor: '#0ea5e9'
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex">

            {/* Sidebar Overlay for Mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed md:static inset-y-0 left-0 w-64 bg-slate-900 text-white min-h-screen shadow-xl z-50 transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-sky-400 to-obs-blue bg-clip-text text-transparent">OBS Admin</h1>
                    <p className="text-xs text-slate-400 mt-1">{user?.role}</p>
                </div>
                <nav className="p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'applications' ? 'bg-obs-blue text-white shadow-lg shadow-obs-blue/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">Pending Approvals</span>
                        {pendingApps.length > 0 && activeTab !== 'applications' && (
                            <span className="ml-auto bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{pendingApps.length}</span>
                        )}
                    </button>
                    {(user?.role === 'Admin' || user?.role === 'Branch Manager' || user?.role === 'General Manager') && (
                        <>
                            <button
                                onClick={() => setActiveTab('staff')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'staff' ? 'bg-obs-blue text-white shadow-lg shadow-obs-blue/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                            >
                                <Shield className="w-5 h-5" />
                                <span className="font-medium">Staff & Roles</span>
                            </button>
                            {user?.role === 'Admin' && (
                                <button
                                    onClick={() => setActiveTab('add-staff')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'add-staff' ? 'bg-obs-blue text-white shadow-lg shadow-obs-blue/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                                >
                                    <Users className="w-5 h-5" />
                                    <span className="font-medium">Add New Staff</span>
                                </button>
                            )}
                        </>
                    )}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex justify-between items-center shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-lg md:text-xl font-bold text-slate-800">
                            {activeTab === 'applications' ? 'Pending Applications' :
                                activeTab === 'staff' ? 'Role Management' : 'Add New Staff'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                            <p className="text-xs text-obs-blue font-medium uppercase tracking-widest">{user?.role}</p>
                        </div>
                        <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors tooltip" title="Logout">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">

                    {/* APPLICATIONS TAB */}
                    {activeTab === 'applications' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* List */}
                            <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-[400px] lg:h-[calc(100vh-8rem)]">
                                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                    <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-obs-blue" /> Waitlist
                                    </h3>
                                    <span className="text-xs font-bold bg-sky-100 text-sky-700 px-2 py-1 rounded-full">{pendingApps.length}</span>
                                </div>
                                <div className="overflow-y-auto flex-1 p-2">
                                    {loadingApps ? (
                                        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-obs-blue"></div></div>
                                    ) : pendingApps.length === 0 ? (
                                        <div className="text-center py-12 text-slate-500 text-sm">No applications pending.</div>
                                    ) : (
                                        pendingApps.map(app => (
                                            <button
                                                key={app._id}
                                                onClick={() => setSelectedApp(app)}
                                                className={`w-full text-left p-4 rounded-xl mb-2 transition-all border ${selectedApp?._id === app._id ? 'bg-sky-50 border-sky-200' : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50'}`}
                                            >
                                                <p className="font-semibold text-slate-800">{app.name}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <p className="text-xs text-slate-500">{app.email}</p>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${app.role === 'Customer' ? 'bg-slate-200 text-slate-600' : 'bg-obs-blue/10 text-obs-blue'}`}>
                                                        {app.role === 'Customer' ? app.accountType : app.role}
                                                    </span>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Details View */}
                            <div className="lg:col-span-2">
                                {selectedApp ? (
                                    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm min-h-[400px] lg:h-[calc(100vh-8rem)] overflow-y-auto">
                                        <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100">
                                            <div>
                                                <h3 className="text-3xl font-bold text-slate-900">{selectedApp.name}</h3>
                                                <p className="text-slate-500 flex items-center gap-2 mt-1">
                                                    <Mail className="w-4 h-4" /> {selectedApp.email}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest rounded-full mb-2">Pending</span>
                                                <p className="text-sm font-medium text-slate-700">
                                                    {selectedApp.role === 'Customer' ? (
                                                        <>Type: <span className="font-bold">{selectedApp.accountType} Account</span></>
                                                    ) : (
                                                        <>Role: <span className="font-bold text-obs-blue">{selectedApp.role}</span></>
                                                    )}
                                                </p>
                                                {selectedApp.role === 'Customer' && selectedApp.accountType === 'Savings' && <p className="text-xs text-slate-500 mt-1">Limit: ₹100,000 / day</p>}
                                            </div>
                                        </div>

                                        {selectedApp.role === 'Customer' && (
                                            <>
                                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                    <FileText className="w-5 h-5 text-obs-blue" />
                                                    KYC Documents
                                                </h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                                    <div className="space-y-2">
                                                        <p className="text-xs font-bold text-slate-500 uppercase">Aadhar Card</p>
                                                        <div className="border border-slate-200 rounded-2xl bg-slate-50 h-48 flex items-center justify-center overflow-hidden group">
                                                            {selectedApp.kycDocuments?.aadhar ? (
                                                                <img
                                                                    src={`https://obs-a5vt.onrender.com/uploads/${selectedApp.kycDocuments.aadhar.split('\\').pop().split('/').pop()}`}
                                                                    alt="Aadhar"
                                                                    className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                                    onError={(e) => { e.target.onerror = null; e.target.src = ''; e.target.className = "hidden"; e.target.nextSibling.className = "block text-sm text-red-500 p-4" }}
                                                                />
                                                            ) : (
                                                                <span className="text-sm text-slate-400">No Document</span>
                                                            )}
                                                            <span className="hidden">Image Load Error</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-xs font-bold text-slate-500 uppercase">PAN Card</p>
                                                        <div className="border border-slate-200 rounded-2xl bg-slate-50 h-48 flex items-center justify-center overflow-hidden group">
                                                            {selectedApp.kycDocuments?.pan ? (
                                                                <img
                                                                    src={`https://obs-a5vt.onrender.com/uploads/${selectedApp.kycDocuments.pan.split('\\').pop().split('/').pop()}`}
                                                                    alt="PAN"
                                                                    className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                                    onError={(e) => { e.target.onerror = null; e.target.src = ''; e.target.className = "hidden"; e.target.nextSibling.className = "block text-sm text-red-500 p-4" }}
                                                                />
                                                            ) : (
                                                                <span className="text-sm text-slate-400">No Document</span>
                                                            )}
                                                            <span className="hidden">Image Load Error</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <div className="flex gap-4 pt-6 border-t border-slate-100">
                                            <button
                                                onClick={() => handleApprove(selectedApp._id)}
                                                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-500/20"
                                            >
                                                <CheckCircle className="w-5 h-5" /> Approve Account
                                            </button>
                                            <button
                                                onClick={() => handleReject(selectedApp._id)}
                                                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-red-200"
                                            >
                                                <XCircle className="w-5 h-5" /> Reject
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-8 h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-slate-400">
                                        <FileText className="w-16 h-16 mb-4 text-slate-300" />
                                        <p>Select an application to review</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STAFF ROLES TAB */}
                    {activeTab === 'staff' && (
                        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-bold text-slate-800 text-lg">Bank Staff Management</h3>
                                <p className="text-sm text-slate-500 mt-1">Assign appropriate roles and access levels to employees.</p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                            <th className="p-4 font-semibold border-b border-slate-200">Name</th>
                                            <th className="p-4 font-semibold border-b border-slate-200">Email</th>
                                            <th className="p-4 font-semibold border-b border-slate-200">Current Role</th>
                                            <th className="p-4 font-semibold border-b border-slate-200">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {loadingStaff ? (
                                            <tr><td colSpan="4" className="p-8 text-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-obs-blue mx-auto"></div></td></tr>
                                        ) : staff.length === 0 ? (
                                            <tr><td colSpan="4" className="p-8 text-center text-slate-500">No staff members found.</td></tr>
                                        ) : (
                                            staff.map(s => (
                                                <tr key={s._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                                    <td className="p-4 font-medium text-slate-900">{s.name}</td>
                                                    <td className="p-4 text-slate-500">{s.email}</td>
                                                    <td className="p-4">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                            {s.role}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        {user?.role === 'Admin' ? (
                                                            <select
                                                                className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-obs-blue focus:border-obs-blue block w-full p-2.5 shadow-sm"
                                                                value={s.role}
                                                                onChange={(e) => handleRoleChange(s._id, e.target.value)}
                                                            >
                                                                {rolesList.map(r => (
                                                                    <option key={r} value={r}>{r}</option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <span className="text-xs text-slate-400 italic">Admin only</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ADD STAFF TAB */}
                    {activeTab === 'add-staff' && (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm">
                                <div className="text-center mb-10">
                                    <div className="mx-auto bg-obs-blue/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                                        <UserIcon className="w-8 h-8 text-obs-blue" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900">Add New Staff Member</h3>
                                    <p className="text-slate-500">Create a secure profile for a bank employee</p>
                                </div>

                                <form onSubmit={handleAddStaffSubmit} className="space-y-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="text"
                                                required
                                                value={addStaffData.name}
                                                onChange={(e) => setAddStaffData({ ...addStaffData, name: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-obs-blue/20 focus:border-obs-blue transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="email"
                                                required
                                                value={addStaffData.email}
                                                onChange={(e) => setAddStaffData({ ...addStaffData, email: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-obs-blue/20 focus:border-obs-blue transition-all"
                                                placeholder="john@obs.bank"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Assigned Role</label>
                                            <div className="relative">
                                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <select
                                                    value={addStaffData.role}
                                                    onChange={(e) => setAddStaffData({ ...addStaffData, role: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-obs-blue/20 focus:border-obs-blue transition-all appearance-none cursor-pointer"
                                                >
                                                    {rolesList.filter(role => role !== 'Customer').map(role => (
                                                        <option key={role} value={role}>{role}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Staff Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input
                                                    type="password"
                                                    required
                                                    value={addStaffData.password}
                                                    onChange={(e) => setAddStaffData({ ...addStaffData, password: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-obs-blue/20 focus:border-obs-blue transition-all"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={addStaffLoading}
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-900/10"
                                    >
                                        {addStaffLoading ? 'Creating Profile...' : 'Create Staff Profile'}
                                        {!addStaffLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
                {/* Footer */}
                <footer className="mt-8 text-center pb-4">
                    <p className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest leading-none">2026 Online Banking application/Developed NITHIN K A</p>
                </footer>
            </div>
        </div>
    );
};

export default AdminDashboard;
