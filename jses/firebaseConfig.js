import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC-fP-uwqG9-Rj9M-kFbsvyQkTld-Jmj40",
        authDomain: "tampunganrumahbaru.firebaseapp.com",
        projectId: "tampunganrumahbaru",
        appId: "1:429517174589:web:8f5612adee09ee8fbf3754"
};
const db = getFirestore(initializeApp(firebaseConfig));

const form  = document.getElementById("rsvp-form");
const pesan = document.getElementById("pesan");
const kirim = document.getElementById("kirim");
const jumlahWrap = document.getElementById("jumlah-wrap");

function tampilPesan(teks, tipe) {
  pesan.hidden = false;
  pesan.className = "pesan " + tipe;
  pesan.textContent = teks;
}

// sembunyikan "jumlah" kalau tidak hadir
form.addEventListener("change", () => {
  jumlahWrap.hidden = form.status.value === "tidak";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const status = form.status.value;
  if (!nama)   return tampilPesan("Nama wajib diisi.", "err");
  if (!status) return tampilPesan("Pilih hadir atau tidak hadir dulu.", "err");

  kirim.disabled = true;
  try {
    await addDoc(collection(db, "rsvp"), {
      nama,
      status,
      jumlah: status === "hadir" ? parseInt(document.getElementById("jumlah").value, 10) : 0,
      ucapan: document.getElementById("ucapan").value.trim(),
      waktu: serverTimestamp()
    });
    form.reset();
    jumlahWrap.hidden = false;
    tampilPesan("Terima kasih, RSVP Anda sudah tersimpan.", "ok");
  } catch (err) {
    console.error(err);
    tampilPesan("Gagal mengirim. Coba lagi sebentar.", "err");
  } finally {
    kirim.disabled = false;
  }
});