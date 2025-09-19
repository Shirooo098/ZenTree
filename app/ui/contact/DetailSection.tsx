import { MapPin, PhoneCall, Mail } from "lucide-react";

export default function DetailSection() {
  const items = [
    {
      icon: MapPin,
      title: "Location",
      text: (
        <>
          938 Aurora Boulevard, <br />
          Cubao, Quezon City 1109
        </>
      ),
    },
    {
      icon: PhoneCall,
      title: "Contact Number",
      text: "123 (456) 789",
    },
    {
      icon: Mail,
      title: "Email",
      text: "zentree_support@gmail.com",
    },
  ];

  return (
    <main className="relative flex h-[38vh] sm:h-[45vh] md:h-[80vh] bg-[#FAF8F8]">
      {/* main wrapper */}
      <div className="max-w-6xl w-full mx-auto mt-20 px-4 sm:px-6 lg:px-8 ">
        <h1 className="font-semibold tracking-wide text-2xl sm:text-3xl mb-2">
          We're here for you.
        </h1>
        <p className="text-gray-700 mb-8">
          Have questions or need assistance with your Zen Tree products? We're just a message away.
        </p>

        {/* Column layout pinned left */}
        <div className="flex flex-col gap-8 items-start mt-15">
          {items.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex items-start gap-4 bg-white shadow-sm rounded-md p-6 w-full max-w-md"
            >
              <div className="w-13 h-13 sm:w-20 sm:h-20 flex items-center justify-center rounded-full border-4 border-[#675d50]">
                <Icon color="#675d50" size={20} className="sm:size-13" />
              </div>
              <div className="text-left">
                <p className="font-medium text-lg sm:text-xl">{title}</p>
                <p className="font-light text-base sm:text-lg mt-1">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
