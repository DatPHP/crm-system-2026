import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { orderService } from "../services/order.service";
import { customerService } from "../services/customer.service";
import { productService } from "../services/product.service";

interface CartItem {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  stock: number;
}

export default function CreateOrderPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [customerId, setCustomerId] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  // Customers query
  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: () => customerService.getAll(), // bỏ tham số
  });

  // Products query
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => productService.getAll(), // bỏ tham số
  });

  const createMutation = useMutation({
    mutationFn: orderService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(`Order ${data.orderCode} created!`);
      navigate("/orders");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Error"),
  });

  // Thêm product vào cart
  const addToCart = () => {
    if (!selectedProductId) return;

    const product = products.find(
      (p: any) => p.id === parseInt(selectedProductId),
    );
    if (!product) return;

    const existing = cart.find((i) => i.productId === product.id);
    if (existing) {
      toast.error("Product already in cart, adjust quantity instead");
      return;
    }

    if (product.stockQuantity === 0) {
      toast.error("Product out of stock");
      return;
    }

    setCart([
      ...cart,
      {
        productId: product.id,
        title: product.title,
        price: Number(product.price),
        quantity: 1,
        stock: product.stockQuantity,
      },
    ]);
    setSelectedProductId("");
  };

  // Cập nhật quantity
  const updateQty = (productId: number, qty: number) => {
    setCart(
      cart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(qty, item.stock) }
          : item,
      ),
    );
  };

  // Xóa khỏi cart
  const removeFromCart = (productId: number) => {
    setCart(cart.filter((i) => i.productId !== productId));
  };

  // Tính tổng
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Submit
  const handleSubmit = () => {
    if (!customerId) {
      toast.error("Please select a customer");
      return;
    }
    if (cart.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    createMutation.mutate({
      customerId,
      items: cart.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    });
  };

  // Products chưa có trong cart
  const availableProducts = products.filter(
    (p: any) => p.isActive && !cart.find((c) => c.productId === p.id),
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/orders")}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">Create New Order</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Customer + Products */}
        <div className="lg:col-span-2 space-y-4">
          {/* Step 1: Customer */}
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold mb-3">① Select Customer</h2>
            <select
              value={customerId ?? ""}
              onChange={(e) => setCustomerId(parseInt(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">-- Select customer --</option>
              {customers.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} {c.phone ? `(${c.phone})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Add Products */}
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold mb-3">② Add Products</h2>
            <div className="flex gap-2">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2"
              >
                <option value="">-- Select product --</option>
                {availableProducts.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.title} — ${Number(p.price).toLocaleString()} (stock:{" "}
                    {p.stockQuantity})
                  </option>
                ))}
              </select>
              <button
                onClick={addToCart}
                className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} /> Add
              </button>
            </div>
          </div>

          {/* Step 3: Cart Items */}
          {cart.length > 0 && (
            <div className="bg-white rounded-xl border p-5">
              <h2 className="font-semibold mb-3">③ Order Items</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-2">Product</th>
                      <th className="pb-2">Price</th>
                      <th className="pb-2">Qty</th>
                      <th className="pb-2">Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr
                        key={item.productId}
                        className="border-b last:border-0"
                      >
                        <td className="py-2 font-medium">{item.title}</td>
                        <td className="py-2">${item.price.toLocaleString()}</td>
                        <td className="py-2">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                updateQty(
                                  item.productId,
                                  Math.max(1, item.quantity - 1),
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-lg border bg-gray-50 hover:bg-gray-100 text-base font-bold select-none touch-manipulation"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-semibold text-sm">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQty(
                                  item.productId,
                                  Math.min(item.stock, item.quantity + 1),
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-lg border bg-gray-50 hover:bg-gray-100 text-base font-bold select-none touch-manipulation"
                            >
                              +
                            </button>
                            <span className="text-xs text-gray-400 ml-1">
                              /{item.stock}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 font-semibold">
                          ${(item.price * item.quantity).toLocaleString()}
                        </td>
                        <td className="py-2">
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-500 hover:bg-red-50 p-1 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right — Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border p-5 sticky top-6">
            <h2 className="font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-500">
                <span>Items</span>
                <span>{cart.length} products</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Quantity</span>
                <span>{cart.reduce((s, i) => s + i.quantity, 0)}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={
                createMutation.isPending || !customerId || cart.length === 0
              }
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
            >
              {createMutation.isPending ? "Creating..." : "Create Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}