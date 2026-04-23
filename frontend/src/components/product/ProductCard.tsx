import { useState } from "react";

interface ProductCardProps {
  product: any;
  addToCart: (product: any, qty: number) => void;
}

const ProductCard = ({ product, addToCart }: ProductCardProps) => {
  const [qty, setQty] = useState(1);

  const increase = () => {
    if (qty < product.stock) {
      setQty(qty + 1);
    }
  };

  const decrease = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  /**
   * IMAGE URL LOGIC:
   * Mee DB lo full URL unte direct ga adhe vadali.
   * Windows slashes (\) ni fix chesthunnam.
   */
  const getImageUrl = () => {
    if (!product.image) return "/placeholder.png";
    
    // Windows backslashes unte fix chesthadu
    const cleanPath = product.image.replace(/\\/g, "/");
    
    // Okavela database lo already http unte direct ga pampali, 
    // lekunda kevalam path unte appudu backend URL add cheyali.
    if (cleanPath.startsWith("http")) {
      return cleanPath;
    }
    
    return `http://localhost:5000/${cleanPath.replace(/^\//, "")}`;
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.03] duration-200 transition p-4 flex flex-col justify-between relative cursor-pointer">

      {product.discount && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          {product.discount}% OFF
        </span>
      )}

      {/* FIXED IMAGE TAG */}
      <img
        src={getImageUrl()}
        alt={product.name}
        onError={(e: any) => {
          e.target.src = "https://via.placeholder.com/150?text=No+Pickle+Image";
        }}
        className="h-36 w-full object-cover rounded mb-3"
      />

      <div>
        <h2 className="text-lg font-semibold truncate">
          {product.name}
        </h2>

        <p className="text-xs text-gray-500">
          {product.category?.name || "Category"}
        </p>

        <p className="text-green-600 font-bold mt-1">
          ₹{product.price}
        </p>

        <p
          className={`text-sm mt-1 ${
            product.stock > 0
              ? "text-green-600"
              : "text-red-500 font-semibold"
          }`}
        >
          {product.stock > 0
            ? `Stock: ${product.stock}`
            : "Out of Stock"}
        </p>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            decrease();
          }}
          disabled={product.stock === 0}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          -
        </button>

        <span className="px-2 font-medium">{qty}</span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            increase();
          }}
          disabled={product.stock === 0}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          addToCart(product, qty);
        }}
        disabled={product.stock === 0}
        className="mt-3 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:bg-gray-400 font-semibold"
      >
        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
};

export default ProductCard;