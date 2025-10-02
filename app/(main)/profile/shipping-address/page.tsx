"use client";
import * as React from "react";
import { FaCcVisa } from "react-icons/fa";
import { FaCcMastercard } from "react-icons/fa";
import { User, CreditCard, LogOut, MapPin ,Pencil, Trash2  } from "lucide-react";


export default function ShippingAddress() {
  return (
     <>
            
                    <div>
                      <div className="flex flex-row justify-between pb-1">
                        {" "}
                     
                        <div className="font-bold text-2xl">Shipping Address</div>
                        <div>
                          <button className="p-1 font-semibold text-blue text-xs">
                            {" "}
                            + Add New Address{" "}
                          </button>
                        </div>
                      </div>
            
                      <div className="border-1 border-black "></div> 
            
                          <div className="border-1 rounded-[10] mt-5 py-10 px-20 bg-[#f2f2f2]">
            
                            {" "}
                        
                            <div className="flex flex-row justify-between">
                              <div className="font-bold flex flex-row">
                                <p className="pl-2 font-bold text-lg m-auto text-stone-600">HOME</p>
                              </div>
                              <div>
                                <p className="text-[#004aad]">Default</p>
                              </div>
                            </div>
            
                          <div className="flex flex-col pl-5 pt-1">

                                <div>
                                  <p>
                                    <span className="font-semibold">Street:</span> 451 Boni Ave.
                                  </p>
                                  <p>
                                    <span className="font-semibold">City:</span> Brgy. New Zaniga
                                  </p>
                                  <p>
                                    <span className="font-semibold">State/Province:</span> Mandaluyong City
                                  </p>
                                </div>

                              </div>

                          </div>
            
                          <div className="border-1 rounded-[10] mt-5 py-10 px-20 bg-[#f2f2f2]">
            
                            {" "}
                        
                            <div className="flex flex-row justify-between">
                              <div className="font-bold flex flex-row">
                                <p className="pl-2 font-bold text-lg m-auto text-stone-600">OFFICE</p>
                              </div>

                              <div className="flex flex-row items-center gap-x-4">
                                  <Pencil size={28} strokeWidth={1} />
                                  <Trash2 size={28} strokeWidth={1} />
                              </div>
                              
                            </div>
            
                          <div className="flex flex-col pl-5 pt-1">

                                <div>
                                  <p>
                                    <span className="font-semibold">Street:</span> 451 Boni Ave.
                                  </p>
                                  <p>
                                    <span className="font-semibold">City:</span> Brgy. New Zaniga
                                  </p>
                                  <p>
                                    <span className="font-semibold">State/Province:</span> Mandaluyong City
                                  </p>
                                </div>
                                
                              </div>

                          </div>
            
                     </div>
            </>

  )
}
