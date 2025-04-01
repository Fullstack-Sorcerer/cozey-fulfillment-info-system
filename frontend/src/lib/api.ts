
export const fetchPickingList = async (date: string) => {
    const res = await fetch(`http://localhost:5000/picking-list?date=${date}`);
    if (!res.ok) throw new Error("Failed to fetch list of products to pick!");
    const pickingListBody = await res.json();
    return pickingListBody.products;
}

export const fetchPackingList = async (date: string) => {
    const res = await fetch(`http://localhost:5000/packing-list?date=${date}`);
    if (!res.ok) throw new Error("Failed to fetch list of orders to pack!");
    const packingListBody = await res.json();
    return packingListBody.orders;
}