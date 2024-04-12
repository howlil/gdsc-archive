const menus = [
  {
    menu: "Kopi Luwak",
    harga: 5000,
  },
  {
    menu: "Kopi Cina",
    harga: 7000,
  },
  {
    menu: "Kopi Thai",
    harga: 3000,
  },
  {
    menu: "Roti Thai",
    harga: 15000,
  },
];

const btn = document.getElementById("btn");

btn.addEventListener("click", () => {
  let namaPelanggan = prompt("Masukkan nama pelanggan: ");

  if (namaPelanggan || namaPelanggan === null) {
    alert(`Halo, selamat datang ${namaPelanggan}!`);

    do {
      let pilihanMenu = prompt(`
        Pilih menu:
        1. Daftar Menu dan Harga
        2. Transaksi
        3. Riwayat Transaksi
        4. Tampilkan Struk
        5. Keluar
        
        Masukkan nomor pilihan: `);

      switch (pilihanMenu) {
        case "1":
          displayMenu();
          break;
        case "2":
          buatTransaksi(namaPelanggan);
          break;
        case "3":
          tampilkanRiwayatTransaksi(namaPelanggan);
          break;
        case "4":
          tampilkanStruk(namaPelanggan);
          break;
        case "5":
          alert("Terima kasih sudah menggunakan aplikasi ini!");
          break;
        default:
          alert("Pilihan tidak valid, mohon masukkan angka 1-5");
      }
    } while (pilihanMenu < 1 || pilihanMenu > 5);
  } else {
    alert("Nama pelanggan tidak boleh kosong!");
  }
});

function tampilkanStruk(namaPelanggan) {
  const riwayatTransaksi = JSON.parse(localStorage.getItem(`riwayatTransaksi-${namaPelanggan}`)) || [];
  if (riwayatTransaksi.length === 0) {
    alert("Tidak ada riwayat transaksi yang tersedia.");
    return;
  }

  const modal = document.getElementById("strukModal");
  const containerElement = document.getElementById("struk-container");
  containerElement.innerHTML = ''; 

  riwayatTransaksi.forEach(transaksi => {
    const strukElement = document.createElement("div");
    strukElement.classList.add("struk");

    const judul = document.createElement("h1");
    judul.textContent = "Struk Pembayaran";
    strukElement.appendChild(judul);

    const tanggal = document.createElement("p");
    tanggal.textContent = `Tanggal: ${transaksi.tanggal}`;
    strukElement.appendChild(tanggal);

    const pelanggan = document.createElement("p");
    pelanggan.textContent = `Nama Pelanggan: ${namaPelanggan}`;
    strukElement.appendChild(pelanggan);

    const pesananJudul = document.createElement("p");
    pesananJudul.textContent = "Rincian Pesanan:";
    strukElement.appendChild(pesananJudul);

    const pesananList = document.createElement("ul");
    transaksi.pesanan.forEach(pesananItem => {
      const item = document.createElement("li");
      item.textContent = `${pesananItem.menu} x ${pesananItem.jumlah} - Rp ${pesananItem.hargaTotal}`;
      pesananList.appendChild(item);
    });
    strukElement.appendChild(pesananList);

    const pembayaranTotal = document.createElement("p");
    pembayaranTotal.textContent = `Total Pembayaran: Rp ${transaksi.totalPembayaran}`;
    strukElement.appendChild(pembayaranTotal);

    const pembayaranUang = document.createElement("p");
    pembayaranUang.textContent = `Uang Pembayaran: Rp ${transaksi.uangPembayaran}`;
    strukElement.appendChild(pembayaranUang);

    const pembayaranKembalian = document.createElement("p");
    pembayaranKembalian.textContent = `Kembalian: Rp ${transaksi.kembalian}`;
    strukElement.appendChild(pembayaranKembalian);

    const terimaKasih = document.createElement("p");
    terimaKasih.textContent = "Terima kasih!";
    strukElement.appendChild(terimaKasih);

    containerElement.appendChild(strukElement);
  });

  modal.style.display = "block";
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}



function displayMenu() {
  let menuList = "Daftar Menu:\n";
  menus.forEach((menu, index) => {
    const menuId = index + 1;
    menuList += `${menuId}. ${menu.menu} - Rp ${menu.harga}\n`;
  });
  alert(menuList);
}

function buatTransaksi(namaPelanggan) {
  let totalPembayaran = 0;
  let pesanan = [];

  do {
    displayMenu();
    let nomorMenu = prompt("Masukkan nomor menu yang ingin dipesan: ");

    if (
      !isNaN(nomorMenu) &&
      parseInt(nomorMenu) > 0 &&
      parseInt(nomorMenu) <= menus.length
    ) {
      const menuIndex = parseInt(nomorMenu) - 1;
      const menuPilihan = menus[menuIndex];

      let jumlahPesanan = prompt(`Masukkan jumlah ${menuPilihan.menu}: `);

      if (!isNaN(jumlahPesanan) && parseInt(jumlahPesanan) > 0) {
        const hargaTotal = menuPilihan.harga * parseInt(jumlahPesanan);
        totalPembayaran += hargaTotal;

        pesanan.push({
          menu: menuPilihan.menu,
          jumlah: parseInt(jumlahPesanan),
          harga: menuPilihan.harga,
          hargaTotal: hargaTotal,
        });

        alert(`
          Pesanan Anda:
          - ${menuPilihan.menu} x ${jumlahPesanan} = Rp ${hargaTotal}
          
          Total pembayaran saat ini: Rp ${totalPembayaran}
        `);

        let pesanLagi = prompt("Apakah ingin memesan lagi? (y/t): ");
        if (pesanLagi.toLowerCase() !== "y") {
          let uangPembayaran = prompt("Masukkan uang pembayaran: ");

          if (
            !isNaN(uangPembayaran) &&
            parseFloat(uangPembayaran) >= totalPembayaran
          ) {
            const kembalian = parseFloat(uangPembayaran) - totalPembayaran;
            alert(`
            Pembayaran selesai!
            
            Rincian:
            - Total pembayaran: Rp ${totalPembayaran}
            - Uang pembayaran: Rp ${uangPembayaran}
            - Kembalian: Rp ${kembalian}
          `);

            simpanRiwayatTransaksi(
              namaPelanggan,
              pesanan,
              totalPembayaran,
              uangPembayaran,
              kembalian
            );

            cetakStruk(
              namaPelanggan,
              pesanan,
              totalPembayaran,
              uangPembayaran,
              kembalian
            );

            let transaksiLagi = prompt(
              "Apakah ingin melakukan transaksi lagi? (y/t): "
            );
            if (transaksiLagi.toLowerCase() !== "y") {
              break;
            }
          } else {
            alert("Uang pembayaran tidak valid!");
          }
        } else {
          alert("Jumlah pesanan tidak valid!");
        }
      } else {
        alert("Nomor menu tidak valid!");
      }
    }
  } while (true);
}

function tampilkanRiwayatTransaksi(namaPelanggan) {
  let riwayatTransaksi =
    JSON.parse(localStorage.getItem(`riwayatTransaksi-${namaPelanggan}`)) || [];

  if (riwayatTransaksi.length === 0) {
    alert("Belum ada riwayat transaksi.");
    return;
  }

  let riwayatList = "Riwayat Transaksi:\n";
  riwayatTransaksi.forEach((transaksi, index) => {
    const transaksiId = index + 1;
    riwayatList += `
      Transaksi ${transaksiId}:
      - Tanggal: ${transaksi.tanggal}
      - Pesanan: ${transaksi.pesanan
        .map((pesananItem) => `${pesananItem.menu} x ${pesananItem.jumlah}`)
        .join(", ")}
      - Total pembayaran: Rp ${transaksi.totalPembayaran}
      - Uang pembayaran: Rp ${transaksi.uangPembayaran}
      - Kembalian: Rp ${transaksi.kembalian}
    `;
  });
  alert(riwayatList);
}

function cetakStruk(namaPelanggan, pesanan, totalPembayaran, uangPembayaran, kembalian) {
  const modal = document.getElementById("strukModal");
  const containerElement = document.getElementById("struk-container");
  containerElement.innerHTML = '';
  const strukElement = document.createElement("div");
  strukElement.classList.add("struk");
  const judul = document.createElement("h1");
  judul.textContent = "Struk Pembayaran";
  strukElement.appendChild(judul);
  const pelanggan = document.createElement("p");
  pelanggan.textContent = `Nama Pelanggan: ${namaPelanggan}`;
  strukElement.appendChild(pelanggan);
  const pesananJudul = document.createElement("p");
  pesananJudul.textContent = "Rincian Pesanan:";
  strukElement.appendChild(pesananJudul);
  const pesananList = document.createElement("ul");
  pesanan.forEach((pesananItem) => {
    const item = document.createElement("li");
    item.textContent = `${pesananItem.menu} x ${pesananItem.jumlah} - Rp ${pesananItem.hargaTotal}`;
    pesananList.appendChild(item);
  });
  strukElement.appendChild(pesananList);
  const pembayaranTotal = document.createElement("p");
  pembayaranTotal.textContent = `Total Pembayaran: Rp ${totalPembayaran}`;
  strukElement.appendChild(pembayaranTotal);
  const pembayaranUang = document.createElement("p");
  pembayaranUang.textContent = `Uang Pembayaran: Rp ${uangPembayaran}`;
  strukElement.appendChild(pembayaranUang);
  const pembayaranKembalian = document.createElement("p");
  pembayaranKembalian.textContent = `Kembalian: Rp ${kembalian}`;
  strukElement.appendChild(pembayaranKembalian);
  const terimaKasih = document.createElement("p");
  terimaKasih.textContent = "Terima kasih!";
  strukElement.appendChild(terimaKasih);
  containerElement.appendChild(strukElement);
  modal.style.display = "block";
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}


function simpanRiwayatTransaksi(
  namaPelanggan,
  pesanan,
  totalPembayaran,
  uangPembayaran,
  kembalian
) {
  const tanggal = new Date().toLocaleString();

  let riwayatTransaksi =
    JSON.parse(localStorage.getItem(`riwayatTransaksi-${namaPelanggan}`)) || [];

  riwayatTransaksi.push({
    tanggal: tanggal,
    pesanan: pesanan,

    totalPembayaran: totalPembayaran,
    uangPembayaran: uangPembayaran,
    kembalian: kembalian,
  });

  localStorage.setItem(
    `riwayatTransaksi-${namaPelanggan}`,
    JSON.stringify(riwayatTransaksi)
  );
}

window.addEventListener("load", () => {
  document.getElementById("btn").addEventListener("click", () => {});
});
