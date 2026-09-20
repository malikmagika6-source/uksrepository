// Database Mock Initial State
const initialSiswa = [
    { nis: '12345', nama: 'Andi Pratama', kelas: 'X RPL 2' },
    { nis: '12346', nama: 'Siti Aisyah', kelas: 'X RPL 1' },
    { nis: '12347', nama: 'Budi Setiawan', kelas: 'XI RPL 1' },
    { nis: '12348', nama: 'Rina Lestari', kelas: 'XI RPL 2' },
    { nis: '12349', nama: 'Dewi Sartika', kelas: 'XII RPL' }
];

const initialObat = [
    { kode: 'OBT001', nama: 'Paracetamol', jenis: 'Tablet', stok: 15 },
    { kode: 'OBT002', nama: 'Sirup Obat Batuk', jenis: 'Sirup', stok: 5 },
    { kode: 'OBT003', nama: 'Betadine', jenis: 'Salep', stok: 8 },
    { kode: 'OBT004', nama: 'Vitamin C', jenis: 'Tablet', stok: 25 },
    { kode: 'OBT005', nama: 'Antasida', jenis: 'Tablet', stok: 3 }
];

const initialRekamMedis = [
    { id: 1, tanggal: '2026-03-12', namaSiswa: 'Andi Pratama', nis: '12345', keluhan: 'Demam', tindakan: 'Istirahat, kompres', obat: 'Paracetamol', status: 'Kembali ke Kelas' },
    { id: 2, tanggal: '2026-03-12', namaSiswa: 'Siti Aisyah', nis: '12346', keluhan: 'Sakit Perut', tindakan: 'Observasi', obat: '-', status: 'Diizinkan Pulang' },
    { id: 3, tanggal: '2026-03-11', namaSiswa: 'Budi Setiawan', nis: '12347', keluhan: 'Pusing', tindakan: 'Istirahat, obat', obat: 'Sirup Obat Batuk', status: 'Kembali ke Kelas' },
    { id: 4, tanggal: '2026-03-11', namaSiswa: 'Rina Lestari', nis: '12348', keluhan: 'Luka', tindakan: 'Pembersihan luka', obat: 'Betadine', status: 'Rujukan RS' }
];

// Helper LocalStorage
function getStorage(key, defaultValue) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
}

function setStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Inisialisasi Data Awal
function initData() {
    if (!localStorage.getItem('uks_siswa')) setStorage('uks_siswa', initialSiswa);
    if (!localStorage.getItem('uks_obat')) setStorage('uks_obat', initialObat);
    if (!localStorage.getItem('uks_rekam_medis')) setStorage('uks_rekam_medis', initialRekamMedis);
    if (!localStorage.getItem('uks_registered_users')) setStorage('uks_registered_users', []);
}

initData();