import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  restaurantId: string; // వెండర్ ఐడెంటిటీ కోసం
}

interface CartState {
  cartItems: CartItem[];
}

const initialState: CartState = {
  cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")!) : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      
      // ఒకవేళ కార్ట్ ఖాళీగా లేకపోతే, వెండర్ ఐడిని చెక్ చేయాలి
      if (state.cartItems.length > 0 && state.cartItems[0].restaurantId !== item.restaurantId) {
        // వేరే వెండర్ అయితే పాతవి తీసేసి కొత్త వెండర్ ఐటమ్ యాడ్ చేయాలి
        // (లేదా మీరు ఇక్కడ యూజర్‌కి అలర్ట్ చూపించి ఆపవచ్చు)
        state.cartItems = [item];
      } else {
        const existItem = state.cartItems.find((x) => x._id === item._id);
        if (existItem) {
          state.cartItems = state.cartItems.map((x) => (x._id === existItem._id ? item : x));
        } else {
          state.cartItems.push(item);
        }
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;