const target = new Date("2027-01-01T00:00:00").getTime();

const timer = setInterval(() => {
    const selisih = target - Date.now();

    if (selisih <= 0) {
        clearInterval(timer);
        document.getElementById("countdown").innerHTML = "<h2>Waktu telah tiba!</h2>";
        return;
    }

    document.getElementById("hari").textContent   = Math.floor(selisih / (1000 * 60 * 60 * 24));
    document.getElementById("jam").textContent    = Math.floor((selisih / (1000 * 60 * 60)) % 24);
    document.getElementById("menit").textContent  = Math.floor((selisih / (1000 * 60)) % 60);
    document.getElementById("detik").textContent  = Math.floor((selisih / 1000) % 60);
}, 1000);