
export const getCart = () => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
};

export const addItemToCart = (product: any, quantity: number) => {
    let cart = getCart();

    const existing = cart.find((item: any) => item.product._id === product._id);

    if (existing) {
        existing.quantity += quantity;           
    } else {
        cart.push({ product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // notify navbar update
    window.dispatchEvent(new Event("cartUpdated"));
}