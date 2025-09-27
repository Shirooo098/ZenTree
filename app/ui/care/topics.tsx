import CareSearch from "@/app/components/search/SearchBar";


export default function CareTopics() {
  return (

    <div className="flex p-10 flex-col justify-center items-center text-center">
        <CareSearch />

        <div className="text-base pt-10 ">
            <p>Proper care is essential for maintaining the health and beauty of your bonsai tree. Each species has unique requirements, but all share fundamental care principles.</p>
            <p className="pt-2">Select a topic below to learn specific techniques and recommendations for your bonsai journey.</p>
        </div>

       <div className="grid lg:grid-cols-3  md:grid-cols-2 gap-10 pt-10 xs:grid-cols-1 m-10">
            <div className="border rounded-[10px] bg-white w-100 h-60  flex flex-col text-[15px] p-10">
                <div className="flex w-10 p-1.5 rounded-[30px] bg-[#d9d9d9] justify-start border-[#d9d9d9]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-droplet-icon lucide-droplet"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
                </div>

                <div className="flex text-center justify-center flex-col">
                    <p className="text-2xl pt-3">Watering</p>
                    <p className="pt-3">Learn the proper watering techniques for different bonsai species and seasons.</p>
                </div>
            </div>

            <div className="border rounded-[10px] bg-white w-100 h-60  flex flex-col text-[15px] p-10">
                <div className="flex w-10 p-1.5 rounded-[30px] bg-[#d9d9d9] justify-start border-[#d9d9d9]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sun-icon lucide-sun place-items-start"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                </div>
                <p className="text-2xl pt-3">Light & Placement</p>
                <p className="pt-3">Understand light requirements and ideal placement for your bonsai</p>
            </div>

            <div className="border rounded-[10px] bg-white w-100 h-60  flex flex-col text-[15px] p-10">
                <div className="flex w-10 p-1.5 rounded-[30px] bg-[#d9d9d9] justify-start border-[#d9d9d9]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-scissors-icon lucide-scissors"><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/></svg>
                </div>
                <p className="text-2xl pt-3">Pruning  & Shaping</p>
                <p className="pt-3">Master the art of pruning and wiring to shape your bonsai.</p>
            </div>

            <div className="border rounded-[10px] bg-white w-100 h-60  flex flex-col text-[15px] p-10">
                <div className="flex w-10 p-1.5 rounded-[30px] bg-[#d9d9d9] justify-start border-[#d9d9d9]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8571428571428571" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-calendar-days-icon lucide-calendar-days"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                </div>
                <p className="text-2xl pt-3">Seasonal Care</p>
                <p className="pt-3">Adjust your care routine with the changing seasons.</p>
            </div>
            <div className="border rounded-[10px] bg-white w-100 h-60  flex flex-col text-[15px] p-10">
                <div className="flex w-10 p-1.5 rounded-[30px] bg-[#d9d9d9] justify-start border-[#d9d9d9]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8571428571428571" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-triangle-alert-icon lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                </div>
                <p className="text-2xl pt-3">Troubleshooting</p>
                <p className="pt-3">Identify and solve common bonsai health issues and problems.</p>
            </div>
            <div className="border rounded-[10px] bg-white w-100 h-60  flex flex-col text-[15px] p-10">
                <div className="flex w-10 p-1.5 rounded-[30px] bg-[#d9d9d9] justify-start border-[#d9d9d9]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8571428571428571" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-shovel-icon lucide-shovel"><path d="M21.56 4.56a1.5 1.5 0 0 1 0 2.122l-.47.47a3 3 0 0 1-4.212-.03 3 3 0 0 1 0-4.243l.44-.44a1.5 1.5 0 0 1 2.121 0z"/><path d="M3 22a1 1 0 0 1-1-1v-3.586a1 1 0 0 1 .293-.707l3.355-3.355a1.205 1.205 0 0 1 1.704 0l3.296 3.296a1.205 1.205 0 0 1 0 1.704l-3.355 3.355a1 1 0 0 1-.707.293z"/><path d="m9 15 7.879-7.878"/></svg>
                </div>
                <p className="text-2xl pt-3">Repotting</p>
                <p className="pt-3">Learn when and how to repot your bonsai for optimal health.</p>
            </div>
        </div>

    </div>
  )
}