"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ReceiptText,
  Loader,
  CreditCard,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  useCart,
  useRemoveFromCart,
  useUpdateCartQuantity,
} from "@/app/lib/query/cart/cart-data";
import { useCheckout } from "@/app/lib/query/checkout/checkout-data";

export default function Cart() {
  const { data: cart, isLoading } = useCart();
  const removeFromCart = useRemoveFromCart();
  const updateQuantity = useUpdateCartQuantity();
  const checkout = useCheckout();
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  // Local quantity state for instant UI updates
  const [localQuantities, setLocalQuantities] = useState<
    Record<number, number>
  >({});

  // Initialize local quantities when cart data loads
  useEffect(() => {
    if (!cart?.items || cart.items.length === 0) return;

    const quantities: Record<number, number> = {};

    cart.items.forEach((item) => {
      // Ensure we have valid data before processing
      if (
        !item.cart_products_id ||
        typeof item.quantity !== "number" ||
        typeof item.stock !== "number"
      ) {
        return;
      }

      // Cap quantity at available stock
      const validQuantity = Math.min(item.quantity, item.stock);
      quantities[item.cart_products_id] = validQuantity;

      // Auto-update server if quantity exceeds stock
      if (item.quantity > item.stock && validQuantity >= 1) {
        updateQuantity.mutate(
          {
            cartProductId: item.cart_products_id,
            quantity: validQuantity,
          },
          {
            onSuccess: () => {
              // Silent update, no toast needed
            },
          }
        );
      }
    });

    setLocalQuantities(quantities);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart?.items]);

  const handleQuantityChange = (
    cartProductId: number,
    stock: number,
    change: number
  ) => {
    setLocalQuantities((prev) => {
      const currentQty = prev[cartProductId] || 1;
      const newQuantity = currentQty + change;

      // Validate bounds
      if (newQuantity < 1 || newQuantity > stock) {
        return prev;
      }

      return { ...prev, [cartProductId]: newQuantity };
    });
  };

  const handleBlurOrDelay = (cartProductId: number) => {
    const localQty = localQuantities[cartProductId];
    const serverQty = cart?.items.find(
      (item) => item.cart_products_id === cartProductId
    )?.quantity;

    // Only update if quantity changed
    if (localQty && localQty !== serverQty) {
      updateQuantity.mutate({ cartProductId, quantity: localQty });
    }
  };

  const handleRemove = (cartProductId: number) => {
    if (confirm("Remove this item from your cart?")) {
      removeFromCart.mutate(cartProductId);
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cartProductId);
        return newSet;
      });
    }
  };

  const handleSelectItem = (cartProductId: number) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cartProductId)) {
        newSet.delete(cartProductId);
      } else {
        newSet.add(cartProductId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (cart && selectedItems.size === cart.items.length) {
      setSelectedItems(new Set());
    } else if (cart) {
      setSelectedItems(
        new Set(cart.items.map((item) => item.cart_products_id))
      );
    }
  };

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      return;
    }

    const selectedItemsArray = Array.from(selectedItems);
    checkout.mutate(selectedItemsArray);
  };

  const selectedTotal =
    cart?.items
      .filter((item) => selectedItems.has(item.cart_products_id))
      .reduce((sum, item) => {
        const qty = localQuantities[item.cart_products_id] || item.quantity;
        return sum + Number(item.product_price) * qty;
      }, 0) || 0;

  const selectedCount = selectedItems.size;

  // Check if any selected item is out of stock
  const hasOutOfStock =
    cart?.items
      .filter((item) => selectedItems.has(item.cart_products_id))
      .some((item) => item.stock === 0) || false;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Start adding some bonsai trees to your cart!
          </p>
          <Link
            href="/product"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen py-40">
      <div className="flex gap-5 w-full max-w-6xl px-5">
        <div className="bg-main-white rounded-sm basis-[60%]">
          <div className="m-10">
            <span className="flex justify-start items-center gap-3 font-bold text-2xl mb-6">
              <ShoppingCart /> Your Shopping Cart
            </span>

            <div className="border-t-2 border-b-2 border-black py-3 mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 cursor-pointer"
                  checked={
                    cart.items.length > 0 &&
                    selectedItems.size === cart.items.length
                  }
                  onChange={handleSelectAll}
                />
                <span className="font-semibold">
                  Select All ({cart.items.length} items)
                </span>
              </label>
            </div>

            <div className="space-y-4">
              {cart.items.map((item) => {
                const currentQty =
                  localQuantities[item.cart_products_id] || item.quantity;

                return (
                  <div
                    key={item.cart_products_id}
                    className="border-b pb-4 flex gap-4"
                  >
                    <div className="flex items-start pt-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-5 h-5 cursor-pointer"
                          checked={selectedItems.has(item.cart_products_id)}
                          onChange={() =>
                            handleSelectItem(item.cart_products_id)
                          }
                          aria-label={`Select ${item.product_name}`} // Accessibility
                        />
                        <span className="sr-only">{`Select ${item.product_name}`}</span>
                      </label>
                    </div>

                    <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      {item.product_image_url ? (
                        <Image
                          priority
                          src={item.product_image_url}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {item.product_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.product_category}
                          </p>
                          {item.bonsai_size && (
                            <p className="text-sm text-gray-500">
                              Size: {item.bonsai_size}
                            </p>
                          )}
                          {item.stock === 0 ? (
                            <p className="text-xs text-red-600 font-semibold mt-1">
                              Out of Stock
                            </p>
                          ) : (
                            item.stock < 10 && (
                              <p className="text-xs text-amber-600 mt-1">
                                Only {item.stock} left in stock
                              </p>
                            )
                          )}
                          {currentQty > item.stock && (
                            <p className="text-xs text-red-600 mt-1">
                              Quantity adjusted to available stock ({item.stock}
                              )
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            ₱
                            {(Number(item.product_price) * currentQty).toFixed(
                              2
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            ₱{Number(item.product_price).toFixed(2)} each
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.cart_products_id,
                                item.stock,
                                -1
                              )
                            }
                            onBlur={() =>
                              handleBlurOrDelay(item.cart_products_id)
                            }
                            disabled={currentQty <= 1 || item.stock === 0}
                            className="p-1 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            aria-label={`Decrease quantity of ${item.product_name}`}
                          >
                            <Minus className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.cart_products_id,
                                item.stock,
                                1
                              )
                            }
                            onBlur={() =>
                              handleBlurOrDelay(item.cart_products_id)
                            }
                            disabled={
                              currentQty >= item.stock || item.stock === 0
                            }
                            className="p-1 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            aria-label={`Increase quantity of ${item.product_name}`}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item.cart_products_id)}
                          disabled={removeFromCart.isPending}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm disabled:opacity-50 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-main-white rounded-sm basis-[40%] sticky top-5 h-fit">
          <div className="m-10">
            <span className="flex justify-start items-center gap-3 font-bold text-2xl mb-6">
              <ReceiptText /> Order Summary
            </span>

            <div className="space-y-4">
              <div className="flex justify-between items-center font-semibold border-b pb-2">
                <div>Product</div>
                <div className="pr-10">Price</div>
              </div>

              <div className="border-b-2 border-black pb-4 max-h-64 overflow-y-auto">
                {selectedCount === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No items selected
                  </p>
                ) : (
                  <div className="space-y-2">
                    {cart.items
                      .filter((item) =>
                        selectedItems.has(item.cart_products_id)
                      )
                      .map((item) => {
                        const qty =
                          localQuantities[item.cart_products_id] ||
                          item.quantity;
                        return (
                          <div
                            key={item.cart_products_id}
                            className="flex justify-between items-center text-sm"
                          >
                            <div className="flex-1">
                              <p className="font-medium truncate">
                                {item.product_name}
                              </p>
                              <p className="text-gray-500 text-xs">
                                Qty: {qty}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                ₱{(Number(item.product_price) * qty).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({selectedCount} items)</span>
                  <span>₱{selectedTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {selectedCount > 0 ? "Calculated at checkout" : "₱0.00"}
                  </span>
                </div>
                <div className="border-t-2 pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>₱{selectedTotal.toFixed(2)}</span>
                </div>
              </div>

              {selectedCount > 0 ? (
                <>
                  {hasOutOfStock && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mb-2">
                      Some items are out of stock. Please remove them to
                      continue.
                    </div>
                  )}
                  <button
                    onClick={handleCheckout}
                    disabled={checkout.isPending || hasOutOfStock}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checkout.isPending ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        Pay with PayPal
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed mt-4"
                >
                  Select items to checkout
                </button>
              )}

              <Link
                href="/product"
                className="block text-center text-green-600 hover:text-green-700 text-sm mt-2"
              >
                Continue Shopping
              </Link>

              <p className="text-xs text-gray-500 text-center mt-2">
                You will be redirected to PayPal to complete your payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
