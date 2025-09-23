"use client";
import * as React from 'react';
import { FaCcVisa } from 'react-icons/fa';
import { FaCcMastercard } from "react-icons/fa";
import { User, CreditCard, LogOut, MapPin } from 'lucide-react';

export default function personalinformation() {
   return (
    <>








        <div className='border-1 p-10 m-10 mx-100 flex flex-row '>


                <div className='border-1 rounded-10 p-20 font-medium'>
                    <div className='flex flex-row'><User /><p>Personal Information</p></div>
                    <div className='flex flex-row'><MapPin />Shipping Address</div>
                    <div className='flex flex-row'><CreditCard />Billing Details</div>
                    <div className='flex flex-row'><LogOut />Log Out</div>
                </div>










            <div>

                <div className='flex flex-row justify-between pb-1'> {/*Title and Add Payment Button*/}

                    <div className='font-bold text-2xl'>Billing Details</div>
                    <div><button className='p-1 border-1 rounded-[10] font-semibold bg-black text-white text-xs'> + Add Payment Method </button></div>

                </div>

                    <div className='border-1 border-black '></div> {/*Black Line*/}


                        <div className='border-1 rounded-[10] mt-5 py-10 px-40 bg-[#f2f2f2]'> {/*Billing Method BOX 1*/}

                                <div className='flex flex-row'>
                                    
                                    <div className='font-bold flex flex-row '><FaCcVisa className="text-blue-800 text-4xl" />
                                     <p className='pl-2 font-semibol'>Visacard Ending in 2424</p>
                                     </div>
                                    <div><p className='text-[#004aad]'>Default</p></div>
                                    
                                </div>

                                <div className='flex flex-col pl-5 pt-1'>
                                    
                                    <div className='font-semibold text-2sm'><p>John Doe</p></div>
                                    <div className='text-sm'><p>Expires 12/25</p></div>
                                    
                                </div>
                            
                        </div>


                        <div className='border-1 rounded-[10] mt-5 py-10 px-30 bg-[#f2f2f2]'> {/*Billing Method BOX 1*/}

                                <div className='flex flex-row  px-8'>
                                    
                                    <div className='font-bold flex flex-row'><FaCcMastercard className='text-red-800 text-4xl' />
                                    <p className='pl-2 font-semibol'>Mastercard Ending in 5555</p></div>
                                    <div><p className='text-[#004aad]'></p></div>
                                    
                                </div>

                                <div className='flex flex-col pl-5 pt-3'>
                                    
                                    <div className='font-semibold text-2sm'><p>John Doe</p></div>
                                    <div className='text-sm'><p>Expires 08/24</p></div>
                                    
                                </div>
                            
                        </div>
            </div>
        </div>

    </>
   );
}
