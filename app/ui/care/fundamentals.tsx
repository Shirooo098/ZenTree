import { DMSans } from "../fonts";

export default function Carefundamentals() {
  return (
       <div className="flex text-center justify-center items-center content-center  ">
            <div className="border-white rounded-[10px] w-[70vw]  m-10 bg-white p-[50px]">
                <p className="font-bold text-[40px] justify-start flex italic">Bonsai Care Fundamentals</p>
                <p className="text-[20px] pt-5 flex text-start">Bonsai trees are not a specific species, but rather any tree that is grown and trained in the bonsai style. While each species has unique requirements, there are fundamental principles that apply to most bonsai trees.</p>
                
            <div className="border rounded-[10px] w-[65vw]  bg-[#675d50]/35 mt-10 justify-self-center p-[30px] text-start">
                <p className="text-[30px] text-black font-bold italic">
                    The Five Pillars of Bonsai Care
                </p>
                <p className="text-[20px] pt-6 flex flex-row ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-droplet-icon lucide-droplet mr-2"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
                    <b>Watering</b>: The most critical and frequent care task. Bonsai soil drains quickly, requiring regular monitoring and watering.
                </p>

                 <p className="text-[20px] pt-6 flex flex-row ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sun-icon lucide-sun mr-2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                    <b>Light</b>:  Most bonsai require abundant light. Position according to species needs (full sun, partial shade, etc.).
                </p>

                <p className="text-[20px] pt-6 flex flex-row ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-scissors-icon lucide-scissors mr-2"><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/></svg>                   
                     <b>Pruning & Training</b>: Regular maintenance pruning and periodic structural pruning help maintain the tree's shape and health.
                </p>

                 <p className="text-[20px] pt-6 flex flex-row ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-package-icon lucide-package mr-2"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/></svg>                    
                    <b>Soil & Repotting</b>: Specialized bonsai soil and periodic repotting (every 1-5 years) ensure root health and nutrient availability.
                </p>

                 <p className="text-[20px] pt-6 flex flex-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-leaf-icon lucide-leaf mr-2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>                   
                     <b>Fertilization</b>: Regular feeding during growing season provides necessary nutrients for healthy growth.
                </p>

            </div>

            <div className="mt-10 text-start">
                <p className="text-[25px]"> Getting Started with Your Bonsai </p>
                <p className="text-[20px] pt-5 flex text-start">When you first bring home a bonsai, take time to understand its specific needs. Identify the species, as this determines most care requirements. Place it in an appropriate location based on light needs, and establish a regular inspection routine.</p>
            </div>

            <div className="flex flex-row mt-10">
                <div className="flex text-start flex-col mw-10%">
                    <p className="text-[20px] font-bold">Indoor Bonsai</p>
                    <p className="text-[20px]">Typically tropical/subtropical species that don't require winter dormancy. Need bright light, consistent temperatures, and higher humidity.</p>

                </div>

                <div className="flex text-start flex-col mw-10%">
                    <p className="text-[20px] font-bold">Outdoor Bonsai</p>
                    <p className="text-[20px]">Temperate species that require seasonal changes and winter dormancy. Generally hardier but need protection from extreme conditions.</p>

                </div>

            </div>

            <div>
                
            </div>

            <div className="flex text-start mt-10  flex-col">
                <p className="text-3xl font-bold font-serif ">Seasonal Care Calendar</p>

                <table className="table-fixed md:table-fixed">
                     <thead className="bg-[#675d50] text-white h-[2.5vw]">
                        <tr>
                            <th>Season</th>
                            <th>Focus Area</th>
                            <th>Key Tasks</th>
                        </tr>
                    </thead>
                    <tbody className="gap-20 border-separate">
                        <tr>
                            <th>Dry Season (November to May)</th>
                            <th>Watering, Protection, Maintenance</th>
                            <th className="flex text-start ml-[5vw]">
                                    <ul className="list-disc">
                                        <li>Increase watering frequency, especially during hot months (March-May)</li>
                                        <li>Provide afternoon shade to prevent leaf burn</li>
                                        <li>Apply mulch to retain soil moisture</li>
                                        <li>Ideal time for repotting (early dry season)</li>
                                        <li>Monitor for pests that thrive in dry conditions</li>
                                    </ul>
                            </th>
                        </tr>
                        <tr>
                            <th>
                                <hr className="border-t-5 border-gray-300 my-8" />
                            </th>
                            <th>
                                <hr className="border-t-5 border-gray-300 my-8" />
                            </th>
                            <th>
                                <hr className="border-t-5 border-gray-300 my-8" />
                            </th>
                        </tr>
                        <tr>
                            <th>Wet Season (June to October)</th>
                            <th>Drainage, Fungus Prevention, Growth Management</th>
                            <th className="flex text-start ml-[5vw]">
                                <ul className="list-disc">
                                    <li>Ensure proper drainage to prevent root rot</li>
                                    <li>Reduce watering frequency during heavy rainfall</li>
                                    <li>Monitor for fungal diseases and apply preventative treatments</li>
                                    <li>Prune for shape as growth accelerates</li>
                                    <li>Protect from strong winds and typhoons</li>
                                    <li>Apply fertilizer more sparingly due to faster nutrient leaching
                                    <li>Recommended Tools</li>
                                    </li>
                                </ul>
                            </th>
                        </tr>
                    </tbody>

                </table>

            </div>

            <div className="mt-[10vw] flex text-start">
                <p className="text-3xl font-serif">Recommended Tools</p>
            </div>

            <div className="flex  mt-[2vw] gap-[4vw] justify-center xs:flex-col sm:flex-row">
                <div className="border rounded-[10px] bg-white w-80 h-40 text-center justify-center items-center flex flex-col text-[15px] p-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-scissors-icon lucide-scissors mb-[10px]"><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/></svg>
                    <p>Prunning Shears</p>
                </div>

                <div className="border rounded-[10px] bg-white w-80 h-40 text-center justify-center items-center flex flex-col text-[15px] p-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-droplet-icon lucide-droplet mb-[10px]"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
                    <p>Watering Can</p>

                </div>

                <div className="border rounded-[10px] bg-white w-80 h-40 text-center justify-center items-center flex flex-col text-[15px] p-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-shovel-icon lucide-shovel mb-[10px]"><path d="M21.56 4.56a1.5 1.5 0 0 1 0 2.122l-.47.47a3 3 0 0 1-4.212-.03 3 3 0 0 1 0-4.243l.44-.44a1.5 1.5 0 0 1 2.121 0z"/><path d="M3 22a1 1 0 0 1-1-1v-3.586a1 1 0 0 1 .293-.707l3.355-3.355a1.205 1.205 0 0 1 1.704 0l3.296 3.296a1.205 1.205 0 0 1 0 1.704l-3.355 3.355a1 1 0 0 1-.707.293z"/><path d="m9 15 7.879-7.878"/></svg>
                    <p>Root Hook</p>                    
                </div>


            </div>

              <div className="text-center justify-center mt-[3vw]"> {/*I LILINK BA TO O TEXT LANG?*/}
                    <p>Browse our complete selection of bonsai tools </p>

                </div>

        </div> {/* bgwhite */}

  


       </div>
    );
}