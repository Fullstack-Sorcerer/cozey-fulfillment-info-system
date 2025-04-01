import Link from 'next/link';
import React from 'react';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex items-center justify-between w-full">
        <div className="text-white font-bold">Fulfillment Information Service</div>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-white hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/packingpage" className="text-white hover:underline">
                Packing Order Info
            </Link>
          </li>
          <li>
            <Link href="/pickingpage" className="text-white hover:underline">
              Picking List
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
