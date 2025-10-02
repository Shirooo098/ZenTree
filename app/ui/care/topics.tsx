import CareSearch from "@/app/components/search/SearchBar";
import { 
    Droplet, 
    Sun, 
    Scissors,
    CalendarDays,
    TriangleAlert,
    Shovel
} from 'lucide-react';


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
                <div className="flex size-10 rounded-[30px] bg-[#d9d9d9] justify-center items-center border-[#d9d9d9]">
                    <Droplet 
                        strokeWidth={1}
                    />
                </div>

                <div className="flex text-center justify-center flex-col">
                    <p className="text-2xl pt-3">Watering</p>
                    <p className="pt-3">Learn the proper watering techniques for different bonsai species and seasons.</p>
                </div>
            </div>

            <div className="border rounded-[10px] bg-white w-100 h-60  flex flex-col text-[15px] p-10">
                <div className="flex size-10 rounded-[30px] bg-[#d9d9d9] justify-center items-center border-[#d9d9d9]">
                    <Sun 
                        strokeWidth={1}
                    />
                </div>
                <p className="text-2xl pt-3">Light & Placement</p>
                <p className="pt-3">Understand light requirements and ideal placement for your bonsai</p>
            </div>

            <div className="border rounded-[10px] bg-white w-100 h-60  flex flex-col text-[15px] p-10">
                <div className="flex size-10 rounded-[30px] bg-[#d9d9d9] justify-center items-center border-[#d9d9d9]">
                    <Scissors 
                        strokeWidth={1}
                    />
                </div>
                <p className="text-2xl pt-3">Pruning  & Shaping</p>
                <p className="pt-3">Master the art of pruning and wiring to shape your bonsai.</p>
            </div>

            <div className="border rounded-[10px] bg-white w-100 h-60  flex flex-col text-[15px] p-10">
                <div className="flex size-10 rounded-[30px] bg-[#d9d9d9] justify-center items-center border-[#d9d9d9]">
                    <CalendarDays 
                        strokeWidth={1}
                    />
                </div>
                <p className="text-2xl pt-3">Seasonal Care</p>
                <p className="pt-3">Adjust your care routine with the changing seasons.</p>
            </div>
            <div className="border rounded-[10px] bg-white w-100 h-60  flex flex-col text-[15px] p-10">
                <div className="flex size-10 rounded-[30px] bg-[#d9d9d9] justify-center items-center border-[#d9d9d9]">
                    <TriangleAlert 
                        strokeWidth={1}
                    />
                </div>
                <p className="text-2xl pt-3">Troubleshooting</p>
                <p className="pt-3">Identify and solve common bonsai health issues and problems.</p>
            </div>
            <div className="border rounded-[10px] bg-white w-100 h-60  flex flex-col text-[15px] p-10">
                <div className="flex size-10 rounded-[30px] bg-[#d9d9d9] justify-center items-center border-[#d9d9d9]">
                    <Shovel 
                        strokeWidth={1}
                    />
                </div>
                <p className="text-2xl pt-3">Repotting</p>
                <p className="pt-3">Learn when and how to repot your bonsai for optimal health.</p>
            </div>
        </div>

    </div>
  )
}