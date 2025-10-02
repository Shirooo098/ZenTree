import { ShoppingCart } from 'lucide-react';
import { ReceiptText } from 'lucide-react';

export default function Cart() {
  return ( 
    <> 
    
     <div className="flex justify-center items-center h-screen">
        <div className="flex gap-5 w-full max-w-6xl px-5">
          
          
          <div className="bg-main-white rounded-sm basis-[60%]">
            <div className="m-10">
              <span className="flex justify-start items-center gap-3 font-bold text-2xl">
                <ShoppingCart /> Your Shopping Cart
              </span>

              <div className='border-t-2 border-b-2 border-black'>
                <input type="checkbox" /> 
              </div>
            </div>
          </div>

    


          <div className="bg-main-white rounded-sm basis-[40%]">
            <div className="m-10">
              <span className="flex justify-start items-center gap-3 font-bold text-2xl">
                <ReceiptText /> Order Summary
              </span>

              <div className="flex justify-between items-center">
                <div>Product</div>
                <div className='pr-10'>Price</div>
              </div>
              <div className='border-t-2 border-b-2 border-black'>
                <p>items</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    
    </>
  );
}