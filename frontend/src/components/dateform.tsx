import { useState } from 'react';

export function DateForm({ onSubmit }: { onSubmit: (date: string) => void }) {
    const [date, setDate] = useState("");
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (date) onSubmit(date);
    };
  
    return (
      <form onSubmit={handleSubmit} className="mb-4">
        <label htmlFor="date-input" className="block mb-2 font-semibold">Select Date:</label>
        <input
          id="date-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded-md"
          required
          data-testid="date-input"
        />
        <button type="submit" className="ml-2 bg-blue-500 text-white p-2 rounded-md">
          Submit
        </button>
      </form>
    );
}