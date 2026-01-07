import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DualAxisBarChart from "../../components/charts/DualAxisBarChart";
import { deliveryService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    total: 0,
    ready: 0,
    onTheRoad: 0,
    sent: 0,
  });

  const [myAllTasks, setMyAllTasks] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([
    new Date().getFullYear(),
  ]);

  useEffect(() => {
    fetchStats();
  }, [user]);

  useEffect(() => {
    if (myAllTasks.length > 0 || availableYears.length > 0) {
      const processed = processChartData(myAllTasks, selectedYear);
      setChartData(processed);
    }
  }, [selectedYear, myAllTasks]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const response = await deliveryService.getAll({ page: 1, limit: 1000 });

      let allTasks = [];
      if (response.status && response.data) {
        if (Array.isArray(response.data.data)) {
          allTasks = response.data.data;
        } else if (Array.isArray(response.data)) {
          allTasks = response.data;
        }
      }

      const myTasks = allTasks.filter(
        (t) => t.courir_name?.toLowerCase() === user?.name?.toLowerCase()
      );

      setMyAllTasks(myTasks);

      const finishedTasks = myTasks.filter((t) => t.delivery_status === "SENT");
      const years = [
        ...new Set(
          finishedTasks.map((t) => new Date(t.created_at).getFullYear())
        ),
      ];
      if (years.length > 0) {
        setAvailableYears(years.sort((a, b) => b - a));
      }

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

      setChartData(processChartData(myTasks, selectedYear));
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (tasks, year) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
    ];

    const monthlyData = months.map((month) => ({
      name: month,
      count: 0,
      deliveredValue: 0,
    }));

    const filteredTasks = tasks.filter((task) => {
      const taskYear = new Date(task.created_at).getFullYear();
      return task.delivery_status === "SENT" && taskYear === parseInt(year);
    });

    filteredTasks.forEach((task) => {
      const date = new Date(task.created_at);
      const monthIndex = date.getMonth();

      if (monthlyData[monthIndex]) {
        monthlyData[monthIndex].count += 1;
        const orderAmount = task.order ? task.order.total_amount : 0;
        monthlyData[monthIndex].deliveredValue += orderAmount;
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

        <div className="grid md:grid-cols-4 gap-6">
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tugas</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Siap Diantar</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {stats.ready}
                </p>
                <p className="text-xs text-gray-400 mt-1">Perlu Pickup</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sedang Jalan</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {stats.onTheRoad}
                </p>
                <p className="text-xs text-gray-400 mt-1">Dalam Perjalanan</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selesai</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {stats.sent}
                </p>
                <p className="text-xs text-gray-400 mt-1">Tugas Berhasil</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* GRAFIK */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <DualAxisBarChart
              title="Grafik Pengantaran Selesai"
              data={chartData}
              year={selectedYear}
              years={availableYears}
              onYearChange={setSelectedYear}
              height="h-80"
              bar1Key="deliveredValue"
              bar1Label="Nilai Barang"
              bar1Color="#10B981"
              bar2Key="count"
              bar2Label="Jumlah Paket"
              bar2Color="#3B82F6"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DriverDashboard;