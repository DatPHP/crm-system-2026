import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { productService } from "../services/product.service";
import { categoryService } from "../services/category.service";
import DataTable from "../components/DataTable";
import SearchInput from "../components/SearchInput";
import ExportButton from "../components/ExportButton";
import { useDebounce } from "../hooks/useDebounce";

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const { register, handleSubmit, reset, setValue } = useForm();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", debouncedSearch],
    queryFn: () => productService.getAll(debouncedSearch || undefined),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created!");
      reset();
      setShowForm(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated!");
      reset();
      setEditing(null);
      setShowForm(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Error"),
  });

  const deleteMutation = useMutation({
    mutationFn: productService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted!");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Error"),
  });

  const onSubmit = (formData: any) => {
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
      categoryId: parseInt(formData.categoryId),
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (row: any) => {
    setEditing(row);
    setValue("title", row.title);
    setValue("sku", row.sku);
    setValue("price", row.price);
    setValue("stockQuantity", row.stockQuantity);
    setValue("categoryId", row.categoryId);
    setValue("description", row.description || "");
    setShowForm(true);
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "sku", label: "SKU" },
    { key: "price", label: "Price", render: (r: any) => `$${r.price}` },
    { key: "stockQuantity", label: "Stock" },
    {
      key: "category",
      label: "Category",
      render: (r: any) => r.category?.name,
    },
    {
      key: "isActive",
      label: "Status",
      render: (r: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${r.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {r.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search title, SKU..."
          />
          <ExportButton
            options={[
              {
                label: "Excel",
                icon: "excel",
                filename: "products.xlsx",
                onExport: productService.exportExcel,
              },
            ]}
          />
          <button
            onClick={() => {
              setEditing(null);
              reset();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm whitespace-nowrap"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editing ? "Edit Product" : "New Product"}
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                {...register("title")}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SKU *</label>
              <input
                {...register("sku")}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price *</label>
              <input
                {...register("price")}
                type="number"
                step="0.01"
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock *</label>
              <input
                {...register("stockQuantity")}
                type="number"
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Category *
              </label>
              <select
                {...register("categoryId")}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">-- Select --</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <input
                {...register("description")}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div className="col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                {editing ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                  reset();
                }}
                className="border px-6 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <DataTable
        data={products}
        columns={columns}
        onEdit={handleEdit}
        onDelete={(row) => {
          if (confirm(`Delete "${row.title}"?`)) deleteMutation.mutate(row.id);
        }}
        isLoading={isLoading}
      />
    </div>
  );
}