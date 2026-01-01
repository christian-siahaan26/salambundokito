import { useState, useEffect } from "react";
import { deliveryService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import { formatDate } from "../../utils/helpers";

const DriverTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await deliveryService.getAll();

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

      const myTasks = allTasks.filter(
        (t) => t.courir_name?.toLowerCase() === user?.name?.toLowerCase()
      );
      setTasks(myTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (deliveryId, newStatus) => {
    // Konfirmasi sebelum update
    if (
      !confirm(
        `Ubah status menjadi ${
          newStatus === "SENT" ? "SELESAI" : "SEDANG JALAN"
        }?`
      )
    ) {
      return;
    }

    setUpdatingId(deliveryId);
    try {
      // 1. KIRIM REQUEST (Sesuai API: "ON_THE_ROAD" atau "SENT")
      const payload = { delivery_status: newStatus };
      const response = await deliveryService.updateStatus(deliveryId, payload);

      console.log("Update Response:", response); // Debugging

      // 2. CEK KEBERHASILAN (Handling Backend Bug: status false tapi message success)
      // Kita anggap sukses jika ada 'data' atau message mengandung 'Success'
      const isSuccess =
        response.status === true ||
        (response.message &&
          response.message.toLowerCase().includes("success")) ||
        response.data;

      if (isSuccess) {
        alert("Status berhasil diperbarui!");
        fetchTasks(); // Refresh data
      } else {
        alert(response.message || "Gagal update status.");
      }
    } catch (err) {
      console.error("Update error:", err);
      // Handle error jika axios throw error (misal 404/500)
      alert(err.response?.data?.message || "Terjadi kesalahan sistem.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || "").toUpperCase();
    if (s === "SENT")
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">
          SELESAI
        </span>
      );
    if (s === "ON_THE_ROAD" || s === "ON_DELIVERY")
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold">
          SEDANG JALAN
        </span>
      );
    return (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-bold">
        SIAP
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Tugas Pengantaran</h1>

        {loading ? (
          <Loading />
        ) : tasks.length === 0 ? (
          <Card>
            <div className="text-center py-12 text-gray-500">
              <p>Belum ada tugas pengantaran.</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6">
            {tasks.map((task) => {
              const status = (task.delivery_status || "").toUpperCase();

              return (
                <Card
                  key={task.delivery_id}
                  className="border-l-4 border-primary-500"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    {/* Info Kiri */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg font-bold text-gray-900">
                          #{task.delivery_id.substring(0, 8)}...
                        </span>
                        {getStatusBadge(status)}
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Order ID:</span>{" "}
                          <span className="font-mono text-blue-600">
                            {task.order_id}
                          </span>
                        </p>
                        <p>
                          <span className="font-medium">Tanggal:</span>{" "}
                          {formatDate(task.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Tombol Aksi Kanan */}
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      {/* STATUS: READY -> Kirim "ON_THE_ROAD" */}
                      {status === "READY" && (
                        <Button
                          onClick={() =>
                            handleUpdateStatus(task.delivery_id, "ON_THE_ROAD")
                          }
                          loading={updatingId === task.delivery_id}
                        >
                          🚀 Mulai Jalan
                        </Button>
                      )}

                      {/* STATUS: ON_THE_ROAD -> Kirim "SENT" */}
                      {(status === "ON_THE_ROAD" ||
                        status === "ON_DELIVERY") && (
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() =>
                            handleUpdateStatus(task.delivery_id, "SENT")
                          }
                          loading={updatingId === task.delivery_id}
                        >
                          ✅ Selesai
                        </Button>
                      )}

                      {status === "SENT" && (
                        <span className="text-center text-sm font-bold text-gray-400">
                          Tugas Selesai
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DriverTasks;
