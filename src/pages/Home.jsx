import { useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LogOut, ArrowRightLeft, CreditCard, Send, Plus, Wallet, RefreshCw } from 'lucide-react';

const Home = () => {
    const { user, logout, setUser } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Transfer form state
    const [receiverAccount, setReceiverAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [transferError, setTransferError] = useState('');
    const [transferSuccess, setTransferSuccess] = useState('');
    const [isTransferring, setIsTransferring] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get('/transactions/history');
            setHistory(res.data);
        } catch (err) {
            console.error('Failed to fetch history', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleTransfer = async (e) => {
        e.preventDefault();
        setTransferError('');
        setTransferSuccess('');
        setIsTransferring(true);
        try {
            const res = await axios.post('/transactions/transfer', {
                receiverAccount,
                amount: Number(amount),
                description
            });
            setTransferSuccess(res.data.message);

            // Update local user balance
            const updatedUser = { ...user, balance: res.data.balance };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Reset form
            setReceiverAccount('');
            setAmount('');
            setDescription('');

            // Refresh history
            fetchData();
        } catch (err) {
            setTransferError(err.response?.data?.error || 'Transfer failed');
        } finally {
            setIsTransferring(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 pb-12">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-obs-blue text-white p-2 rounded-xl">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-obs-dark to-obs-blue bg-clip-text text-transparent">
                            OBS Banking
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                            <p className="text-xs text-slate-500">Acc: {user?.accountNumber}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors tooltip"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">

                {/* Top Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Balance Card */}
                    <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-obs-blue opacity-10 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-110"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-sky-400 opacity-10 rounded-full blur-2xl -ml-10 -mb-10 transition-transform duration-700 group-hover:scale-110"></div>

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <p className="text-slate-300 font-medium flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-sky-400" />
                                    Available Balance
                                </p>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="text-5xl font-bold tracking-tight">${user?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    <span className="text-xl text-slate-400 font-medium">USD</span>
                                </div>
                            </div>
                            <div className="mt-8 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Account Number</p>
                                    <p className="font-mono text-lg tracking-widest">{user?.accountNumber}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Card Holder</p>
                                    <p className="font-medium">{user?.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center gap-4">
                        <h3 className="font-semibold text-slate-800 mb-2">Quick Actions</h3>
                        <button onClick={() => document.getElementById('transfer-form').scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 bg-sky-50 text-obs-blue hover:bg-obs-blue hover:text-white rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group shadow-sm hover:shadow-md">
                            <Send className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                            <span className="font-medium text-sm">Send Money</span>
                        </button>
                        <button className="w-full py-4 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group shadow-sm">
                            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                            <span className="font-medium text-sm">Top Up</span>
                        </button>
                    </div>
                </div>

                {/* Transfer & History Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Transfer Form */}
                    <div id="transfer-form" className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-fit sticky top-24">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <ArrowRightLeft className="w-5 h-5 text-obs-blue" />
                            Transfer Funds
                        </h3>

                        {transferError && <div className="p-3 bg-red-50 text-red-600 rounded-xl mb-4 text-sm font-medium border border-red-100">{transferError}</div>}
                        {transferSuccess && <div className="p-3 bg-green-50 text-green-600 rounded-xl mb-4 text-sm font-medium border border-green-100">{transferSuccess}</div>}

                        <form onSubmit={handleTransfer} className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Receiver Account No.</label>
                                <input
                                    type="text"
                                    value={receiverAccount}
                                    onChange={(e) => setReceiverAccount(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-obs-blue/50 focus:border-obs-blue transition-all"
                                    placeholder="e.g. 1234567890"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Amount (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full px-4 py-3 pl-8 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-obs-blue/50 focus:border-obs-blue transition-all"
                                        placeholder="0.00"
                                        min="1"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Description</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-obs-blue/50 focus:border-obs-blue transition-all"
                                    placeholder="What is this for?"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isTransferring}
                                className="w-full mt-4 bg-obs-blue hover:bg-sky-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md shadow-sky-200 disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {isTransferring ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Send Payment'}
                            </button>
                        </form>
                    </div>

                    {/* Transaction History */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
                            <button onClick={fetchData} className="p-2 text-slate-400 hover:text-obs-blue hover:bg-sky-50 rounded-full transition-colors tooltip" title="Refresh">
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-obs-blue' : ''}`} />
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-obs-blue"></div>
                            </div>
                        ) : history.length === 0 ? (
                            <div className="text-center py-12 space-y-3">
                                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <RefreshCw className="w-8 h-8 text-slate-300" />
                                </div>
                                <p className="text-slate-500 font-medium">No transactions yet</p>
                                <p className="text-sm text-slate-400">When you send or receive money, it will show up here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {history.map((tx) => {
                                    // Determine if the user is the sender or receiver
                                    const isSent = tx.sender?._id === user?.id; // backend populates sender/receiver, we need to match user ID format.
                                    // backend user object stringifies the Id or has it as .id
                                    // wait, transaction populate('sender receiver') might return a populated doc. 
                                    const currentUserId = user?.id || user?._id;
                                    const isSender = tx.sender?._id === currentUserId;
                                    const otherParty = isSender ? tx.receiver : tx.sender;
                                    const sign = isSender ? '-' : '+';
                                    const amountColor = isSender ? 'text-slate-800' : 'text-green-600';
                                    const date = new Date(tx.date).toLocaleDateString(undefined, {
                                        month: 'short', day: 'numeric', year: 'numeric'
                                    });

                                    return (
                                        <div key={tx._id} className="group flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSender ? 'bg-sky-100 text-sky-600' : 'bg-green-100 text-green-600'}`}>
                                                    {isSender ? <ArrowRightLeft className="w-5 h-5" /> : <Plus className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800 group-hover:text-obs-blue transition-colors">
                                                        {isSender ? 'Sent to ' : 'Received from '}
                                                        {otherParty?.name || 'Unknown User'}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <span>{date}</span>
                                                        {tx.description && (
                                                            <>
                                                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                                <span className="truncate max-w-[150px] sm:max-w-xs">{tx.description}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`font-bold text-lg text-right ${amountColor}`}>
                                                {sign}${tx.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Home;
