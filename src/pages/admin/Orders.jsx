import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import { salesService } from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Loading from "../../components/ui/Loading";
import { formatCurrency, formatDate } from "../../utils/helpers";

const AdminOrders = () => {
  const navigate = useNavigate(); // 2. Inisialisasi navigate
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await salesService.getAll();

      console.log("Response API:", response);

      if (
        response.status &&
        response.data &&
        Array.isArray(response.data.data)
      ) {
        setOrders(response.data.data);
      } else {
        console.warn("Format data tidak sesuai:", response);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Helper Status Pengiriman (Sama dengan Customer)
  const getDeliveryStatusData = (order) => {
    // Cek Payment dulu
    if (order.status === "PENDING") {
      return { label: "Menunggu Bayar", color: "gray" };
    }

    const deliveryData = order.delivery && order.delivery[0];

    if (deliveryData) {
      const rawStatus = (
        deliveryData.delivery_status ||
        deliveryData.deliveryStatus ||
        ""
      ).toUpperCase();

      if (rawStatus === "SENT") {
        return { label: "Diterima", color: "green" };
      }
      if (rawStatus === "ON_THE_ROAD" || rawStatus === "ON_DELIVERY") {
        return { label: "Sedang Diantar", color: "blue" };
      }
      if (rawStatus === "READY") {
        return { label: "Siap Dikirim", color: "yellow" };
      }
    }

    if (order.status === "SUCCESS") {
      return { label: "Perlu Diproses", color: "yellow" }; // Bahasa Admin: Perlu Diproses
    }

    return { label: "-", color: "gray" };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Daftar Pesanan</h1>

        <Card>
          {loading ? (
            <div className="py-8">
              <Loading />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Belum ada pesanan masuk.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold">
                      Order ID
                    </th>
                    {/* User ID diganti Nama User jika tersedia, atau biarkan ID */}
                    <th className="text-left py-3 px-4 font-semibold">
                      User ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">Total</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Pembayaran
                    </th>
                    {/* 4. Kolom Baru */}
                    <th className="text-left py-3 px-4 font-semibold">
                      Pengiriman
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Tanggal
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    // Panggil helper
                    const deliveryInfo = getDeliveryStatusData(order);

                    return (
                      <tr
                        key={order.order_id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-sm font-mono">
                          #{order.order_id.split("-")[1]}
                        </td>

                        <td className="py-3 px-4 text-sm text-gray-600">
                          {/* Jika nanti ada relasi user.name, ganti di sini */}
                          <span title={order.user_id}>
                            {order.user_id.substring(0, 8)}...
                          </span>
                        </td>

                        <td className="py-3 px-4 font-medium">
                          {formatCurrency(order.total_amount)}
                        </td>

                        <td className="py-3 px-4">
                          <Badge status={order.status} type="payment" />
                        </td>

                        {/* 5. Tampilan Status Pengiriman */}
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold 
                              ${
                                deliveryInfo.color === "green"
                                  ? "bg-green-100 text-green-800"
                                  : ""
                              }
                              ${
                                deliveryInfo.color === "blue"
                                  ? "bg-blue-100 text-blue-800"
                                  : ""
                              }
                              ${
                                deliveryInfo.color === "yellow"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : ""
                              }
                              ${
                                deliveryInfo.color === "gray"
                                  ? "bg-gray-100 text-gray-800"
                                  : ""
                              }
                            `}
                          >
                            {deliveryInfo.label}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(order.created_at)}
                        </td>

                        <td className="py-3 px-4">
                          <button
                            // 6. Navigasi ke Halaman Detail Admin
                            onClick={() =>
                              navigate(`/admin/orders/${order.order_id}`)
                            }
                            className="text-primary-600 hover:text-primary-800 text-sm font-medium hover:underline"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminOrders;
