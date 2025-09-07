import { MapPin } from 'lucide-react';
import { PhoneCall } from 'lucide-react';
import { Mail } from 'lucide-react';

export default function DetailSection() {
    return(
        <main className="relative flex h-screen bg-[#FaF8F8]">
            <div className="max-w-3x1 mx-auto mt-21">
                <h1 className="text2 font-semibold tracking-wide p-20">We&apos;re here for you.</h1>

                {/* First row Location and Contact*/}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-20 mb-6">
                    {/* location */}
                    <div className="flex items-start gap-4 bg-white shadow-sm rounded-md p-4">

                        <div className="w-20 h-20 flex items-center justify-center rounded-full border-4 mt-6 ml-3 border-[#675d50]">
                            <MapPin color='#675d50' size={50} />
                        </div>
                        <div className="text-left">
                            <p className="font-normal text-2xl p-3">Location</p>
                            <p className="text2 font-bold text-2xl p-3">
                                938 Aurora Boulevard, <br />
                                Cubao, Quezon City 1109
                            </p>
                        </div>
                    </div>
                    
                    {/* contact */}
                    <div className="flex items-start gap-4 bg-white shadow-sm rounded-md p-4">
                        <div className="w-20 h-20 flex items-center justify-center rounded-full border-4 mt-6 ml-3 border-[#675d50]">
                            <PhoneCall color='#675d50' size={50} />
                        </div>
                        <div className="text-left">
                            <p className="font-normal text-2xl p-3">Contact Number</p>
                            <p className="text2 font-bold text-2xl p-3">
                                123(456)789
                            </p>
                        </div>
                    </div>
                </div>

                {/* Email row */}
                <div className="flex justify-center mt-20">
                    <div className="flex items-start gap-4 bg-white shadow-sm rounded-md p-4">

                        <div className="w-20 h-20 flex items-center justify-center rounded-full border-4 mt-6 ml-3 border-[#675d50]">
                            <Mail color='#675d50' size={50} />
                        </div>
                        <div className="text-left">
                            <p className="font-normal text-2xl p-3">Email</p>
                            <p className="text2 font-bold text-2xl p-3">
                                zentree_support@gmail.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}