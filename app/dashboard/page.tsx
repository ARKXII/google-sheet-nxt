"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type SheetData = {
  individualCells: {
    totalSpending: string | null;
    installment: string | null;
    totalBudget: string | null;
    remainingBudget: string | null;
    currentCredit: string | null;
    budget: string | null;
    ewsoa: string | null;
    seabank: string | null;
    projected: string | null;
    gotyme: string | null;
    need: string | null;
  };
  matrix: string[][];
  error?: string;
};

export default function Home() {
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
  const [data, setData] = useState<SheetData>({
    individualCells: {
      totalSpending: "Loading...",
      installment: "Loading...",
      totalBudget: "Loading...",
      remainingBudget: "Loading...",
      currentCredit: "Loading...",
      budget: "Loading...",
      ewsoa: "Loading...",
      seabank: "Loading...",
      projected: "Loading...",
      gotyme: "Loading...",
      need: "Loading...",
    },
    matrix: [],
  });

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data: SheetData) => {
        if (data.error) throw new Error(data.error);
        setData({
          individualCells: {
            totalSpending: data.individualCells.totalSpending || "N/A",
            installment: data.individualCells.installment || "N/A",
            totalBudget: data.individualCells.totalBudget || "N/A",
            remainingBudget: data.individualCells.remainingBudget || "N/A",
            currentCredit: data.individualCells.currentCredit || "N/A",
            budget: data.individualCells.budget || "N/A",
            ewsoa: data.individualCells.ewsoa || "N/A",
            seabank: data.individualCells.seabank || "N/A",
            projected: data.individualCells.projected || "N/A",
            gotyme: data.individualCells.gotyme || "N/A",
            need: data.individualCells.need || "N/A",
          },
          matrix: data.matrix || [],
        });
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setData((prev) => ({
          ...prev,
          error: err.message,
        }));
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-5">
      <div className="flex flex-row gap-3 mb-6">
        <Link href="/">
          <button className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
            Home
          </button>
        </Link>
      </div>

      <div className="w-full max-w-6xl space-y-8">
        {/* Financial Overview Cards */}
        <div className="flex flex-row bg-white rounded-lg shadow-md">
          <div className="p-10 w-full">
            <h2 className="text-xl font-bold mb-4 text-black font-sans">
              Financial Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-3 border rounded-lg bg-blue-50">
                <h3 className="font-semibold text-sm text-blue-700">
                  Total Spending
                </h3>
                <p className="font-medium text-lg text-black">
                  {data.individualCells.totalSpending}
                </p>
              </div>
              <div className="p-3 border rounded-lg bg-green-50">
                <h3 className="font-semibold text-sm text-green-700">
                  Installment
                </h3>
                <p className="font-medium text-base text-black">
                  {data.individualCells.installment}
                </p>
              </div>
              <div className="p-3 border rounded-lg bg-purple-50">
                <h3 className="font-semibold text-sm text-purple-700">
                  Total Budget
                </h3>
                <p className="font-medium text-lg text-black">
                  {data.individualCells.totalBudget}
                </p>
              </div>
              <div className="p-3 border rounded-lg bg-amber-50">
                <h3 className="font-semibold text-sm text-amber-700">
                  Remaining Budget
                </h3>
                <p className="font-medium text-lg text-black">
                  {data.individualCells.remainingBudget}
                </p>
              </div>
              <div className="p-3 border rounded-lg bg-red-50">
                <h3 className="font-semibold text-sm text-red-700">
                  Current Credit
                </h3>
                <p className="font-medium text-lg text-black">
                  {data.individualCells.currentCredit}
                </p>
              </div>
              <div className="p-3 border rounded-lg bg-indigo-50">
                <h3 className="font-semibold text-sm text-indigo-700">
                  Budget
                </h3>
                <p className="font-medium text-lg text-black">
                  {data.individualCells.budget}
                </p>
              </div>
            </div>
{/* Statement of Account */}
            <h2 className="text-xl font-bold mt-4 mb-4 text-black">
              Statement of Account
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-3 border rounded-lg bg-purple-50 border-purple-100">
                <h3 className="font-semibold text-sm text-purple-800">
                  Eastwest Statement Amount
                </h3>
                <p className="font-medium text-lg text-purple-900">
                  {data.individualCells.ewsoa}
                </p>
              </div>
              <div className="p-3 border rounded-lg bg-purple-50 border-purple-100">
                <h3 className="font-semibold text-sm text-purple-800">
                  Seabank
                </h3>
                <p className="font-medium text-lg text-purple-900">
                  {data.individualCells.seabank}
                </p>
              </div>
              <div className="p-3 border rounded-lg bg-purple-50 border-purple-100">
                <h3 className="font-semibold text-sm text-purple-800">
                  Projected
                </h3>
                <p className="font-medium text-lg text-purple-900">
                  {data.individualCells.projected}
                </p>
              </div>
              <div className="p-3 border rounded-lg bg-purple-50 border-purple-100">
                <h3 className="font-semibold text-sm text-purple-800">
                  GoTyme Savings
                </h3>
                <p className="font-medium text-lg text-purple-900">
                  {data.individualCells.gotyme}
                </p>
              </div>
              <div className="p-3 border rounded-lg bg-purple-50 border-purple-100">
                <h3 className="font-semibold text-sm text-purple-800">
                  Needed Amount
                </h3>
                <p className="font-medium text-lg text-purple-900">
                  {data.individualCells.need}
                </p>
              </div>
            </div>
          </div>
{/* Update Finances */}
          <div className="w-1/3 p-8">
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
                {message}&nbsp;
                {message.includes("Error") ? (
                  ""
                ) : (
                  <a
                    href={`https://docs.google.com/spreadsheets/d/${process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID}/edit`}
                    className="text-blue-500 hover:underline"
                    target="_blank"
                  >
                    View Sheet
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Matrix Display */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-black">
            Detailed Breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-200">
                <tr>
                  {data.matrix[0]?.map((header, index) => (
                    <th
                      key={`header-${index}`}
                      className="border p-2 font-bold text-black text-left"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.matrix.slice(1).map((row, rowIndex) => (
                  <tr
                    key={`row-${rowIndex}`}
                    className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-200"}
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={`cell-${rowIndex}-${cellIndex}`}
                        className="border p-2 text-left text-black"
                      >
                        {cell || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
                {data.matrix.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center p-4 text-black">
                      No detailed data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {data.error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            <h3 className="font-bold">Error:</h3>
            <p>{data.error}</p>
          </div>
        )}
      </div>
    </main>
  );
}
