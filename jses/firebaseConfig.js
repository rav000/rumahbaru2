import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp }
from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

    const firebaseConfig = {
        apiKey: "AIzaSyC-fP-uwqG9-Rj9M-kFbsvyQkTld-Jmj40",
        authDomain: "tampunganrumahbaru.firebaseapp.com",
        projectId: "tampunganrumahbaru",
        appId: "1:429517174589:web:8f5612adee09ee8fbf3754"
    };
    const db = getFirestore(initializeApp(firebaseConfig));

    const form   = document.getElementById("rsvp-form");
    const pesan  = document.getElementById("pesan");
    const kirim  = document.getElementById("kirim");
    const guestId = new URLSearchParams(location.search).get("id");
    let tamu = null;

    function tampilPesan(teks, tipe) {
        pesan.className = "mt-3 alert alert-" + tipe;
        pesan.textContent = teks;
    }

const params  = new URLSearchParams(location.search);
const idLink  = (params.get("id") || "").trim();
const namaLink = (params.get("to") || "").trim();
let guestId = null;
let tamu = null;

const norm = (s) => String(s ?? "").trim().replace(/\s+/g, " ").toLowerCase();

function muatTamu() {
  return new Promise((resolve, reject) => {
    if (typeof Papa === "undefined") return reject(new Error("PapaParse belum dimuat"));
    Papa.parse("data/data-tamu.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      // buang BOM dan spasi di nama kolom, penyebab umum kolom "id" tidak terbaca
      transformHeader: (h) => h.replace(/^\uFEFF/, "").trim(),
      complete: (r) => {
        console.log("CSV terbaca:", r.data.length, "baris. Kolom:", r.meta.fields);
        const data = r.data;
        const ketemu =
          (idLink   && data.find((t) => String(t.id).trim() === idLink)) ||
          (namaLink && data.find((t) => norm(t.nama_tamu) === norm(namaLink))) ||
          null;
        resolve(ketemu);
      },
      error: (err) => reject(err)
    });
  });
}


    async function init() {
        
        if (!idLink && !namaLink) {
            form.hidden = true;
            return tampilPesan("Link undangan tidak valid.", "warning");
        }

        try {
            tamu = await muatTamu();
        } catch (err) {
            console.error(err);
            form.hidden = true;
            return tampilPesan("Data tamu gagal dimuat. Coba muat ulang halaman.", "danger");
        }

        if (!tamu) {
            form.hidden = true;
            return tampilPesan("Tamu tidak ditemukan.", "warning");
        }

        guestId = String(tamu.id).trim();
        document.getElementById("sapaan")?.replaceChildren("Kepada " + tamu.nama_tamu);


        // Isi ulang form jika tamu sudah pernah RSVP
        const snap = await getDoc(doc(db, "rsvp", guestId));
        if (snap.exists()) {
            const d = snap.data();
            form.status.value = d.status;
            document.getElementById("jumlah").value = d.jumlah || 1;
            document.getElementById("ucapan").value = d.ucapan || "";
            aturJumlah();
            tampilPesan("Anda sudah mengisi RSVP. Silakan ubah jika perlu.", "info");
        }
    }

  // Sembunyikan "jumlah" jika memilih tidak hadir
    function aturJumlah() {
        document.getElementById("jumlah-wrap").hidden = form.status.value === "tidak";
    }
    form.addEventListener("change", aturJumlah);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!form.status.value) return tampilPesan("Pilih hadir atau tidak hadir dulu.", "warning");

        const hadir = form.status.value === "hadir";
        kirim.disabled = true;
        try {
            await setDoc(doc(db, "rsvp", guestId), {
                nama:   tamu.nama_tamu,
                status: form.status.value,
                jumlah: hadir ? parseInt(document.getElementById("jumlah").value, 10) : 0,
                ucapan: document.getElementById("ucapan").value.trim(),
                waktu:  serverTimestamp()
            });
            tampilPesan("Terima kasih, RSVP Anda sudah tersimpan.", "success");
        } catch (err) {
            console.error(err);
            tampilPesan("Gagal mengirim. Coba lagi sebentar.", "danger");
        } finally {
            kirim.disabled = false;
        }
    });
init();