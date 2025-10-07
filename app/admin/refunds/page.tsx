"use client"

import { useRefunds } from "@/app/lib/query/admin/refunds/refund-data";
import RefundsTable from "@/app/ui/admin/refund/RefundTable";

export default function AdminRefundPage() {
  const { data: refundsData, isLoading} = useRefunds();

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Refund Requests</h1>
      <p className="text-gray-600">
        Here you can see all refund requests submitted by users.
      </p>

      <RefundsTable refundsData={refundsData}/>
    </div>
  );
}
