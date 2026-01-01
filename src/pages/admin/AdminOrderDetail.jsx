import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { salesService } from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import { formatCurrency } from "../../utils/helpers";

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await salesService.getById(orderId);
      if (response.status && response.data) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk Copy ID ke Clipboard
  const handleCopyId = () => {
    if (order && order.order_id) {
      navigator.clipboard.writeText(order.order_id);
      alert("Order ID berhasil disalin!");
    }
  };

  const getDeliveryStatusText = (orderData) => {
    const delivery = orderData.delivery && orderData.delivery[0];
    const status = delivery
      ? (delivery.delivery_status || "").toUpperCase()
      : "";
    if (status === "SENT")
      return { label: "Diterima Customer", color: "green" };
    if (status === "ON_THE_ROAD")
      return { label: "Sedang Diantar", color: "blue" };
    if (status === "READY") return { label: "Siap Dikirim", color: "yellow" };
    return { label: "Belum Diproses", color: "gray" };
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="py-12">
          <Loading />
        </div>
      </DashboardLayout>
    );
  if (!order)
    return (
      <DashboardLayout>
        <div className="py-12 text-center">Data tidak ditemukan</div>
      </DashboardLayout>
    );

  const statusInfo = getDeliveryStatusText(order);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/admin/orders")}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            ← Kembali
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Detail Pesanan (Admin)
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Info Order */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <div className="flex justify-between mb-4">
                {/* --- PERBAIKAN DI SINI: ORDER ID LENGKAP --- */}
                <div className="flex-1 mr-4">
                  <p className="text-sm text-gray-500 mb-1">Order ID (Full)</p>
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-200">
                    <p className="font-mono font-bold text-sm text-gray-800 break-all">
                      {order.order_id}
                    </p>
                    <button
                      onClick={handleCopyId}
                      title="Salin Order ID"
                      className="text-primary-600 hover:text-primary-800 p-1"
                    >
                      {/* Icon Copy SVG */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                {/* ------------------------------------------- */}

                <div className="text-right whitespace-nowrap">
                  <Badge status={order.status} type="payment" />
                </div>
              </div>

              <div className="border-t py-4">
                <p className="font-bold mb-2">Item Pesanan</p>
                {!order.order_items || order.order_items.length === 0 ? (
                  <p className="text-gray-500 italic">Tidak ada detail item.</p>
                ) : (
                  order.order_items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between border-b py-2 last:border-0"
                    >
                      <span>
                        {item.product?.name || "Produk Gas"} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* AREA AKSI PENGIRIMAN */}
            <Card className="border-l-4 border-primary-500">
              <h3 className="font-bold text-gray-900 mb-4">Aksi Pengiriman</h3>
              <div className="p-4 bg-gray-50 rounded mb-4">
                <p className="text-sm text-gray-600">Status Saat Ini:</p>
                <p className={`font-bold text-${statusInfo.color}-600 text-lg`}>
                  {statusInfo.label}
                </p>
              </div>
            </Card>
          </div>

          {/* Info Customer */}
          <div className="space-y-6">
            <Card>
              <h3 className="font-bold text-gray-900 mb-4">Data Pelanggan</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">User ID</p>
                  <p className="font-mono text-xs break-all">{order.user_id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Pembayaran</p>
                  <p className="font-bold text-lg text-primary-600">
                    {formatCurrency(order.total_amount)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminOrderDetail;
