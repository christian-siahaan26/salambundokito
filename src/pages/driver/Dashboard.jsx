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
} from "recharts"; // 1. Import Recharts
import { deliveryService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State Statistik
  const [stats, setStats] = useState({
    total: 0,
    ready: 0,
    onTheRoad: 0,
    sent: 0,
  });

  // State Grafik
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await deliveryService.getAll();

      // Normalisasi data dari backend
      let allTasks = [];
      if (
        response.status &&
        response.data &&
        Array.isArray(response.data.data)
      ) {
        allTasks = response.data.data;
      } else if (Array.isArray(response.data)) {
        allTasks = response.data;
      }

      // 1. FILTER: Hanya ambil tugas milik kurir yang login
      const myTasks = allTasks.filter(
        (t) => t.courir_name?.toLowerCase() === user?.name?.toLowerCase()
      );

      // 2. HITUNG STATISTIK KARTU
      setStats({
        total: myTasks.length,
        ready: myTasks.filter((t) => t.delivery_status === "READY").length,
        onTheRoad: myTasks.filter(
          (t) =>
            t.delivery_status === "ON_THE_ROAD" ||
            t.delivery_status === "ON_DELIVERY"
        ).length,
        sent: myTasks.filter((t) => t.delivery_status === "SENT").length,
      });

      // 3. OLAH DATA GRAFIK (Pengantaran Selesai per Bulan)
      const chart = processChartData(myTasks);
      setChartData(chart);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper: Mengubah data menjadi format Grafik
  const processChartData = (tasks) => {
    const monthlyCounts = {};

    tasks.forEach((task) => {
      // Hanya hitung yang statusnya SENT (Selesai)
      if (task.delivery_status === "SENT") {
        const date = new Date(task.created_at);
        const monthYear = date.toLocaleString("id-ID", {
          month: "short",
          year: "numeric",
        }); // Contoh: "Jan 2026"

        if (!monthlyCounts[monthYear]) {
          monthlyCounts[monthYear] = 0;
        }
        monthlyCounts[monthYear] += 1; // Tambah 1 paket
      }
    });

    // Convert object ke array untuk Recharts
    // Hasil: [{ name: "Jan 2026", count: 12 }, ...]
    return Object.keys(monthlyCounts)
      .map((key) => ({
        name: key,
        count: monthlyCounts[key],
      }))
      .reverse();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loading fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Kurir
            </h1>
            <p className="text-gray-600 mt-1">
              Halo, {user?.name}! Semangat mengantar.
            </p>
          </div>
          <Button onClick={() => navigate("/driver/tasks")}>Lihat Tugas</Button>
        </div>

        {/* 1. Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Total Tugas</p>
              <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </Card>

          <Card className="bg-yellow-50 border border-yellow-100">
            <div className="text-center">
              <p className="text-sm text-yellow-800 mb-2">Siap Diantar</p>
              <p className="text-4xl font-bold text-yellow-600">
                {stats.ready}
              </p>
            </div>
          </Card>

          <Card className="bg-blue-50 border border-blue-100">
            <div className="text-center">
              <p className="text-sm text-blue-800 mb-2">Sedang Jalan</p>
              <p className="text-4xl font-bold text-blue-600">
                {stats.onTheRoad}
              </p>
            </div>
          </Card>

          <Card className="bg-green-50 border border-green-100">
            <div className="text-center">
              <p className="text-sm text-green-800 mb-2">Selesai</p>
              <p className="text-4xl font-bold text-green-600">{stats.sent}</p>
            </div>
          </Card>
        </div>

        {/* 2. Grafik Pengantaran */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <Card className="h-full">
              <h3 className="font-bold text-gray-800 mb-6 text-lg">
                Grafik Pengantaran Selesai (Bulanan)
              </h3>

              {chartData.length > 0 ? (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#E5E7EB"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6B7280" }}
                        dy={10}
                      />
                      <YAxis
                        allowDecimals={false} // Supaya tidak ada angka pecahan (1.5 paket)
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6B7280" }}
                      />
                      <Tooltip
                        cursor={{ fill: "#F3F4F6" }}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        formatter={(value) => [`${value} Paket`, "Terkirim"]}
                      />
                      <Bar
                        dataKey="count"
                        fill="#10B981" // Warna Hijau
                        radius={[6, 6, 0, 0]}
                        barSize={50}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
                  <svg
                    className="w-12 h-12 mb-2 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p>Belum ada data pengantaran selesai.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DriverDashboard;
