"use client";
import * as React from 'react';




export default function personalinformation() {
   return (
    <>








        <div className='border-1 p-20 m-20 mx-100'>


            











            <div className='flex flex-row justify-between pb-1'> {/*Title and Add Payment Button*/}

                <div className='font-semibold text-2xl'>Billing Details</div>
                <div><button className='p-1 border-1 rounded-[10] font-semibold bg-black text-white text-xs'> + Add Payment Method </button></div>

            </div>

                <div className='border-1 border-black '></div> {/*Black Line*/}


                    <div className='border-1 rounded-[10] mt-5 py-10 bg-[#f2f2f2]'> {/*Billing Method BOX 1*/}

                            <div className='flex flex-row justify-between px-15'>
                                
                                <div className='font-semibold'><p>Visa Ending in 4242</p></div>
                                <div><p className='text-[#004aad]'>Default</p></div>
                                
                            </div>

                            <div className='flex flex-col pl-5 pt-3'>
                                
                                <div className='font-semibold text-2sm'><p>John Doe</p></div>
                                <div className='text-sm'><p>Expires 12/25</p></div>
                                
                            </div>
                        
                    </div>


                    <div className='border-1 rounded-[10] mt-5 py-10 bg-[#f2f2f2]'> {/*Billing Method BOX 1*/}

                            <div className='flex flex-row justify-between px-15'>
                                
                                <div className='font-semibold'><p>Visa Ending in 4242</p></div>
                                <div><p className='text-[#004aad]'>Default</p></div>
                                
                            </div>

                            <div className='flex flex-col pl-5 pt-3'>
                                
                                <div className='font-semibold text-2sm'><p>John Doe</p></div>
                                <div className='text-sm'><p>Expires 12/25</p></div>
                                
                            </div>
                        
                    </div>

        </div>

    </>
   );
}
