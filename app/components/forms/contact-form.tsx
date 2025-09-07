

export default function ContactForm() {
  return (
    <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-md border border-purple-400 absolute top-1/2 right-100 -translate-y-1/2 z-15">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Need help with your bonsai?
      </h3>

      {/* First + Last Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <input
          type="text"
          placeholder="First Name"
          className="border-b border-gray-400 focus:outline-none p-2 text-sm"
        />
        <input
          type="text"
          placeholder="Last Name"
          className="border-b border-gray-400 focus:outline-none p-2 text-sm"
        />
      </div>

      {/* Email + Contact Number */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <input
          type="email"
          placeholder="Email"
          className="border-b border-gray-400 focus:outline-none p-2 text-sm"
        />
        <input
          type="text"
          placeholder="Contact Number"
          className="border-b border-gray-400 focus:outline-none p-2 text-sm"
        />
      </div>

      {/* Message */}
      <div className="mb-4">
        <textarea
          placeholder="Message"
          rows={5}
          className="border-b border-gray-400 focus:outline-none p-2 w-full text-sm resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-[#6b584c] hover:bg-[#564338] text-white font-semibold py-2 px-4 rounded-md"
      >
        SUBMIT
      </button>
    </form>
  );
}
