import { useState } from "react";
import { getCart } from "../../utils/cart";
import { placeOrder } from "../../api/order.api";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { MapPin, CreditCard, Smartphone, Banknote, ShoppingBasket } from "lucide-react";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const cart = getCart();
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "upi">("cod");
  const [address, setAddress] = useState("13-91/1, chavavaripalem village, Tenali mandal, Guntur, AP - 522201");
  const [loading, setLoading] = useState(false);

  const getTotal = () => cart.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0);

  const finalize = (id: string) => {
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Order Placed Successfully!");
    navigate(`/order-confirmation/${id}`);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return toast.error("కార్ట్ ఖాళీగా ఉంది");
    
    setLoading(true);
    try {
      const orderData = {
        restaurantId: cart[0]?.product?.restaurant?._id,
        deliveryAddress: address,
        paymentMethod: paymentMethod,
        items: cart.map((item: any) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
      };

      // 1. ముందస్తుగా ఆర్డర్ క్రియేట్ చేయడం (Status: Pending)
      const orderRes = await placeOrder(orderData);
      const dbOrderId = orderRes.data.order._id;

      // 2. COD అయితే నేరుగా కన్ఫర్మ్ చేయడం
      if (paymentMethod === "cod") {
        setLoading(false);
        return finalize(dbOrderId);
      }

      // 3. ఆన్‌లైన్ పేమెంట్ (Razorpay Flow)
      const { data } = await API.post("/payments/create-order", { amount: getTotal() });
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Someswari Foods",
        description: "Authentic Homemade Pickles",
        order_id: data.order.id,
        handler: async (response: any) => {
          try {
            // పేమెంట్ వెరిఫికేషన్ తో పాటు మన DB Order ID కూడా పంపాలి
            await API.post("/payments/verify", {
              ...response,
              orderId: dbOrderId,
            });
            finalize(dbOrderId);
          } catch (err) {
            toast.error("Payment verification failed. Contact support.");
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        },
        prefill: {
          name: "Customer Name", // ఇక్కడ యూజర్ ప్రొఫైల్ డేటా ఉంటే వాడవచ్చు
          contact: "91XXXXXXXXXX",
        },
        theme: { color: "#22c55e" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "ఆర్డర్ ప్లేస్ చేయడంలో ఇబ్బంది కలిగింది.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 mb-20">
      <h1 className="text-3xl font-black italic uppercase mb-8 tracking-tighter">
        Final <span className="text-green-600">Checkout</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT: Address & Items Summary */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Address Section */}
          <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-slate-400">
              <MapPin size={18} className="text-red-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Delivery Address</span>
            </div>
            <textarea 
              className="w-full bg-slate-50 p-4 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all text-slate-700 border-none"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="మీ పూర్తి అడ్రస్ ఇక్కడ రాయండి..."
            />
          </div>

          {/* Items Preview */}
          <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-slate-400">
              <ShoppingBasket size={18} className="text-green-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Items in Order</span>
            </div>
            <div className="divide-y divide-slate-50">
              {cart.map((item: any, i: number) => (
                <div key={i} className="py-3 flex justify-between items-center">
                  <div>
                    <h4 className="font-black text-slate-800 text-sm uppercase italic">{item.product.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Quantity: {item.quantity}</p>
                  </div>
                  <span className="font-black text-slate-700 text-sm">₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Payment Options & Summary */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white sticky top-10 shadow-2xl">
            <h2 className="text-lg font-black italic uppercase tracking-widest mb-6 border-b border-slate-800 pb-4">Payment Method</h2>
            
            <div className="space-y-3 mb-8">
              {[
                { id: "cod", icon: Banknote, title: "Cash on Delivery", sub: "ఇంటికి వచ్చాక డబ్బులు ఇవ్వండి" },
                { id: "upi", icon: Smartphone, title: "UPI (PhonePe / GPay)", sub: "Instant Online Payment" },
                { id: "card", icon: CreditCard, title: "Debit / Credit Card", sub: "Visa, Mastercard, RuPay" }
              ].map((method) => (
                <div 
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${paymentMethod === method.id ? "border-green-500 bg-green-500/10" : "border-slate-800 hover:border-slate-700"}`}
                >
                  <method.icon size={20} className={paymentMethod === method.id ? "text-green-500" : "text-slate-500"} />
                  <div>
                    <p className="text-xs font-black uppercase italic">{method.title}</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">{method.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="space-y-3 pt-6 border-t border-slate-800">
              <div className="flex justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <span>Items Total</span>
                <span>₹{getTotal()}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <span>Delivery Charge</span>
                <span className="text-green-500">FREE</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <span className="text-xs font-black uppercase">Grand Total</span>
                <span className="text-4xl font-black italic text-green-500 tracking-tighter">₹{getTotal()}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`w-full mt-8 bg-green-500 hover:bg-green-600 text-slate-900 font-black py-4 rounded-2xl uppercase italic transition-all shadow-lg active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "Processing..." : "Confirm Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;