import Navbar from "../../components/layout/Navbar";
import Card from "../../components/ui/Card";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Hubungi Kami
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Informasi Kontak
              </h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary-600 mr-3 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Alamat</p>
                    <p className="text-gray-600">
                      Jl. Margonda Raya No. 100
                      <br />
                      Depok, Indonesia 16420
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary-600 mr-3 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">info@gas3kg.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary-600 mr-3 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Telepon</p>
                    <p className="text-gray-600">+62 812-3456-7890</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary-600 mr-3 mt-1"
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
                  <div>
                    <p className="font-medium text-gray-900">Jam Operasional</p>
                    <p className="text-gray-600">
                      Senin - Sabtu: 08:00 - 20:00
                      <br />
                      Minggu: 09:00 - 17:00
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Kirim Pesan
              </h2>
              <p className="text-gray-600 mb-4">
                Untuk pertanyaan lebih lanjut, silakan hubungi kami melalui
                informasi kontak di samping atau melalui email.
              </p>
              <p className="text-gray-600">
                Tim customer service kami siap membantu Anda dengan senang hati!
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
