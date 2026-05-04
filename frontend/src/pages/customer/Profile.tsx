import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { updateUserInfo } from "../../redux/slices/authSlice";
import { toast } from "react-hot-toast";

const Profile = () => {
    const dispatch = useDispatch();
    const { userInfo, token } = useSelector((state: RootState) => state.auth);

    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [newAddress, setNewAddress] = useState({
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        addressType: "Home"
    });

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name || "");
            setPhoneNumber(userInfo.phoneNumber || "");
        }
    }, [userInfo]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.put("/users/update-profile", { name, phoneNumber }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            dispatch(updateUserInfo(data.user));
            toast.success("Profile updated!");
        } catch (error: any) {
            toast.error("Update failed");
        } finally {
            setLoading(false);
        }
    };

    // కొత్త అడ్రస్ సేవ్ చేసే ఫంక్షన్
    const handleAddAddress = async () => {
        try {
            const { data } = await axios.post("/users/add-address", newAddress, {
                headers: { Authorization: `Bearer ${token}` }
            });
            dispatch(updateUserInfo(data.user));
            toast.success("Address added!");
            setShowModal(false); // Modal క్లోజ్ చేయాలి
            setNewAddress({ addressLine: "", city: "", state: "", pincode: "", addressType: "Home" }); // Reset
        } catch (error: any) {
            toast.error("Failed to add address");
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl border border-gray-100 relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">My Profile</h2>

            {/* Profile Update Form */}
            <form onSubmit={handleProfileUpdate} className="space-y-5">
                {/* ... (పాత నేమ్, ఫోన్ ఇన్‌పుట్స్ ఇక్కడ ఉంటాయి) ... */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:border-orange-500" required />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:border-orange-500" required />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition">
                    {loading ? "Saving..." : "Update Profile"}
                </button>
            </form>

            <hr className="my-10 border-gray-100" />

            {/* Address Section */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Saved Addresses</h3>
                    <button 
                        onClick={() => setShowModal(true)} // Modal ని ఓపెన్ చేస్తుంది
                        className="text-orange-500 text-sm font-bold hover:bg-orange-50 px-3 py-1 rounded-lg transition"
                    >
                        + Add New
                    </button>
                </div>

                {/* Addresses List Display (మీరు రాసిన పాత మ్యాపింగ్ కోడ్ ఇక్కడ వస్తుంది) */}
                <div className="space-y-4">
                    {userInfo?.addresses?.map((addr: any) => (
                        <div key={addr._id} className="p-4 border rounded-xl bg-gray-50 relative">
                            <span className="absolute top-4 right-4 bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-1 rounded">{addr.addressType}</span>
                            <p className="text-gray-700 font-medium">{addr.addressLine}</p>
                            <p className="text-gray-500 text-sm">{addr.city}, {addr.state} - {addr.pincode}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- ADD ADDRESS MODAL --- */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Add New Address</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>

                        <div className="space-y-4">
                            <input 
                                placeholder="Address Line (H.No, Street)" 
                                className="w-full p-3 border rounded-xl outline-none focus:border-orange-500"
                                onChange={(e) => setNewAddress({...newAddress, addressLine: e.target.value})}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="City" className="p-3 border rounded-xl outline-none focus:border-orange-500" onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} />
                                <input placeholder="State" className="p-3 border rounded-xl outline-none focus:border-orange-500" onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} />
                            </div>
                            <input placeholder="Pincode" className="w-full p-3 border rounded-xl outline-none focus:border-orange-500" onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})} />
                            
                            <select 
                                className="w-full p-3 border rounded-xl outline-none bg-white"
                                onChange={(e) => setNewAddress({...newAddress, addressType: e.target.value})}
                            >
                                <option value="Home">Home</option>
                                <option value="Work">Work</option>
                                <option value="Other">Other</option>
                            </select>

                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setShowModal(false)} className="flex-1 py-3 font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
                                <button onClick={handleAddAddress} className="flex-1 py-3 font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-500/30">Save Address</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;