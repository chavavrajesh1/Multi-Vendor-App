import { useNavigate } from 'react-router-dom'

const VendorSidebar = () => {

    const navigate = useNavigate();

  return (
    <div className='w-60 bg-gray-900 text-white min-h-screen p-5'>

        <h2 className='text-xl font-bold mb-6'>Vendor Panel</h2>

        <div className='flex flex-col gap-3'>

            <button onClick={()=>navigate("/vendor")} className='text-left hover:bg-gray-700 p-2 rounded'>Dashboard</button>

            <button onClick={()=>navigate("/vendor/products")} className='text-left hover:bg-gray-700 p-2 rounded'>Products</button>

            <button onClick={()=>navigate("/vendor/add-product")} className='text-left hover:bg-gray-700 p-2 rounded'>Add Product</button>

            <button onClick={()=>navigate("/vendor/orders")} className='text-left hover:bg-gray-700 p-2 rounded'>Orders</button>
        </div>
      
    </div>
  )
}

export default VendorSidebar
