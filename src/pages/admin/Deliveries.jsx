import { useState, useEffect } from "react";
import { deliveryService, authService } from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import Alert from "../../components/ui/Alert";
import { formatDate } from "../../utils/helpers";

const AdminDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // --- 1. STATE PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10); // Limit 10 data per halaman
  const [meta, setMeta] = useState({
    total: 0,
    lastPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    page: 1,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    order_id: "",
    courir_name: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  // const [error, setError] = useState(""); // Sudah diganti Alert

  // --- 2. FETCH ULANG SAAT currentPage BERUBAH ---
  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Kirim params page & limit ke deliveryService
      const [deliveriesRes, courirsRes] = await Promise.all([
        deliveryService.getAll({ page: currentPage, limit: limit }),
        authService.getCourirs(),
      ]);

      // --- HANDLE RESPONSE DELIVERIES (PAGINATION) ---
      if (deliveriesRes.status && deliveriesRes.data) {
        // Cek apakah formatnya pagination (ada .data dan .meta)
        if (Array.isArray(deliveriesRes.data.data)) {
          setDeliveries(deliveriesRes.data.data);
          setMeta(deliveriesRes.data.meta || {});
        }
        // Fallback jika backend mengirim array langsung (belum pagination)
        else if (Array.isArray(deliveriesRes.data)) {
          setDeliveries(deliveriesRes.data);
        }
      }

      // --- HANDLE RESPONSE COURIERS ---
      if (
        courirsRes.status &&
        courirsRes.data &&
        Array.isArray(courirsRes.data.data)
      ) {
        setCouriers(courirsRes.data.data);
      } else if (courirsRes.data && Array.isArray(courirsRes.data)) {
        setCouriers(courirsRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. HANDLER PAGINATION ---
  const handleNextPage = () => {
    if (meta.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (meta.hasPrevPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setAlert(null);

    if (!formData.courir_name) {
      setAlert({
        type: "error",
        message: "Silahkan pilih kurir terlebih dahulu",
      });
      setSubmitLoading(false);
      return;
    }

    try {
      const response = await deliveryService.create(formData);

      if (response.status) {
        setIsModalOpen(false);
        setFormData({ order_id: "", courir_name: "" });
        fetchData(); // Refresh data
        setAlert({
          type: "success",
          message: "Pengiriman berhasil dibuat!",
        });
      } else {
        setAlert({
          type: "error",
          message: response.message || "Gagal membuat pengiriman",
        });
      }
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Terjadi kesalahan sistem",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || "").toUpperCase();
    let colorClass = "bg-gray-100 text-gray-800";
    let label = s;

    if (s === "SENT") {
      colorClass = "bg-green-100 text-green-800";
      label = "DITERIMA";
    } else if (s === "ON_THE_ROAD" || s === "ON_DELIVERY") {
      colorClass = "bg-blue-100 text-blue-800";
      label = "DIANTAR";
    } else if (s === "READY") {
      colorClass = "bg-yellow-100 text-yellow-800";
      label = "SIAP DIKIRIM";
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}
      >
        {label}
      </span>
    );
  };

  return (
    <DashboardLayout>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Status Pengantaran
            </h1>
            {/* Tampilkan Total Data */}
            <p className="text-sm text-gray-500 mt-1">
              Total Pengiriman: <b>{meta.total || deliveries.length}</b>
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            + Buat Pengiriman
          </Button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold">
                    Delivery ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Nama Kurir
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8">
                      <Loading />
                    </td>
                  </tr>
                ) : deliveries.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      Tidak ada pengiriman aktif
                    </td>
                  </tr>
                ) : (
                  deliveries.map((item) => (
                    <tr
                      key={item.delivery_id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm font-mono">
                        #{item.delivery_id.substring(0, 8)}...
                      </td>
                      <td className="py-3 px-4 text-sm font-mono text-blue-600">
                        {item.order_id}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {item.courir_name || "-"}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(item.delivery_status)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(item.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* --- 4. TOMBOL NAVIGASI HALAMAN --- */}
          {!loading && deliveries.length > 0 && (
            <div className="flex items-center justify-between border-t pt-4 mt-4 px-2">
              <div className="text-sm text-gray-700">
                Halaman <span className="font-bold">{currentPage}</span> dari{" "}
                <span className="font-bold">{meta.lastPage || 1}</span>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={!meta.hasPrevPage || loading}
                >
                  &larr; Sebelumnya
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!meta.hasNextPage || loading}
                >
                  Selanjutnya &rarr;
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Buat Pengiriman Baru</h2>

            {/* Error di modal bisa dihapus jika sudah pakai Alert global, 
                atau biarkan saja untuk backup */}
            {/* {error && (...)} */}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* INPUT ORDER ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order ID
                </label>
                <input
                  type="text"
                  name="order_id"
                  value={formData.order_id}
                  onChange={handleInputChange}
                  placeholder="Paste Order ID di sini"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              {/* INPUT NAMA KURIR (DROPDOWN) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pilih Kurir
                </label>
                <select
                  name="courir_name"
                  value={formData.courir_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500 bg-white"
                  required
                >
                  <option value="">-- Pilih Kurir --</option>
                  {couriers.length === 0 ? (
                    <option disabled>Tidak ada data kurir</option>
                  ) : (
                    couriers.map((courier) => (
                      <option key={courier.user_id} value={courier.name}>
                        {courier.name} ({courier.email})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitLoading}
                >
                  Batal
                </Button>
                <Button type="submit" loading={submitLoading}>
                  Simpan Pengiriman
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDeliveries;
