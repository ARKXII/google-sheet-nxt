"use client";
import { useState } from "react";

export default function Home() {
  // Define field configurations with column mappings
  const fieldConfig = [
    { id: "field1", label: "Field 1", column: "A", type: "date" },
    { id: "field2", label: "Field 2", column: "C", type: "text" },
    { id: "field3", label: "Field 3", column: "D", type: "text" },
  ];

  // Format date as YYYY-MM-DD for input field
  const getTodayFormatted = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Initialize state dynamically based on field configurations
  const [fieldValues, setFieldValues] = useState(() => {
    // Create initial state with today's date for field1
    const initialValues = Object.fromEntries(
      fieldConfig.map((field) => {
        // Set field1 to today's date, others to empty string
        return [field.id, field.id === "field1" ? getTodayFormatted() : ""];
      })
    );
    return initialValues;
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setFieldValues((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

    // Create data structure for fields with column mapping
    const formData = {
      fields: fieldConfig.map((field) => ({
        column: field.column,
        value: fieldValues[field.id],
      })),
    };

    try {
      const response = await fetch("/api/append-row", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Data successfully appended to row ${data.rowNumber}!`);
        // Reset form values, keeping today's date for field1
        setFieldValues((prev) => ({
          ...Object.fromEntries(fieldConfig.map((field) => [field.id, ""])),
          field1: getTodayFormatted(),
        }));
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Google Sheets Form
        </h1>

        <form onSubmit={handleSubmit}>
          {fieldConfig.map((field) => (
            <div className="mb-4" key={field.id}>
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-black mb-1"
              >
                {field.label} (Column {field.column})
              </label>
              <input
                type={field.type}
                id={field.id}
                name={field.id}
                value={fieldValues[field.id]}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder={`Enter value for column ${field.column}`}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
          >
            {loading ? "Submitting..." : "Submit Form"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-md ${
              message.includes("Error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
