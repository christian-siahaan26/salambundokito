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
import { deliveryService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State Statistik Kartu
  const [stats, setStats] = useState({
    total: 0,
    ready: 0,
    onTheRoad: 0,
    sent: 0,
  });

  // State Data & Grafik
  const [myAllTasks, setMyAllTasks] = useState([]); // Simpan semua tugas mentah
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Filter Tahun
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([
    new Date().getFullYear(),
  ]);

  useEffect(() => {
    fetchStats();
  }, [user]);

  // Update grafik jika tahun berubah
  useEffect(() => {
    if (myAllTasks.length > 0 || availableYears.length > 0) {
      const processed = processChartData(myAllTasks, selectedYear);
      setChartData(processed);
    }
  }, [selectedYear, myAllTasks]);

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

      setMyAllTasks(myTasks); // Simpan data mentah

      // 2. AMBIL TAHUN YANG TERSEDIA
      // Kita ambil tahun dari 'created_at' tugas yang statusnya SENT (Selesai)
      const finishedTasks = myTasks.filter((t) => t.delivery_status === "SENT");
      const years = [
        ...new Set(
          finishedTasks.map((t) => new Date(t.created_at).getFullYear())
        ),
      ];
      if (years.length > 0) {
        setAvailableYears(years.sort((a, b) => b - a));
      }

      // 3. HITUNG STATISTIK KARTU
      setStats({
        total: myTasks.length,
        ready: myTasks.filter((t) => t.delivery_status === "READY").length,
        onTheRoad: myTasks.filter(
          (t) =>
            t.delivery_status === "ON_THE_ROAD" ||
            t.delivery_status === "ON_DELIVERY"
        ).length,
        sent: finishedTasks.length,
      });

      // 4. PROSES GRAFIK AWAL
      setChartData(processChartData(myTasks, selectedYear));
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (tasks, year) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    // Template 12 Bulan
    const monthlyData = months.map((month) => ({
      name: month,
      count: 0,
    }));

    // Filter berdasarkan TAHUN dan status SENT
    const filteredTasks = tasks.filter((task) => {
      const taskYear = new Date(task.created_at).getFullYear();
      return task.delivery_status === "SENT" && taskYear === parseInt(year);
    });

    // Isi Data
    filteredTasks.forEach((task) => {
      const date = new Date(task.created_at);
      const monthIndex = date.getMonth();

      if (monthlyData[monthIndex]) {
        monthlyData[monthIndex].count += 1;
      }
    });

    return monthlyData;
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
              {/* Header Grafik & Filter */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="font-bold text-gray-800 text-lg">
                  Grafik Pengantaran Selesai ({selectedYear})
                </h3>

                <div className="flex items-center gap-2">
                  <label htmlFor="yearFilter" className="text-sm text-gray-600">
                    Tahun:
                  </label>
                  <select
                    id="yearFilter"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-green-500 focus:border-green-500 outline-none"
                  >
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {chartData.length > 0 ? (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
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
                        allowDecimals={false} // Angka bulat (1, 2, 3)
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
                        fill="#10B981" // Warna Hijau (Success)
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
                  <p>Belum ada data pengantaran.</p>
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
