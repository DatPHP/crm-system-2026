import { useState, useEffect } from "react";
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
import api from "../lib/axios";
import Pagination from "../components/Pagination";
import { ImagePlus, X as XIcon } from "lucide-react";

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const debouncedSearch = useDebounce(search, 400);
  const { register, handleSubmit, reset, setValue } = useForm();

  // Thêm sau khai báo debouncedSearch
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data: result, isLoading } = useQuery({
    queryKey: ["products", debouncedSearch, page],
    queryFn: () => productService.getAll(debouncedSearch || undefined, page),
  });

  const products = result?.data || [];
  const pagination = result?.meta;

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

  const onSubmit = async (formData: any) => {
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
      categoryId: parseInt(formData.categoryId),
    };

    try {
      let savedProduct: any;
      if (editing) {
        savedProduct = await updateMutation.mutateAsync({
          id: editing.id,
          data: payload,
        });
      } else {
        savedProduct = await createMutation.mutateAsync(payload);
      }

      // Upload ảnh nếu có chọn file mới
      if (imageFile && savedProduct?.id) {
        const formData = new FormData();
        formData.append("file", imageFile);
        await api.post(`/upload/products/${savedProduct.id}/image`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        queryClient.invalidateQueries({ queryKey: ["products"] });
      }

      setImageFile(null);
      setImagePreview("");
    } catch {}
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
    {
      key: "image",
      label: "Image",
      render: (r: any) =>
        r.thumbnail || r.image ? (
          <img
            src={r.thumbnail || r.image}
            alt={r.title}
            className="w-10 h-10 object-cover rounded-lg border"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-100 rounded-lg border flex items-center justify-center text-gray-300">
            <ImagePlus size={16} />
          </div>
        ),
    },
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
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Product Image
              </label>
              <div className="flex items-center gap-3">
                {/* Preview */}
                {(imagePreview || editing?.image) && (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                    <img
                      src={imagePreview || editing?.image}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("");
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-0.5"
                    >
                      <XIcon size={12} />
                    </button>
                  </div>
                )}

                {/* Upload button */}
                <label className="flex items-center gap-2 cursor-pointer border rounded-lg px-3 py-2 hover:bg-gray-50 text-sm">
                  <ImagePlus size={16} />
                  {imageFile ? imageFile.name : "Choose image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              </div>
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
      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
