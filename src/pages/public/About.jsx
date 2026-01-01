import Navbar from "../../components/layout/Navbar";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Tentang Kami
          </h1>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Siapa Kami?
            </h2>
            <p className="text-gray-600 mb-4">
              Gas 3Kg adalah platform online terpercaya untuk pemesanan tabung
              gas 3kg dengan sistem pembayaran yang mudah dan pengantaran yang
              cepat. Kami berkomitmen untuk memberikan pelayanan terbaik kepada
              pelanggan kami.
            </p>
            <p className="text-gray-600">
              Dengan pengalaman bertahun-tahun dalam industri distribusi gas,
              kami memahami kebutuhan pelanggan akan gas berkualitas dengan
              harga terjangkau dan layanan yang responsif.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Visi Kami</h2>
            <p className="text-gray-600">
              Menjadi platform distribusi gas terdepan yang mengutamakan
              kepuasan pelanggan dengan teknologi dan inovasi yang terus
              berkembang.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Misi Kami</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Menyediakan gas berkualitas dengan harga terjangkau
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Memberikan pelayanan pengantaran yang cepat dan aman
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Memudahkan proses pemesanan melalui platform digital
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Membangun kepercayaan pelanggan melalui transparansi dan
                kualitas
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
