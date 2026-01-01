// Format currency to IDR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

// Get status badge color
export const getStatusColor = (status, type = "delivery") => {
  if (type === "delivery") {
    const colors = {
      READY: "bg-blue-100 text-blue-800",
      ON_THE_ROAD: "bg-yellow-100 text-yellow-800",
      SENT: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  }

  if (type === "payment") {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      SUCCESS: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800",
      CHALLENGE: "bg-orange-100 text-orange-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  }

  return "bg-gray-100 text-gray-800";
};

// Get status text
export const getStatusText = (status, type = "delivery") => {
  if (type === "delivery") {
    const texts = {
      READY: "Siap Diantar",
      ON_THE_ROAD: "Dalam Perjalanan",
      SENT: "Terkirim",
    };
    return texts[status] || status;
  }

  if (type === "payment") {
    const texts = {
      PENDING: "Menunggu Pembayaran",
      SUCCESS: "Berhasil",
      FAILED: "Gagal",
      CHALLENGE: "Perlu Verifikasi",
    };
    return texts[status] || status;
  }

  return status;
};

// Get role display name
export const getRoleDisplayName = (role) => {
  const roleNames = {
    OWNER: "Owner",
    ADMIN: "Admin",
    DRIVER: "Driver",
    CUSTOMER: "Customer",
    GUEST: "Guest",
  };
  return roleNames[role] || role;
};

// Validate file
export const validateFile = (
  file,
  maxSizeMB = 5,
  allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
) => {
  if (!file) {
    return { valid: false, message: "File tidak boleh kosong" };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, message: "Format file tidak didukung" };
  }

  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, message: `Ukuran file maksimal ${maxSizeMB}MB` };
  }

  return { valid: true };
};

// Create form data for file upload
export const createFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });
  return formData;
};
