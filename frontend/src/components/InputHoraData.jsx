import React, { useState } from "react";

const generateTimeOptions = () => {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, "0");
      const minute = m.toString().padStart(2, "0");
      times.push(`${hour}:${minute}`);
    }
  }
  return times;
};

export default function DateTimeSelector({ onChange }) {
  const timeOptions = generateTimeOptions();

  const [startTime, setStartTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [endDate, setEndDate] = useState("");

  // Envia as informações para um callback se existir
  React.useEffect(() => {
    if (onChange) {
      onChange({ startTime, startDate, endTime, endDate });
    }
  }, [startTime, startDate, endTime, endDate, onChange]);

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow space-y-6">
      <div>
        <label htmlFor="start-time" className="block font-semibold mb-1">
          Horário de Início
        </label>
        <select
          id="start-time"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        >
          <option value="">Selecione o horário</option>
          {timeOptions.map((startTime) => (
            <option key={startTime} value={startTime}>
              {startTime}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="start-date" className="block font-semibold mb-1">
          Data de Início
        </label>
        <input
          id="start-date"
          type="date"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      
      <div>
        <label htmlFor="start-time" className="block font-semibold mb-1">
          Horário de Término
        </label>
        <select
          id="end-time"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        >
          <option value="">Selecione o horário</option>
          {timeOptions.map((endTime) => (
            <option key={endTime} value={endTime}>
              {endTime}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="end-date" className="block font-semibold mb-1">
          Data de Término
        </label>
        <input
          id="end-date"
          type="date"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate || undefined} // evita escolher data término antes do início
        />
      </div>
    </div>
  );
}
