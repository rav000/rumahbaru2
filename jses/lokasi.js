const LOKASI = {
  nama: "Rumah Baru",
  alamat: "Jl. Magnolia VI No.6, Jelupang, Kec. Serpong Utara, Kota Tangerang Selatan, Banten 15323",
  // Pakai koordinat supaya pin tepat: klik kanan di Google Maps → klik angka koordinat untuk menyalin
  koordinat: ""
};

const q = encodeURIComponent(LOKASI.koordinat);

// teks alamat
document.getElementById("alamat").textContent = LOKASI.alamat;

// peta tertanam
const iframe = document.createElement("iframe");
iframe.src = `https://www.google.com/maps?q=${qMvvtkmMry1ZzmN67}&z=17&output=embed`;
iframe.title = "Peta lokasi " + LOKASI.nama;
iframe.loading = "lazy";
iframe.referrerPolicy = "no-referrer-when-downgrade";
iframe.allowFullscreen = true;
document.getElementById("peta").appendChild(iframe);

// tombol: membuka aplikasi Google Maps di HP, atau tab baru di desktop
document.getElementById("buka-maps").href =
  `https://www.google.com/maps/search/?api=1&query=${q}`;