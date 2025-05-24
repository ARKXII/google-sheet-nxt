"use client";
import { useState } from "react";
import Link from "next/link";

export default function UpdateCellsForm() {
  const fieldConfig = [
    {
      id: "currentCredit",
      label: "Current Credit",
      cell: "D2",
      type: "number",
      step: "0.01",
      min: "0",
    },
    {
      id: "budget",
      label: "Budget",
      cell: "D4",
      type: "number",
      step: "0.01",
      min: "0",
    },
    {
      id: "soaDate",
      label: "Statement Date",
      cell: "B17",
      type: "date",
    },
    {
      id: "soaAmount",
      label: "Statement Amount",
      cell: "C17",
      type: "number",
      step: "0.01",
      min: "0",
    },
    {
      id: "seabank",
      label: "Seabank",
      cell: "B20",
      type: "number",
      step: "0.01",
      min: "0",
    },
    {
      id: "projected",
      label: "Projected",
      cell: "B21",
      type: "number",
      step: "0.01",
      min: "0",
    },
    {
      id: "gotyme",
      label: "GoTyme Savings",
      cell: "B22",
      type: "number",
      step: "0.01",
      min: "0",
    },
  ];

  const [fieldValues, setFieldValues] = useState(() => {
    return Object.fromEntries(fieldConfig.map((field) => [field.id, ""]));
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
    try {
      const response = await fetch("api/admin", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fieldValues),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setMessage("Cells updated successfully!");
    } catch (error) {
      console.error("Error updating cells:", error);
      setMessage(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-5">
      <div className="flex flex-row gap-3 mb-6">
        <Link href="/dashboard">
          <button className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
            Dashboard
          </button>
        </Link>
        <Link href="/admin">
          <button className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
            Admin
          </button>
        </Link>
      </div>

      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Update Finances
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fieldConfig.map((field) => (
            <div key={field.id}>
              {field.type === "date" ? (
                <div className="relative">
                  <hr className="border-gray-300 mb-3" />
                  <label
                    htmlFor={field.id}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field.label}{" "}
                    <span className="text-xs text-gray-500">
                      ({field.cell})
                    </span>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <label
                    htmlFor={field.id}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field.label}{" "}
                    <span className="text-xs text-gray-500">
                      ({field.cell})
                    </span>
                  </label>
                </div>
              )}

              {field.type === "number" ? (
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    ₱
                  </span>
                  <input
                    type="number"
                    id={field.id}
                    name={field.id}
                    value={fieldValues[field.id]}
                    onChange={handleChange}
                    step={field.step}
                    min={field.min}
                    className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0.00"
                  />
                </div>
              ) : (
                <input
                  type={field.type}
                  id={field.id}
                  name={field.id}
                  value={fieldValues[field.id]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-purple-300 transition-colors"
          >
            {loading ? "Updating..." : "Submit"}
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
