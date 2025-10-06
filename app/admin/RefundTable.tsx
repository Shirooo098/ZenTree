"use client";

import { useEffect, useState } from "react";

interface Refund {
  refund_id: number;
  id: number;
  order_id: number;
  user_id: number;
  email: string;
  reason: string;
  comments?: string;
  status: string;
  created_at: string;
}

export default function RefundTable() {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRefunds() {
      try {
        const res = await fetch("/api/refunds"); // Make sure this route returns all refunds
        if (!res.ok) throw new Error("Failed to fetch refunds");
        const data = await res.json();
        setRefunds(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRefunds();
  }, []);

  if (loading) return <p className="text-gray-600">Loading refunds...</p>;

  if (!refunds.length)
    return <p className="text-gray-600">No refund requests yet.</p>;

  const handleStatusUpdate = async (refundId: number, status: string) => {
    try {
      const res = await fetch(`/api/refunds/${refundId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      // Refresh the table after update
      const updatedRefunds = refunds.map((r) =>
        r.refund_id === refundId ? { ...r, status } : r
      );
      setRefunds(updatedRefunds);
    } catch (err) {
      console.error(err);
      alert("Failed to update refund status.");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Order ID</th>
            <th className="px-4 py-2 text-left">User Email</th>
            <th className="px-4 py-2 text-left">Reason</th>
            <th className="px-4 py-2 text-left">Comments</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Requested At</th>
          </tr>
        </thead>
        <tbody>
          {refunds.map((r) => (
            <tr key={r.refund_id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{r.refund_id}</td>
              <td className="px-4 py-2">{r.order_id}</td>
              <td className="px-4 py-2">{r.email}</td>
              <td className="px-4 py-2">{r.reason}</td>
              <td className="px-4 py-2">{r.comments || "-"}</td>
              <td className="px-4 py-2 capitalize">{r.status}</td>
              <td className="px-4 py-2">
                {new Date(r.created_at).toLocaleString()}
              </td>
              <td className="px-4 py-2 flex gap-2">
                {r.status === "pending" && (
                  <>
                    <button
                      className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={() =>
                        handleStatusUpdate(r.refund_id, "approved")
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() =>
                        handleStatusUpdate(r.refund_id, "rejected")
                      }
                    >
                      Reject
                    </button>
                  </>
                )}
                {r.status !== "pending" && (
                  <span
                    className={`font-semibold capitalize ${
                      r.status.toLowerCase() === "pending"
                        ? "text-yellow-600"
                        : r.status.toLowerCase() === "completed"
                          ? "text-green-600"
                          : r.status.toLowerCase() === "rejected"
                            ? "text-red-600"
                            : "text-gray-600"
                    }`}
                  >
                    {r.status.toLowerCase() === "rejected"
                      ? "Rejected"
                      : r.status !== "pending"
                        ? "Done"
                        : "Pending"}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
