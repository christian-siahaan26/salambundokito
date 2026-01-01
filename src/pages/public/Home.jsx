import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/layout/Navbar";
import Button from "../../components/ui/Button";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (user?.role === "CUSTOMER") {
        navigate("/customer/buy");
      } else {
        const dashboardRoutes = {
          OWNER: "/owner/dashboard",
          ADMIN: "/admin/dashboard",
          DRIVER: "/driver/dashboard",
        };
        navigate(dashboardRoutes[user?.role] || "/");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="container-custom py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Gas 3Kg Berkualitas
              <span className="text-primary-600"> Langsung ke Rumah Anda</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Pesan gas 3kg dengan mudah dan cepat. Pembayaran online yang aman,
              pengantaran langsung ke alamat Anda.
            </p>
            <div className="flex space-x-4">
              <Button size="lg" onClick={handleGetStarted}>
                Pesan Sekarang
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/about")}
              >
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-full h-96 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl shadow-2xl flex items-center justify-center">
              <svg
                className="w-64 h-64 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-custom py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Mengapa Memilih Kami?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary-600"
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
            <h3 className="text-xl font-bold mb-2">Pengantaran Cepat</h3>
            <p className="text-gray-600">
              Gas Anda akan diantar dengan cepat dan aman langsung ke alamat
              Anda.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Pembayaran Aman</h3>
            <p className="text-gray-600">
              Gunakan berbagai metode pembayaran online yang aman dan
              terpercaya.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Kualitas Terjamin</h3>
            <p className="text-gray-600">
              Gas 3kg berkualitas premium dengan harga terjangkau untuk Anda.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Siap untuk Pesan Gas 3Kg?
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            Daftar sekarang dan nikmati kemudahan pesan gas online
          </p>
          <Button size="lg" variant="secondary" onClick={handleGetStarted}>
            Mulai Sekarang
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container-custom text-center">
          <p>&copy; 2024 Gas 3Kg. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
