import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, User, ArrowRight, Upload, Building2, Wallet, CheckCircle, Home } from 'lucide-react';
import Swal from 'sweetalert2';

const Register = () => {
    const [step, setStep] = useState(1);

    // Step 1: Personal Details
    const [name, setName] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [maritalStatus, setMaritalStatus] = useState('');
    const [nationality, setNationality] = useState('');

    // Step 2: Contact Details
    const [mobileNumber, setMobileNumber] = useState('');
    const [altMobileNumber, setAltMobileNumber] = useState('');
    const [email, setEmail] = useState('');

    // Step 3: Address Details
    const [permanentAddress, setPermanentAddress] = useState({ houseNo: '', city: '', state: '', pincode: '' });
    const [sameAsPermanent, setSameAsPermanent] = useState(false);
    const [communicationAddress, setCommunicationAddress] = useState({ houseNo: '', city: '', state: '', pincode: '' });

    // Step 4: Identity Proof (KYC)
    const [aadharNumber, setAadharNumber] = useState('');
    const [panNumber, setPanNumber] = useState('');
    const [voterId, setVoterId] = useState('');
    const [aadharFile, setAadharFile] = useState(null);
    const [panFile, setPanFile] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);

    // Step 5: Account Details
    const [accountType, setAccountType] = useState('');
    const [initialDeposit, setInitialDeposit] = useState('');
    const [modeOfOperation, setModeOfOperation] = useState('');

    // Step 6: Nominee Details
    const [nomineeName, setNomineeName] = useState('');
    const [nomineeRelationship, setNomineeRelationship] = useState('');
    const [nomineeDob, setNomineeDob] = useState('');
    const [nomineeAddress, setNomineeAddress] = useState('');

    // Step 7: Declaration
    // Password also collected at the end for login creation
    const [password, setPassword] = useState('');
    const [agreed, setAgreed] = useState(false);

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleNext = (e) => {
        e.preventDefault();

        // Basic Validation per step
        if (step === 1 && (!name || !fatherName || !dob || !gender || !maritalStatus || !nationality)) {
            return Swal.fire({
                icon: 'warning',
                title: 'Missing Details',
                text: 'Please fill all Personal Details before proceeding.',
                background: '#0f172a',
                color: '#fff',
                confirmButtonColor: '#0ea5e9',
                customClass: { popup: 'rounded-[1.5rem] border border-white/10' }
            });
        }
        if (step === 2 && (!mobileNumber || !email)) {
            return Swal.fire({
                icon: 'warning',
                title: 'Contact Info Required',
                text: 'Please provide mobile number and email.',
                background: '#0f172a',
                color: '#fff',
                confirmButtonColor: '#0ea5e9',
                customClass: { popup: 'rounded-[1.5rem] border border-white/10' }
            });
        }
        if (step === 3 && (!permanentAddress.city || !permanentAddress.pincode)) {
            return Swal.fire({
                icon: 'warning',
                title: 'Address Required',
                text: 'Please provide at least City and Pincode for your permanent address.',
                background: '#0f172a',
                color: '#fff',
                confirmButtonColor: '#0ea5e9',
                customClass: { popup: 'rounded-[1.5rem] border border-white/10' }
            });
        }
        if (step === 4 && (!aadharFile || !panFile || !photoFile)) {
            return Swal.fire({
                icon: 'warning',
                title: 'Documents Required',
                text: 'Please upload all 3 required documents (Photo, Aadhar, PAN).',
                background: '#0f172a',
                color: '#fff',
                confirmButtonColor: '#0ea5e9',
                customClass: { popup: 'rounded-[1.5rem] border border-white/10' }
            });
        }
        if (step === 5 && (!accountType || !modeOfOperation)) {
            return Swal.fire({
                icon: 'warning',
                title: 'Preferences Required',
                text: 'Please select Account Type and Mode of Operation.',
                background: '#0f172a',
                color: '#fff',
                confirmButtonColor: '#0ea5e9',
                customClass: { popup: 'rounded-[1.5rem] border border-white/10' }
            });
        }
        if (step === 6 && (!nomineeName || !nomineeRelationship)) {
            return Swal.fire({
                icon: 'warning',
                title: 'Nominee Required',
                text: 'Please provide nominee details.',
                background: '#0f172a',
                color: '#fff',
                confirmButtonColor: '#0ea5e9',
                customClass: { popup: 'rounded-[1.5rem] border border-white/10' }
            });
        }

        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agreed) {
            return Swal.fire({
                icon: 'info',
                title: 'Terms & Conditions',
                text: 'You must agree to the terms to proceed.',
                background: '#0f172a',
                color: '#fff',
                confirmButtonColor: '#0ea5e9',
                customClass: { popup: 'rounded-[1.5rem] border border-white/10' }
            });
        }
        if (password.length < 6) {
            return Swal.fire({
                icon: 'warning',
                title: 'Weak Password',
                text: 'Password must be at least 6 characters.',
                background: '#0f172a',
                color: '#fff',
                confirmButtonColor: '#0ea5e9',
                customClass: { popup: 'rounded-[1.5rem] border border-white/10' }
            });
        }

        setLoading(true);
        const formData = new FormData();
        // ... (rest of formData appends)
        formData.append('name', name);
        formData.append('fatherName', fatherName);
        formData.append('dob', dob);
        formData.append('gender', gender);
        formData.append('maritalStatus', maritalStatus);
        formData.append('nationality', nationality);
        formData.append('mobileNumber', mobileNumber);
        formData.append('altMobileNumber', altMobileNumber);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('permanentAddress', JSON.stringify(permanentAddress));
        formData.append('communicationAddress', JSON.stringify(sameAsPermanent ? permanentAddress : communicationAddress));
        if (voterId) formData.append('voterId', voterId);
        formData.append('aadhar', aadharFile);
        formData.append('pan', panFile);
        formData.append('photo', photoFile);
        formData.append('accountType', accountType);
        if (initialDeposit) formData.append('initialDeposit', initialDeposit);
        formData.append('modeOfOperation', modeOfOperation);
        formData.append('nomineeName', nomineeName);
        formData.append('nomineeRelationship', nomineeRelationship);
        formData.append('nomineeDob', nomineeDob);
        formData.append('nomineeAddress', nomineeAddress);

        try {
            const res = await axios.post('/auth/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            Swal.fire({
                icon: 'success',
                title: 'Application Submitted',
                text: res.data.message,
                background: '#0f172a',
                color: '#fff',
                confirmButtonColor: '#0ea5e9',
                customClass: { popup: 'rounded-[1.5rem] border border-white/10' }
            });
            setSuccessMessage(res.data.message);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: err.response?.data?.error || 'Registration failed',
                background: '#0f172a',
                color: '#fff',
                confirmButtonColor: '#0ea5e9',
                customClass: { popup: 'rounded-[1.5rem] border border-white/10' }
            });
        } finally {
            setLoading(false);
        }
    };

    if (successMessage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-obs-dark px-4 py-12">
                <div className="max-w-md w-full backdrop-blur-lg bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20 text-center">
                    <div className="mx-auto bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Application Submitted!</h2>
                    <p className="text-slate-300 mb-8">{successMessage}</p>
                    <Link to="/login" className="inline-block bg-obs-blue hover:bg-sky-400 text-white font-medium py-3 px-8 rounded-xl transition-all">
                        Return to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-obs-dark px-4 py-12 relative">
            <Link to="/" className="absolute top-6 left-6 sm:top-8 sm:left-8 text-slate-400 hover:text-white flex items-center gap-2 transition-colors group">
                <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                <span className="font-medium hidden sm:inline">Back to Home</span>
            </Link>
            <div className="max-w-md w-full backdrop-blur-lg bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20">

                {/* Progress Indicator */}
                <div className="flex justify-between items-center mb-8 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-700 -z-10 rounded-full"></div>
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-obs-blue -z-10 rounded-full transition-all duration-300`} style={{ width: `${((step - 1) / 6) * 100}%` }}></div>

                    {[1, 2, 3, 4, 5, 6, 7].map(i => (
                        <div key={i} className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-sm transition-colors ${step >= i ? 'bg-obs-blue text-white shadow-lg shadow-obs-blue/50' : 'bg-slate-700 text-slate-400'}`}>
                            {i}
                        </div>
                    ))}
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {step === 1 && '1. Personal Details'}
                        {step === 2 && '2. Contact Details'}
                        {step === 3 && '3. Address Details'}
                        {step === 4 && '4. Identity Proof'}
                        {step === 5 && '5. Account Details'}
                        {step === 6 && '6. Nominee Details'}
                        {step === 7 && '7. Declaration'}
                    </h2>
                    <p className="text-slate-300 text-sm">
                        {step === 1 && 'Start by telling us who you are.'}
                        {step === 2 && 'How can we reach you?'}
                        {step === 3 && 'Where do you live?'}
                        {step === 4 && 'Upload documents to verify identity.'}
                        {step === 5 && 'Choose your banking preferences.'}
                        {step === 6 && 'Who should we contact in an emergency?'}
                        {step === 7 && 'Review and submit your application.'}
                    </p>
                </div>

                <form onSubmit={step === 7 ? handleSubmit : handleNext} className="space-y-5 flex flex-col min-h-[300px] justify-between">

                    {/* STEP 1: Personal Details */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Full Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-obs-blue focus:border-transparent transition-all" placeholder="John Doe" required />
                            </div>
                            <div>
                                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Father's / Mother's Name</label>
                                <input type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-obs-blue focus:border-transparent transition-all" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-300 text-sm font-medium mb-1.5 block">Date of Birth</label>
                                    <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-obs-blue focus:border-transparent transition-all [color-scheme:dark]" required />
                                </div>
                                <div>
                                    <label className="text-slate-300 text-sm font-medium mb-1.5 block">Gender</label>
                                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-obs-blue focus:border-transparent transition-all" required>
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-300 text-sm font-medium mb-1.5 block">Marital Status</label>
                                    <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-obs-blue focus:border-transparent transition-all" required>
                                        <option value="">Select</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-slate-300 text-sm font-medium mb-1.5 block">Nationality</label>
                                    <input type="text" value={nationality} onChange={(e) => setNationality(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-obs-blue focus:border-transparent transition-all" placeholder="Indian" required />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Contact Details */}
                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Mobile Number</label>
                                <input type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-obs-blue" required />
                            </div>
                            <div>
                                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Alt Mobile Number</label>
                                <input type="tel" value={altMobileNumber} onChange={(e) => setAltMobileNumber(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-obs-blue" />
                            </div>
                            <div>
                                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Email ID</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-obs-blue" required />
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Address Details */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-h-[50vh] sm:h-96 overflow-y-auto pr-2 custom-scrollbar">

                            <div className="space-y-4">
                                <h3 className="text-obs-blue font-semibold border-b border-white/10 pb-2">Permanent Address</h3>
                                <div>
                                    <label className="text-slate-300 text-xs font-medium mb-1 block">House No / Street</label>
                                    <input type="text" value={permanentAddress.houseNo} onChange={(e) => setPermanentAddress({ ...permanentAddress, houseNo: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-slate-300 text-xs font-medium mb-1 block">City</label>
                                        <input type="text" value={permanentAddress.city} onChange={(e) => setPermanentAddress({ ...permanentAddress, city: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" required />
                                    </div>
                                    <div>
                                        <label className="text-slate-300 text-xs font-medium mb-1 block">State</label>
                                        <input type="text" value={permanentAddress.state} onChange={(e) => setPermanentAddress({ ...permanentAddress, state: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-slate-300 text-xs font-medium mb-1 block">Pincode</label>
                                        <input type="text" value={permanentAddress.pincode} onChange={(e) => setPermanentAddress({ ...permanentAddress, pincode: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" required />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-obs-blue font-semibold border-b border-white/10 pb-2 flex justify-between items-center">
                                    Communication Address
                                    <label className="flex items-center gap-2 text-xs font-normal text-slate-300 cursor-pointer">
                                        <input type="checkbox" checked={sameAsPermanent} onChange={(e) => setSameAsPermanent(e.target.checked)} className="rounded border-white/20 bg-white/5 text-obs-blue focus:ring-obs-blue" />
                                        Same as Permanent
                                    </label>
                                </h3>

                                {!sameAsPermanent && (
                                    <>
                                        <div>
                                            <label className="text-slate-300 text-xs font-medium mb-1 block">House No / Street</label>
                                            <input type="text" value={communicationAddress.houseNo} onChange={(e) => setCommunicationAddress({ ...communicationAddress, houseNo: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-slate-300 text-xs font-medium mb-1 block">City</label>
                                                <input type="text" value={communicationAddress.city} onChange={(e) => setCommunicationAddress({ ...communicationAddress, city: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-slate-300 text-xs font-medium mb-1 block">State</label>
                                                <input type="text" value={communicationAddress.state} onChange={(e) => setCommunicationAddress({ ...communicationAddress, state: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-slate-300 text-xs font-medium mb-1 block">Pincode</label>
                                                <input type="text" value={communicationAddress.pincode} onChange={(e) => setCommunicationAddress({ ...communicationAddress, pincode: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 4: KYC Upload */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-h-[50vh] sm:h-96 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="space-y-4">
                                <h3 className="text-obs-blue font-semibold border-b border-white/10 pb-2">ID Numbers</h3>
                                <div>
                                    <label className="text-slate-300 text-sm font-medium mb-1.5 block">Aadhaar Number</label>
                                    <input type="text" value={aadharNumber} onChange={(e) => setAadharNumber(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-obs-blue" />
                                </div>
                                <div>
                                    <label className="text-slate-300 text-sm font-medium mb-1.5 block">PAN Number</label>
                                    <input type="text" value={panNumber} onChange={(e) => setPanNumber(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-obs-blue" />
                                </div>
                                <div>
                                    <label className="text-slate-300 text-sm font-medium mb-1.5 block">Voter ID (Optional)</label>
                                    <input type="text" value={voterId} onChange={(e) => setVoterId(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-obs-blue" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-obs-blue font-semibold border-b border-white/10 pb-2">Upload Copies</h3>
                                <div>
                                    <label className="text-slate-300 text-sm font-medium mb-2 block">Upload Aadhaar Card (Required)</label>
                                    <div className="relative border-2 border-dashed border-white/20 rounded-xl p-4 hover:border-obs-blue/50 transition-colors bg-white/5">
                                        <input type="file" accept="image/*,.pdf" onChange={(e) => setAadharFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <Upload className="w-5 h-5 text-obs-blue" />
                                            <span className="text-sm truncate">{aadharFile ? aadharFile.name : 'Choose file or drag & drop'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-slate-300 text-sm font-medium mb-2 block">Upload PAN Card (Required)</label>
                                    <div className="relative border-2 border-dashed border-white/20 rounded-xl p-4 hover:border-obs-blue/50 transition-colors bg-white/5">
                                        <input type="file" accept="image/*,.pdf" onChange={(e) => setPanFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <Upload className="w-5 h-5 text-obs-blue" />
                                            <span className="text-sm truncate">{panFile ? panFile.name : 'Choose file or drag & drop'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-slate-300 text-sm font-medium mb-2 block">Upload Passport Size Photo (Required)</label>
                                    <div className="relative border-2 border-dashed border-white/20 rounded-xl p-4 hover:border-obs-blue/50 transition-colors bg-white/5">
                                        <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <User className="w-5 h-5 text-obs-blue" />
                                            <span className="text-sm truncate">{photoFile ? photoFile.name : 'Choose photo or drag & drop'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 5: Account Details */}
                    {step === 5 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Type of Account</label>
                                <select value={accountType} onChange={(e) => setAccountType(e.target.value)} className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-obs-blue" required>
                                    <option value="">Select</option>
                                    <option value="Savings">Savings Account</option>
                                    <option value="Current">Current Account</option>
                                    <option value="Salary Account">Salary Account</option>
                                    <option value="Fixed Deposit">Fixed Deposit</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Initial Deposit Amount (₹)</label>
                                <input type="number" value={initialDeposit} onChange={(e) => setInitialDeposit(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-obs-blue" placeholder="10000" />
                            </div>
                            <div>
                                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Mode of Operation</label>
                                <select value={modeOfOperation} onChange={(e) => setModeOfOperation(e.target.value)} className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-obs-blue" required>
                                    <option value="">Select</option>
                                    <option value="Self">Self</option>
                                    <option value="Joint Account">Joint Account</option>
                                    <option value="Either or Survivor">Either or Survivor</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* STEP 6: Nominee Details */}
                    {step === 6 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Nominee Name</label>
                                <input type="text" value={nomineeName} onChange={(e) => setNomineeName(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-obs-blue" required />
                            </div>
                            <div>
                                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Relationship</label>
                                <input type="text" value={nomineeRelationship} onChange={(e) => setNomineeRelationship(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-obs-blue" required />
                            </div>
                            <div>
                                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Nominee Date of Birth</label>
                                <input type="date" value={nomineeDob} onChange={(e) => setNomineeDob(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-obs-blue [color-scheme:dark]" />
                            </div>
                            <div>
                                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Nominee Address</label>
                                <textarea value={nomineeAddress} onChange={(e) => setNomineeAddress(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-obs-blue resize-none h-24" />
                            </div>
                        </div>
                    )}

                    {/* STEP 7: Declaration */}
                    {step === 7 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <h3 className="text-white font-medium mb-2">Create Password for Online Access</h3>
                                <div>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-obs-blue" placeholder="••••••••" required />
                                </div>
                            </div>

                            <div className="bg-obs-blue/10 border border-obs-blue/30 rounded-xl p-4">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 rounded border-white/20 bg-white/5 text-obs-blue focus:ring-obs-blue" required />
                                    <span className="text-sm text-sky-200">
                                        I hereby declare that the information provided above is true and correct to the best of my knowledge. I agree to follow the bank rules.
                                    </span>
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 mt-8">
                        {step > 1 && (
                            <button type="button" onClick={handleBack} disabled={loading} className="w-1/3 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50">
                                Back
                            </button>
                        )}
                        <button type="submit" disabled={loading} className={`${step > 1 ? 'w-2/3' : 'w-full'} bg-obs-blue hover:bg-sky-400 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center group disabled:opacity-70`}>
                            {step < 7 ? 'Next Step' : loading ? 'Submitting...' : 'Submit Application'}
                            {step < 7 && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </div>

                </form>

                {step === 1 && (
                    <p className="mt-6 text-center text-slate-400">
                        Already have an account? <Link to="/login" className="text-obs-blue hover:text-sky-400 font-medium transition-colors">Sign in</Link>
                    </p>
                )}
            </div>
            {/* Footer */}
            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                <p className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest leading-none">2026 Online Banking application/Developed NITHIN K A</p>
            </div>
            {/* Custom scrollbar styles for inner scrolling areas */}
            <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    );
};

export default Register;
