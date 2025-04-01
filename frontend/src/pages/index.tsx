import Link from "next/link";

export default function Home() {
  return(
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-900">Fulfillment Information Service</h1>
      <p className="text-lg text-gray-600 mt-2">Please select a tool</p>

      <div className="flex gap-6 mt-8">
        <Link href="/pickingpage">
          <div className="px-6 py-4 text-xl font-semibold text-white bg-blue-600 rounded-2xl shadow-lg hover:bg-blue-700 transition">
            Picking List
          </div>
        </Link>
        <Link href="/packingpage">
          <div className="px-6 py-4 text-xl font-semibold text-white bg-green-600 rounded-2xl shadow-lg hover:bg-green-700 transition">
            Packing Order Info
          </div>
        </Link>
      </div>
    </div>
  );
}
