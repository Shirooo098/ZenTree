"use client";

import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import TableUI from "@/components/ui/table-ui";
import { Package, AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import RefundDetailsDialog from "../dialog/RefundOrder";

interface RefundItem {
  refund_item_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price_at_purchase: number;
  condition: string;
  restocked: boolean;
}

export interface RefundProps {
  refund_id: number;
  order_id: number;
  user_id: string;
  user_name: string;
  email: string;
  reason: string;
  refund_type: string;
  status: string;
  comments?: string;
  admin_notes?: string;
  created_at: Date;
  updated_at: Date;
  refund_items: RefundItem[];
}

const RefundsTable = ({
  refundsData = [],
  onRefundUpdated
}: {
  refundsData?: RefundProps[];
  onRefundUpdated?: () => void;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<RefundProps | null>(null);

  const tableHeads = [
    "Refund ID",
    "Order ID",
    "Email",
    "Type",
    "Items",
    "Reason",
    "Status",
    "Created",
    "Action"
  ];

  const handleViewDetails = (refund: RefundProps) => {
    setSelectedRefund(refund);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedRefund(null);
  };

  const handleSuccess = () => {
    onRefundUpdated?.();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'resellable':
        return <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">Resellable</Badge>;
      case 'defective':
        return <Badge variant="outline" className="bg-red-50 text-red-700 text-xs">Defective</Badge>;
      case 'damaged':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 text-xs">Damaged</Badge>;
      case 'dead_plant':
        return <Badge variant="outline" className="bg-red-50 text-red-700 text-xs">Dead Plant</Badge>;
      case 'broken':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 text-xs">Broken</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{condition}</Badge>;
    }
  };

  const displayTableRow = (refund: RefundProps) => (
    <TableRow key={refund.refund_id} className="h-auto">
      <TableCell className="font-medium">
        <span>#{refund.refund_id}</span>
      </TableCell>
      <TableCell className="font-medium">
        <Link href={`/admin/orders/${refund.order_id}`} className="text-blue-600 hover:underline">
          #{refund.order_id}
        </Link>
      </TableCell>
      <TableCell className="p-2 max-w-[150px]">
        <span className="text-sm truncate block">{refund.email}</span>
      </TableCell>
      <TableCell className="p-2">
        <Badge variant={refund.refund_type === 'full' ? 'default' : 'secondary'}>
          {refund.refund_type}
        </Badge>
      </TableCell>
      <TableCell className="p-2">
        <div className="flex flex-col gap-1">
          {refund.refund_items && refund.refund_items.length > 0 ? (
            refund.refund_items.map((item) => (
              <div key={item.refund_item_id} className="text-xs flex items-center gap-1">
                <Package className="h-3 w-3" />
                <span className="truncate max-w-[120px]">{item.product_name}</span>
                <span className="text-muted-foreground">x{item.quantity}</span>
                {item.condition && getConditionBadge(item.condition)}
              </div>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">No items</span>
          )}
        </div>
      </TableCell>
      <TableCell className="p-2 max-w-[150px]">
        <span className="text-sm truncate block">{refund.reason}</span>
        {refund.comments && (
          <span className="text-xs text-muted-foreground truncate block mt-1">
            {refund.comments}
          </span>
        )}
      </TableCell>
      <TableCell className="p-2">
        {getStatusBadge(refund.status)}
      </TableCell>
      <TableCell className="p-2 text-sm">
        {new Date(refund.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell className="p-2">
        <Button 
          variant='outline' 
          size="sm" 
          className="w-full"
          onClick={() => handleViewDetails(refund)}
        >
          View Details
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <div className="w-full mt-6">
        {/* Desktop Table View */}
        <div className="border rounded-lg hidden lg:block">
          <TableUI 
            items={refundsData} 
            tableHeads={tableHeads} 
            tableRow={displayTableRow} 
          /> 
        </div>
        
        {/* Mobile Card View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
          {refundsData.map((refund) => (
            <div key={refund.refund_id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-lg">Refund #{refund.refund_id}</p>
                  <Link href={`/admin/orders/${refund.order_id}`} className="text-sm text-blue-600 hover:underline">
                    Order #{refund.order_id}
                  </Link>
                </div>
                {getStatusBadge(refund.status)}
              </div>

              <div className="grid grid-cols-2 gap-3 my-4">
                <div>
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="font-medium">{refund.user_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <Badge variant={refund.refund_type === 'full' ? 'default' : 'secondary'} className="mt-1">
                    {refund.refund_type}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm truncate">{refund.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Items</p>
                  <div className="flex flex-col gap-1">
                    {refund.refund_items && refund.refund_items.length > 0 ? (
                      refund.refund_items.map((item) => (
                        <div key={item.refund_item_id} className="flex items-center gap-2 text-sm">
                          <Package className="h-3 w-3" />
                          <span className="truncate flex-1">{item.product_name}</span>
                          <span className="text-muted-foreground">x{item.quantity}</span>
                          {item.condition && getConditionBadge(item.condition)}
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No items</span>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Reason</p>
                  <p className="text-sm">{refund.reason}</p>
                  {refund.comments && (
                    <p className="text-xs text-muted-foreground mt-1">{refund.comments}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm">{new Date(refund.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <Button 
                  variant='outline' 
                  className="w-full"
                  onClick={() => handleViewDetails(refund)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Refund Details Dialog */}
      <RefundDetailsDialog
        refund={selectedRefund}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default RefundsTable;