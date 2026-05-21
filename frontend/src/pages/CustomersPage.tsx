import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { customerService } from "../services/customer.service";
import DataTable from "../components/DataTable";
import SearchInput from "../components/SearchInput";
import ExportButton from "../components/ExportButton";
import { useDebounce } from "../hooks/useDebounce";

export default function CustomersPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const { register, handleSubmit, reset, setValue } = useForm();

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers", debouncedSearch],
    queryFn: () => customerService.getAll(debouncedSearch || undefined),
  });

  const createMutation = useMutation({
    mutationFn: customerService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer created!");
      reset();
      setShowForm(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => customerService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Updated!");
      reset();
      setEditing(null);
      setShowForm(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Error"),
  });

  const deleteMutation = useMutation({
    mutationFn: customerService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Deleted!");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Error"),
  });

  const handleEdit = (row: any) => {
    setEditing(row);
    ["fullName", "email", "phone", "address", "note"].forEach((k) =>
      setValue(k, row[k] || ""),
    );
    setShowForm(true);
  };

  const onSubmit = (data: any) => {
    if (editing) updateMutation.mutate({ id: editing.id, data });
    else createMutation.mutate(data);
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    {
      key: "orders",
      label: "Orders",
      render: (r: any) => r._count?.orders ?? 0,
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search name, email, phone..."
          />
          <ExportButton
            options={[
              {
                label: "Excel",
                icon: "excel",
                filename: "customers.xlsx",
                onExport: customerService.exportExcel,
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
            <Plus size={18} /> Add Customer
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editing ? "Edit Customer" : "New Customer"}
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
          >
            {[
              ["fullName", "Full Name", true],
              ["email", "Email", false],
              ["phone", "Phone", false],
              ["address", "Address", false],
              ["note", "Note", false],
            ].map(([key, label, required]) => (
              <div key={String(key)}>
                <label className="block text-sm font-medium mb-1">
                  {String(label)}
                </label>
                <input
                  {...register(String(key))}
                  className="w-full border rounded-lg px-3 py-2"
                  required={!!required}
                />
              </div>
            ))}
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
        data={customers}
        columns={columns}
        onEdit={handleEdit}
        onDelete={(row) => {
          if (confirm(`Delete "${row.fullName}"?`))
            deleteMutation.mutate(row.id);
        }}
        isLoading={isLoading}
      />
    </div>
  );
}