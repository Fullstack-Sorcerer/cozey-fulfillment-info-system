import { useState } from "react";
import { DateForm } from "./dateform";
import { fetchPickingList } from "@/lib/api";
import Navigation from "./nav";

export function PickingList() {
    const [pickingList, setPickingList] = useState({});
  
    const handleFetch = async (date: string) => {
      const data = await fetchPickingList(date);
      setPickingList(data);
    };
  
    return (
      <div>
      <Navigation />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Picking List</h1>
        <DateForm onSubmit={handleFetch} />
        <div className="bg-white shadow-md rounded-lg p-4">
          {Object.entries(pickingList).length > 0 ? (
            Object.entries(pickingList).map(([productName, quantity], lineNumber) => (
              <div key={productName} className="border-b p-2 flex items-center">
                <p className="mr-2">{(lineNumber + 1).toString()}</p>
                <div className="border p-2 mx-2 text-center">
                  <p className="font-semibold">{productName}</p>
                </div>
                <div className="border p-2 mx-2 text-center">
                  <p>Quantity: {quantity}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No items to pick for the selected date.</p>
          )}
        </div>
      </div>
      </div>
    );
}