import { TableCell, TableRow } from "@/components/ui/table";
import TableUI from "@/components/ui/table-ui";
import { AdminOrder } from "@/app/types/definition";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { Image, ImageKitProvider } from "@imagekit/next";
import { useState } from "react";
import EditOrderStatusDialog from "../dialog/EditOrderDialog";

const OrdersTable = ({
  ordersData,
  onOrderUpdated
}: {
  ordersData: AdminOrder[];
  onOrderUpdated?: () => void;
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const tableHeads = [
    "Order ID",
    "Customer",
    "Products",
    "Total Amount",
    "Order Date",
    "Status",
    "Actions",
  ];

  const handleEditClick = (order: AdminOrder) => {
    setSelectedOrder(order);
    setIsEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleSuccess = () => {
    onOrderUpdated?.();
  };

  const displayTableRow = (order: AdminOrder) => (
    <TableRow key={order.order_id} className="h-[80px]">
      {/* Order ID */}
      <TableCell className="font-medium">
        #{order.order_id}
      </TableCell>

      {/* Customer */}
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{order.user_name}</span>
          <span className="text-xs text-muted-foreground">{order.user_email}</span>
        </div>
      </TableCell>

      {/* Products count or thumbnails */}
      <TableCell>
        {order.products.length > 0 ? (
          <div className="flex items-center gap-2">
            {order.products.slice(0, 2).map((p) => (
              <div key={p.product_id} className="relative w-10 h-10">
                <ImageKitProvider urlEndpoint={p.product_image_url}>
                    <Image
                        src={p.product_image_url}
                        alt={p.product_name}
                        width={200}
                        height={200}
                        className="object-cover w-full h-full rounded-md border"
                    />
                </ImageKitProvider>
              </div>
            ))}
            {order.products.length > 2 && (
              <span className="text-sm text-muted-foreground">
                +{order.products.length - 2} more
              </span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">No items</span>
        )}
      </TableCell>

      {/* Total Amount */}
      <TableCell>₱{order.total.toFixed(2)}</TableCell>

      {/* Order Date */}
      <TableCell>
        {new Date(order.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge
          variant={
            order.order_status_name === "Pending"
              ? "outline"
              : order.order_status_name === "Processing"
              ? "secondary"
              : order.order_status_name === "Shipped"
              ? "default"
              : order.order_status_name === "Delivered"
              ? "default"
              : order.order_status_name === "Cancelled"
              ? "destructive"
              : order.order_status_name === "Refunded"
              ? "destructive"
              : "outline"
          }
        >
          {order.order_status_name}
        </Badge>
      </TableCell>

      {/* Actions */}
      <TableCell className="space-x-2">
        <Button
          className="bg-blue-600 text-white hover:bg-blue-800"
          variant="secondary"
          size="sm"
          onClick={() => handleEditClick(order)}
        >
          <Pencil className="w-4 h-4 mr-1" /> Edit Status
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <div className="w-full mt-6">
        <div className="border rounded-lg hidden lg:block">
          <TableUI
            items={ordersData}
            tableHeads={tableHeads}
            tableRow={displayTableRow}
          />
        </div>

        {/* Mobile View */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:hidden">
          {ordersData.map((order) => (
            <div
              key={order.order_id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between mb-2">
                <p className="font-medium">Order #{order.order_id}</p>
                <Badge
                  variant={
                    order.order_status_name === "Pending"
                      ? "outline"
                      : order.order_status_name === "Processing"
                      ? "secondary"
                      : order.order_status_name === "Shipped"
                      ? "default"
                      : order.order_status_name === "Delivered"
                      ? "default"
                      : "destructive"
                  }
                >
                  {order.order_status_name}
                </Badge>
              </div>
              <p className="text-sm font-medium">{order.user_name}</p>
              <p className="text-xs text-muted-foreground mb-2">{order.user_email}</p>
              <p className="text-sm text-muted-foreground">
                Total: ₱{order.total.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Date: {new Date(order.created_at).toLocaleDateString()}
              </p>
              <div className="flex items-center gap-2 my-3">
                {order.products.slice(0, 3).map((p) => (
                  <ImageKitProvider 
                      urlEndpoint={p.product_image_url}
                      key={p.product_id}>
                      <Image
                          src={p.product_image_url}
                          alt={p.product_name}
                          width={50}
                          height={50}
                          className="object-cover w-10 h-10 rounded-md border"
                      />
                  </ImageKitProvider>
                ))}
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/orders/${order.order_id}`} className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  className="flex-1"
                  size="sm"
                  onClick={() => handleEditClick(order)}
                >
                  <Pencil className="w-4 h-4 mr-1" /> Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Status Dialog */}
      <EditOrderStatusDialog
        order={selectedOrder}
        isOpen={isEditDialogOpen}
        onClose={handleDialogClose}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default OrdersTable;