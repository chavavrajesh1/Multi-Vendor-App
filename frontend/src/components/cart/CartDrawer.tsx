import { useEffect, useState } from "react";
import { getCart } from "../../utils/cart";
import { useNavigate } from "react-router-dom"; // 1. useNavigate ఇంపోర్ట్ చేయండి

interface Props {
    open: boolean;
    onClose: () => void;
}

const CartDrawer = ({ open, onClose }: Props) => {
    const [cart, setCart] = useState<any[]>([]);
    const navigate = useNavigate(); // 2. navigate ఫంక్షన్ ని డిక్లేర్ చేయండి

    const loadCart = () => {
        setCart(getCart());
    };

    useEffect(() => {
        loadCart();
        window.addEventListener("cartUpdated", loadCart);
        return () => {
            window.removeEventListener("cartUpdated", loadCart);
        }
    }, []);

    // 3. Checkout బటన్ నొక్కినప్పుడు రన్ అయ్యే ఫంక్షన్
    const handleCheckout = () => {
        if (cart.length === 0) {
            alert("కార్ట్ ఖాళీగా ఉంది!");
            return;
        }
        onClose(); // డ్రాయర్‌ని మూసివేయండి
        navigate("/checkout"); // యూజర్‌ని చెకౌట్ పేజీకి పంపండి
    };

    return (
        <>
        {open && (
            <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={onClose}></div>
        )}

        <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform ${
            open ? "translate-x-0" : "translate-x-full"
        }`}>

            <div className="p-4 border-b flex justify-between">
                <h2 className="font-bold text-lg">My Cart</h2>
                <button onClick={onClose}>✖</button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto h-[80%]">
                {cart.length === 0 && <p className="text-center text-gray-500 py-10">No items in cart</p>}

                {cart.map((item, i) => (
                    <div key={i} className="flex justify-between border p-2 rounded items-center">
                        <div>
                            <p className="font-medium text-sm">{item.product.name}</p>
                            <p className="text-xs text-gray-500">Price: ₹{item.product.price}</p>
                        </div>
                        <p className="font-bold">x{item.quantity}</p>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t">
                {/* 4. onClick హ్యాండ్లర్ ని యాడ్ చేశాను */}
                <button 
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    className={`w-full py-2 rounded font-bold transition-colors ${
                        cart.length === 0 
                        ? "bg-gray-300 cursor-not-allowed" 
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                >
                    Checkout
                </button>
            </div>
        </div>
        </>
    );
};

export default CartDrawer;