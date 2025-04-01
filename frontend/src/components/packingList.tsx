import { useState } from "react";
import { DateForm } from "./dateform";
import { fetchPackingList } from "@/lib/api";
import Navigation from "./nav";

export function PackingList() {
    const [packingList, setPackingList] = useState([]);

    const handleFetch = async (date: string) => {
        const data = await fetchPackingList(date);
        setPackingList(data);
    };

    return (
        <div>
          <Navigation />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Packing List</h1>
          <DateForm onSubmit={handleFetch} />
          <div className="bg-white shadow-md rounded-lg p-4">
            {packingList.length > 0 ? (
              packingList.map((order, orderNumber) => (
                <div key={(orderNumber + 1).toString()} className="border-b p-4 mb-4">
                  <h2 className="text-lg font-bold">Order #{(orderNumber + 1).toString()}</h2>
                  <p className="text-gray-600">Order Date: {order.orderDate}</p>
                  <h3 className="font-semibold mt-2">Line Items</h3>
                  <ul className="list-disc pl-4">
                    {order.lineItems.map((item, itemNumber) => (
                      <li key={(itemNumber + 1).toString()}>
                        {item.productName && item.components.length > 0 && (
                          <div>
                            <div>
                              {item.productName} (Quantity: {item.quantity})
                            </div>
                            <ol className="list-decimal pl-6 mt-2">
                                {item.components.map((componentName, componentNumber) => (
                                    <li key={(componentNumber + 1).toString()}>
                                        {componentName}
                                    </li>
                                ))}
                            </ol>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                  <h3 className="font-semibold mt-2">Ships to</h3>
                  <p>1. {order.shipsTo.customerName}</p>
                  <p>2. {order.shipsTo.shippingAddress}</p>
                </div>
              ))
            ) : (
              <p>No orders to pack for selected date.</p>
            )}
          </div>
        </div>
        </div>
    );
}