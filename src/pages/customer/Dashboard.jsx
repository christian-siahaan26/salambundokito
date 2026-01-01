import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { salesService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import { formatCurrency } from "../../utils/helpers";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // 1. Update State untuk menampung 4 kategori
  const [stats, setStats] = useState({
    totalOrders: 0,
    inProcess: 0, // Sedang Diantar/Diproses
    completed: 0, // Selesai Diantar
    pendingPayment: 0, // Menunggu Pembayaran
  });

  const [chartData, setChartData] = useState([]);
  const [lastActiveOrder, setLastActiveOrder] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await salesService.getAll();

      if (
        response.status &&
        response.data &&
        Array.isArray(response.data.data)
      ) {
        const userOrders = response.data.data;

        // --- LOGIKA PERHITUNGAN BARU ---

        // A. Total Pesanan
        const totalOrders = userOrders.length;

        // B. Menunggu Pembayaran
        const pendingPayment = userOrders.filter(
          (o) => o.status === "PENDING"
        ).length;

        // C. Selesai Diantar (Status Order SUCCESS && Delivery SENT)
        const completed = userOrders.filter((o) => {
          if (o.status !== "SUCCESS") return false;
          // Cek status pengiriman
          const delivery = o.delivery && o.delivery[0];
          const dStatus = delivery
            ? (delivery.delivery_status || "").toUpperCase()
            : "";
          return dStatus === "SENT";
        }).length;

        // D. Sedang Diantar/Diproses (Status Order SUCCESS && Delivery BUKAN SENT)
        // Ini mencakup: Preparing, On_The_Road, dll.
        const inProcess = userOrders.filter((o) => {
          if (o.status !== "SUCCESS") return false;
          const delivery = o.delivery && o.delivery[0];
          const dStatus = delivery
            ? (delivery.delivery_status || "").toUpperCase()
            : "";
          return dStatus !== "SENT" && dStatus !== "CANCELLED";
        }).length;

        setStats({ totalOrders, pendingPayment, completed, inProcess });

        // 2. Last Order
        if (userOrders.length > 0) {
          setLastActiveOrder(userOrders[0]);
        }

        // 3. Chart Data
        const processedChart = processChartData(userOrders);
        setChartData(processedChart);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (orders) => {
    const monthlyData = {};
    orders.forEach((order) => {
      // Hanya menghitung yang sudah dibayar (SUCCESS)
      if (order.status === "SUCCESS") {
        const date = new Date(order.created_at);
        const monthYear = date.toLocaleString("id-ID", { month: "short" });
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = 0;
        }
        monthlyData[monthYear] += order.total_amount;
      }
    });
    return Object.keys(monthlyData)
      .map((key) => ({
        name: key,
        total: monthlyData[key],
      }))
      .reverse();
  };

  const getDeliveryStatusLabel = (order) => {
    if (order.status === "PENDING") return "Menunggu Bayar";
    const delivery = order.delivery && order.delivery[0];
    const status = delivery
      ? (delivery.delivery_status || "").toUpperCase()
      : "";

    if (status === "SENT") return "Diterima";
    if (status === "ON_THE_ROAD" || status === "ON_DELIVERY")
      return "Kurir Jalan";
    if (order.status === "SUCCESS") return "Diproses";
    return "-";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Halo, {user?.name || "Pelanggan"}! 👋
            </h1>
            <p className="text-gray-600">
              Berikut ringkasan aktivitas pembelian gas Anda.
            </p>
          </div>
          <Button onClick={() => navigate("/customer/buy")}>
            + Beli Gas Baru
          </Button>
        </div>

        {/* 1. Stats Cards (4 KOLOM) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Pesanan */}
          <Card className="bg-white border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Pesanan</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
            </div>
          </Card>

          {/* Card 2: Sedang Diantar / Diproses */}
          <Card className="bg-white border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Sedang Proses/Diantar
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.inProcess}
                </p>
              </div>
              <div className="p-2 bg-indigo-50 rounded-full">
                <svg
                  className="w-6 h-6 text-indigo-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
          </Card>

          {/* Card 3: Selesai Diantar */}
          <Card className="bg-white border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Selesai Diantar</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.completed}
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-full">
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </Card>

          {/* Card 4: Menunggu Pembayaran */}
          <Card className="bg-white border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Menunggu Pembayaran
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.pendingPayment}
                </p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-full">
                <svg
                  className="w-6 h-6 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 2. Grafik Pengeluaran */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <h3 className="font-bold text-gray-800 mb-6">
                Grafik Pengeluaran
              </h3>

              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <Loading />
                </div>
              ) : chartData.length > 0 ? (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Bar
                        dataKey="total"
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                  <p>Belum ada data transaksi sukses.</p>
                </div>
              )}
            </Card>
          </div>

          {/* 3. Status Terakhir */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col">
              <h3 className="font-bold text-gray-800 mb-4">
                Status Pesanan Terakhir
              </h3>

              {loading ? (
                <Loading />
              ) : lastActiveOrder ? (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-semibold">
                        Order ID
                      </p>
                      <p className="font-mono text-lg font-bold text-gray-800">
                        #{lastActiveOrder.order_id.split("-")[1]}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          lastActiveOrder.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : lastActiveOrder.status === "SUCCESS"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {getDeliveryStatusLabel(lastActiveOrder)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total</span>
                      <span className="font-bold text-primary-600">
                        {formatCurrency(lastActiveOrder.total_amount)}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6"
                    variant="outline"
                    onClick={() =>
                      navigate(`/customer/orders/${lastActiveOrder.order_id}`)
                    }
                  >
                    Lihat Detail
                  </Button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
                  <p className="mb-4">Anda belum melakukan pemesanan.</p>
                  <Button size="sm" onClick={() => navigate("/customer/buy")}>
                    Beli Sekarang
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
