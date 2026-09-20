let currentPage = 'auth';

// Router Controller Utama
function navigateTo(pageId) {
    const activeUser = getStorage('uks_active_user', null);

    if (!activeUser && pageId !== 'auth') {
        showToast('Anda harus login terlebih dahulu!', 'error');
        pageId = 'auth';
    }

    currentPage = pageId;
    const sidebar = document.getElementById('sidebar-nav');
    const pageContainer = document.getElementById('page-container');

    if (pageId === 'auth') {
        sidebar.classList.add('hidden');
    } else {
        sidebar.classList.remove('hidden');
        updateActiveNav(pageId);
    }

    pageContainer.innerHTML = '';
    pageContainer.className = 'page-fade-enter max-w-7xl mx-auto w-full';

    switch (pageId) {
        case 'auth':
            pageContainer.innerHTML = renderAuthPage();
            break;
        case 'dashboard':
            pageContainer.innerHTML = renderDashboardPage();
            break;
        case 'form-rekam-medis':
            pageContainer.innerHTML = renderFormRekamMedisPage();
            break;
        case 'stok-obat':
            pageContainer.innerHTML = renderStokObatPage();
            break;
        case 'riwayat-kesehatan':
            pageContainer.innerHTML = renderRiwayatKesehatanPage();
            break;
        default:
            pageContainer.innerHTML = renderDashboardPage();
    }
}

function updateActiveNav(pageId) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('nav-btn-active');
    });
    const activeBtn = document.getElementById(`nav-${pageId}`);
    if (activeBtn) activeBtn.classList.add('nav-btn-active');
}

/* ==========================================================================
   RENDERERS UNTUK HALAMAN
   ========================================================================== */

// 1. Halaman Auth (Liquid Glass Login/Register Card)
function renderAuthPage() {
    return `
    <div class="min-h-[85vh] flex items-center justify-center py-6 px-4">
        <div class="max-w-md w-full glass-card p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden">
            <div class="text-center mb-8">
                <div class="inline-flex p-4 liquid-badge text-white rounded-3xl mb-3">
                    <i class="fa-solid fa-notes-medical text-3xl"></i>
                </div>
                <h2 class="text-3xl font-black text-slate-800 tracking-tight">UKS <span class="text-pink-600">Plus</span></h2>
                <p class="text-xs font-bold text-pink-700/80 tracking-widest uppercase mt-1">Sistem Monitoring UKS</p>
                <p class="text-xs text-slate-500 mt-1 italic">Sehat Bersama, Prestasi Juara</p>
            </div>

            <h3 id="auth-title" class="text-lg font-bold text-slate-800 mb-6 text-center">Masuk ke Akun Anda</h3>

            <form onsubmit="handleAuthSubmit(event)" class="space-y-4">
                <div id="name-input-group" class="hidden">
                    <label class="block text-[11px] font-extrabold text-slate-600 mb-1 uppercase tracking-wider">Nama Lengkap Petugas</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-pink-500/70">
                            <i class="fa-solid fa-user-gear"></i>
                        </span>
                        <input type="text" id="auth-fullname" placeholder="Contoh: Bu Sari" class="w-full pl-11 pr-4 py-3.5 rounded-2xl glass-input text-xs font-medium">
                    </div>
                </div>

                <div>
                    <label class="block text-[11px] font-extrabold text-slate-600 mb-1 uppercase tracking-wider">Username</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-pink-500/70">
                            <i class="fa-solid fa-user"></i>
                        </span>
                        <input type="text" id="auth-username" required placeholder="Masukkan username" class="w-full pl-11 pr-4 py-3.5 rounded-2xl glass-input text-xs font-medium">
                    </div>
                </div>

                <div>
                    <label class="block text-[11px] font-extrabold text-slate-600 mb-1 uppercase tracking-wider">Password</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-pink-500/70">
                            <i class="fa-solid fa-lock"></i>
                        </span>
                        <input type="password" id="auth-password" required placeholder="••••••••" class="w-full pl-11 pr-4 py-3.5 rounded-2xl glass-input text-xs font-medium">
                    </div>
                </div>

                <button type="submit" id="auth-submit-btn" class="liquid-btn-primary w-full py-4 rounded-2xl font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 mt-2">
                    <span>Login</span>
                    <i class="fa-solid fa-arrow-right text-xs"></i>
                </button>
            </form>

            <p id="auth-toggle-link" class="text-center text-xs text-slate-600 mt-6 font-medium">
                Belum punya akun? <a href="#" onclick="toggleAuthMode()" class="text-pink-600 font-bold hover:underline">Register Akun Baru</a>
            </p>
        </div>
    </div>`;
}

// 2. Dashboard Petugas UKS
function renderDashboardPage() {
    const activeUser = getStorage('uks_active_user', { name: 'Petugas UKS' });
    const rekamMedis = getStorage('uks_rekam_medis', []);
    const obatList = getStorage('uks_obat', []);

    const totalBerobatToday = rekamMedis.length;
    const stokKritis = obatList.filter(o => o.stok <= 5).length;

    const tableRows = rekamMedis.slice(0, 5).map(item => `
        <tr class="border-b border-pink-100/50 hover:bg-white/30 transition">
            <td class="py-3.5 px-4 text-xs font-medium text-slate-600">${item.tanggal}</td>
            <td class="py-3.5 px-4 text-xs font-bold text-slate-800">${item.namaSiswa}</td>
            <td class="py-3.5 px-4 text-xs text-slate-600">${item.keluhan}</td>
            <td class="py-3.5 px-4 text-xs">${getStatusBadge(item.status)}</td>
        </tr>
    `).join('');

    return `
    <div class="space-y-6">
        <div>
            <h2 class="text-2xl font-black text-slate-800 tracking-tight">Selamat Datang, ${activeUser.name}</h2>
            <p class="text-xs text-pink-700/80 font-semibold mt-0.5">Petugas UKS Active Session</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="glass-card p-6 rounded-3xl flex items-center gap-5">
                <div class="p-4 liquid-badge text-white rounded-2xl">
                    <i class="fa-solid fa-users text-2xl"></i>
                </div>
                <div>
                    <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Siswa Berobat</p>
                    <p class="text-3xl font-black text-slate-800 mt-0.5">${totalBerobatToday} <span class="text-xs font-medium text-slate-500">siswa</span></p>
                </div>
            </div>

            <div class="glass-card p-6 rounded-3xl flex items-center justify-between">
                <div class="flex items-center gap-5">
                    <div class="p-4 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-500/30">
                        <i class="fa-solid fa-capsules text-2xl"></i>
                    </div>
                    <div>
                        <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Stok Obat Kritis</p>
                        <p class="text-3xl font-black text-rose-600 mt-0.5">${stokKritis} <span class="text-xs font-medium text-slate-500">jenis</span></p>
                    </div>
                </div>
                <div class="p-2.5 bg-rose-100 text-rose-600 rounded-full">
                    <i class="fa-solid fa-triangle-exclamation text-sm"></i>
                </div>
            </div>
        </div>

        <div class="glass-card p-6 rounded-3xl space-y-4">
            <div class="flex items-center justify-between">
                <h3 class="text-base font-extrabold text-slate-800">Rekam Medis Terbaru</h3>
                <button onclick="navigateTo('riwayat-kesehatan')" class="text-xs font-bold text-pink-600 hover:underline">Lihat Semua</button>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b border-pink-200/60 text-slate-500 text-[11px] font-black uppercase tracking-wider">
                            <th class="py-3 px-4">Tanggal</th>
                            <th class="py-3 px-4">Nama Siswa</th>
                            <th class="py-3 px-4">Keluhan</th>
                            <th class="py-3 px-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows.length ? tableRows : '<tr><td colspan="4" class="text-center py-6 text-xs text-slate-400">Belum ada data rekam medis</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}

// 3. Form Rekam Medis (Cascading Kelas -> Siswa)
function renderFormRekamMedisPage() {
    const obatList = getStorage('uks_obat', []);
    const today = new Date().toISOString().split('T')[0];
    const obatOptions = obatList.map(o => `<option value="${o.nama}">${o.nama} (Stok: ${o.stok})</option>`).join('');

    return `
    <div class="space-y-6 max-w-4xl mx-auto">
        <div class="flex items-center gap-4">
            <button onclick="navigateTo('dashboard')" class="liquid-btn p-3 rounded-2xl text-slate-700">
                <i class="fa-solid fa-arrow-left"></i>
            </button>
            <h2 class="text-2xl font-black text-slate-800">Form Rekam Medis</h2>
        </div>

        <form onsubmit="handleSaveRekamMedis(event)" class="glass-card p-6 md:p-8 rounded-[2.5rem] space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-[11px] font-black text-slate-700 mb-1 uppercase tracking-wider">1. Pilih Kelas</label>
                    <select id="form-kelas" required onchange="handleKelasChange(this.value)" class="w-full p-3.5 rounded-2xl glass-input text-xs font-medium">
                        <option value="" disabled selected>-- Pilih Kelas Dulu --</option>
                        <option value="X RPL 1">X RPL 1</option>
                        <option value="X RPL 2">X RPL 2</option>
                        <option value="XI RPL 1">XI RPL 1</option>
                        <option value="XI RPL 2">XI RPL 2</option>
                        <option value="XII RPL">XII RPL</option>
                    </select>
                </div>

                <div>
                    <label class="block text-[11px] font-black text-slate-700 mb-1 uppercase tracking-wider">2. Pilih Siswa</label>
                    <select id="form-siswa" required disabled class="w-full p-3.5 rounded-2xl glass-input text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                        <option value="" disabled selected>Pilih kelas terlebih dahulu...</option>
                    </select>
                </div>
            </div>

            <div>
                <label class="block text-[11px] font-black text-slate-700 mb-1 uppercase tracking-wider">Tanggal Periksa</label>
                <input type="date" id="form-tanggal" required value="${today}" class="w-full p-3.5 rounded-2xl glass-input text-xs font-medium">
            </div>

            <div>
                <label class="block text-[11px] font-black text-slate-700 mb-1 uppercase tracking-wider">Keluhan</label>
                <textarea id="form-keluhan" required rows="3" placeholder="Masukkan keluhan siswa..." class="w-full p-3.5 rounded-2xl glass-input text-xs font-medium"></textarea>
            </div>

            <div>
                <label class="block text-[11px] font-black text-slate-700 mb-1 uppercase tracking-wider">Tindakan</label>
                <textarea id="form-tindakan" required rows="3" placeholder="Masukkan tindakan yang diberikan..." class="w-full p-3.5 rounded-2xl glass-input text-xs font-medium"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-[11px] font-black text-slate-700 mb-1 uppercase tracking-wider">Obat yang Diberikan</label>
                    <select id="form-obat" class="w-full p-3.5 rounded-2xl glass-input text-xs font-medium">
                        <option value="-">Pilih obat (jika ada)</option>
                        ${obatOptions}
                    </select>
                </div>
                <div>
                    <label class="block text-[11px] font-black text-slate-700 mb-1 uppercase tracking-wider">Jumlah Obat</label>
                    <input type="number" id="form-jumlah-obat" min="1" placeholder="Jumlah" class="w-full p-3.5 rounded-2xl glass-input text-xs font-medium">
                </div>
            </div>

            <div>
                <label class="block text-[11px] font-black text-slate-700 mb-1 uppercase tracking-wider">Status Kondisi</label>
                <select id="form-status" required class="w-full p-3.5 rounded-2xl glass-input text-xs font-medium">
                    <option value="" disabled selected>Pilih status kondisi</option>
                    <option value="Kembali ke Kelas">Kembali ke Kelas</option>
                    <option value="Diizinkan Pulang">Diizinkan Pulang</option>
                    <option value="Rujukan RS">Rujukan RS</option>
                </select>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-white/40">
                <button type="reset" onclick="resetFormSiswa()" class="liquid-btn px-6 py-3 rounded-2xl text-xs font-bold text-slate-700">Reset</button>
                <button type="submit" class="liquid-btn-primary px-7 py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider">Simpan</button>
            </div>
        </form>
    </div>`;
}

function handleKelasChange(selectedKelas) {
    const siswaList = getStorage('uks_siswa', []);
    const filteredSiswa = siswaList.filter(s => s.kelas === selectedKelas);
    const siswaSelect = document.getElementById('form-siswa');

    if (!siswaSelect) return;

    siswaSelect.disabled = false;
    siswaSelect.innerHTML = '<option value="" disabled selected>-- Pilih Siswa --</option>' + 
        filteredSiswa.map(s => `<option value="${s.nis}">${s.nama} (${s.nis})</option>`).join('');
}

function resetFormSiswa() {
    const siswaSelect = document.getElementById('form-siswa');
    if (siswaSelect) {
        siswaSelect.disabled = true;
        siswaSelect.innerHTML = '<option value="" disabled selected>Pilih kelas terlebih dahulu...</option>';
    }
}

function handleSaveRekamMedis(e) {
    e.preventDefault();
    const siswaNis = document.getElementById('form-siswa').value;
    const tanggal = document.getElementById('form-tanggal').value;
    const keluhan = document.getElementById('form-keluhan').value;
    const tindakan = document.getElementById('form-tindakan').value;
    const obat = document.getElementById('form-obat').value;
    const status = document.getElementById('form-status').value;

    const siswaList = getStorage('uks_siswa', []);
    const targetSiswa = siswaList.find(s => s.nis === siswaNis);

    if (!targetSiswa) {
        showToast('Pilih siswa terlebih dahulu!', 'error');
        return;
    }

    const newEntry = {
        id: Date.now(),
        tanggal,
        namaSiswa: targetSiswa.nama,
        nis: targetSiswa.nis,
        keluhan,
        tindakan,
        obat,
        status
    };

    const rekamMedis = getStorage('uks_rekam_medis', []);
    rekamMedis.unshift(newEntry);
    setStorage('uks_rekam_medis', rekamMedis);

    showToast('Data Rekam Medis Berhasil Disimpan!', 'success');
    navigateTo('dashboard');
}

// 4. Halaman Stok Obat
function renderStokObatPage() {
    const obatList = getStorage('uks_obat', []);

    const rows = obatList.map(o => `
        <tr class="border-b border-pink-100/50 hover:bg-white/30 transition">
            <td class="py-3.5 px-4 text-xs font-mono font-bold text-pink-700">${o.kode}</td>
            <td class="py-3.5 px-4 text-xs font-bold text-slate-800">${o.nama}</td>
            <td class="py-3.5 px-4 text-xs font-medium text-slate-600">${o.jenis}</td>
            <td class="py-3.5 px-4 text-xs font-black ${o.stok <= 5 ? 'text-rose-600' : 'text-slate-800'}">${o.stok}</td>
            <td class="py-3.5 px-4 text-xs flex gap-2">
                <button onclick="showToast('Fitur edit obat siap dikembangkan!', 'info')" class="liquid-btn p-2 rounded-xl text-pink-600"><i class="fa-solid fa-pen-to-square"></i></button>
                <button onclick="deleteObat('${o.kode}')" class="liquid-btn-danger p-2 rounded-xl text-rose-600"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');

    return `
    <div class="space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 class="text-2xl font-black text-slate-800">Data Stok Obat</h2>
            <button onclick="showToast('Moda tambah obat siap diintegrasikan!', 'info')" class="liquid-btn-primary px-6 py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 self-start md:self-auto">
                <i class="fa-solid fa-plus"></i> Tambah Obat
            </button>
        </div>

        <div class="glass-card p-4 rounded-2xl">
            <input type="text" placeholder="Cari nama obat..." class="w-full p-3 rounded-xl glass-input text-xs font-medium">
        </div>

        <div class="glass-card p-6 rounded-3xl space-y-4">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b border-pink-200/60 text-slate-500 text-[11px] font-black uppercase tracking-wider">
                            <th class="py-3 px-4">Kode Obat</th>
                            <th class="py-3 px-4">Nama Obat</th>
                            <th class="py-3 px-4">Jenis Obat</th>
                            <th class="py-3 px-4">Stok</th>
                            <th class="py-3 px-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}

function deleteObat(kode) {
    let obatList = getStorage('uks_obat', []);
    obatList = obatList.filter(o => o.kode !== kode);
    setStorage('uks_obat', obatList);
    showToast('Obat berhasil dihapus!', 'success');
    navigateTo('stok-obat');
}

// 5. Riwayat Kesehatan Siswa (Cascading Dikosongkan Awalnya)
function renderRiwayatKesehatanPage() {
    return `
    <div class="space-y-6">
        <h2 class="text-2xl font-black text-slate-800">Riwayat Kesehatan Siswa</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-[11px] font-black text-slate-700 mb-1 uppercase tracking-wider">1. Pilih Kelas</label>
                <select id="riwayat-filter-kelas" onchange="handleRiwayatKelasChange(this.value)" class="w-full p-3.5 rounded-2xl glass-input text-xs font-bold">
                    <option value="" disabled selected>-- Pilih Kelas Dulu --</option>
                    <option value="X RPL 1">X RPL 1</option>
                    <option value="X RPL 2">X RPL 2</option>
                    <option value="XI RPL 1">XI RPL 1</option>
                    <option value="XI RPL 2">XI RPL 2</option>
                    <option value="XII RPL">XII RPL</option>
                </select>
            </div>

            <div>
                <label class="block text-[11px] font-black text-slate-700 mb-1 uppercase tracking-wider">2. Pilih Siswa</label>
                <select id="riwayat-filter-siswa" disabled onchange="handleRiwayatSiswaChange(this.value)" class="w-full p-3.5 rounded-2xl glass-input text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                    <option value="" disabled selected>Pilih kelas terlebih dahulu...</option>
                </select>
            </div>
        </div>

        <!-- Card Identitas Siswa Liquid Kosong -->
        <div id="riwayat-card-container">
            <div class="glass-card p-6 rounded-3xl flex items-center gap-5 max-w-md">
                <div class="p-4 bg-white/40 text-slate-400 rounded-2xl border border-white/60">
                    <i class="fa-solid fa-user-graduate text-3xl"></i>
                </div>
                <div class="text-xs space-y-1">
                    <p class="text-slate-500 font-semibold">NIS : <span class="text-slate-400 italic">-</span></p>
                    <p class="text-slate-500 font-semibold">Nama : <span class="text-slate-400 italic">Pilih siswa untuk melihat data</span></p>
                    <p class="text-slate-500 font-semibold">Kelas : <span class="text-slate-400 italic">-</span></p>
                </div>
            </div>
        </div>

        <!-- Tabel Riwayat Medis Liquid Kosong -->
        <div class="glass-card p-6 rounded-3xl overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="border-b border-pink-200/60 text-slate-500 text-[11px] font-black uppercase tracking-wider">
                        <th class="py-3 px-4">Tanggal</th>
                        <th class="py-3 px-4">Keluhan</th>
                        <th class="py-3 px-4">Tindakan</th>
                        <th class="py-3 px-4">Obat</th>
                        <th class="py-3 px-4">Status</th>
                    </tr>
                </thead>
                <tbody id="riwayat-table-body">
                    <tr>
                        <td colspan="5" class="text-center py-10 text-xs text-slate-400 font-medium italic">
                            Silakan pilih Kelas dan Siswa terlebih dahulu untuk melihat riwayat rekam medis.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>`;
}

function handleRiwayatKelasChange(selectedKelas) {
    const siswaList = getStorage('uks_siswa', []);
    const filteredSiswa = siswaList.filter(s => s.kelas === selectedKelas);
    const siswaSelect = document.getElementById('riwayat-filter-siswa');
    const tableBody = document.getElementById('riwayat-table-body');
    const cardContainer = document.getElementById('riwayat-card-container');

    if (!siswaSelect) return;

    siswaSelect.disabled = false;
    siswaSelect.innerHTML = '<option value="" disabled selected>-- Pilih Siswa --</option>' + 
        filteredSiswa.map(s => `<option value="${s.nis}">${s.nama} (${s.nis})</option>`).join('');

    cardContainer.innerHTML = `
        <div class="glass-card p-6 rounded-3xl flex items-center gap-5 max-w-md">
            <div class="p-4 liquid-badge text-white rounded-2xl">
                <i class="fa-solid fa-user-graduate text-3xl"></i>
            </div>
            <div class="text-xs space-y-1">
                <p class="text-slate-500 font-semibold">NIS : <span class="text-slate-400 italic">-</span></p>
                <p class="text-slate-500 font-semibold">Nama : <span class="text-slate-400 italic">Silakan pilih siswa</span></p>
                <p class="text-slate-500 font-semibold">Kelas : <span class="text-slate-800 font-black">${selectedKelas}</span></p>
            </div>
        </div>`;

    tableBody.innerHTML = `
        <tr>
            <td colspan="5" class="text-center py-10 text-xs text-slate-400 font-medium italic">
                Silakan pilih nama siswa di kelas ${selectedKelas} untuk menampilkan riwayat medis.
            </td>
        </tr>`;
}

function handleRiwayatSiswaChange(selectedNis) {
    const siswaList = getStorage('uks_siswa', []);
    const rekamMedisList = getStorage('uks_rekam_medis', []);

    const targetSiswa = siswaList.find(s => s.nis === selectedNis);
    if (!targetSiswa) return;

    const filteredRekamMedis = rekamMedisList.filter(r => r.nis === selectedNis);

    const cardContainer = document.getElementById('riwayat-card-container');
    cardContainer.innerHTML = `
        <div class="glass-card p-6 rounded-3xl flex items-center gap-5 max-w-md">
            <div class="p-4 liquid-badge text-white rounded-2xl">
                <i class="fa-solid fa-user-graduate text-3xl"></i>
            </div>
            <div class="text-xs space-y-1">
                <p class="text-slate-500 font-semibold">NIS : <span class="text-slate-800 font-black">${targetSiswa.nis}</span></p>
                <p class="text-slate-500 font-semibold">Nama : <span class="text-slate-800 font-black">${targetSiswa.nama}</span></p>
                <p class="text-slate-500 font-semibold">Kelas : <span class="text-slate-800 font-black">${targetSiswa.kelas}</span></p>
            </div>
        </div>`;

    const tableBody = document.getElementById('riwayat-table-body');
    if (filteredRekamMedis.length > 0) {
        tableBody.innerHTML = filteredRekamMedis.map(item => `
            <tr class="border-b border-pink-100/50 hover:bg-white/30 transition">
                <td class="py-3.5 px-4 text-xs font-medium text-slate-600">${item.tanggal}</td>
                <td class="py-3.5 px-4 text-xs font-medium text-slate-800">${item.keluhan}</td>
                <td class="py-3.5 px-4 text-xs font-medium text-slate-800">${item.tindakan}</td>
                <td class="py-3.5 px-4 text-xs font-medium text-slate-800">${item.obat || '-'}</td>
                <td class="py-3.5 px-4 text-xs">${getStatusBadge(item.status)}</td>
            </tr>
        `).join('');
    } else {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-10 text-xs text-slate-400 font-medium italic">
                    Belum ada riwayat rekam medis tercatat untuk ${targetSiswa.nama}.
                </td>
            </tr>`;
    }
}

// Badge Status Helpers
function getStatusBadge(status) {
    switch (status) {
        case 'Kembali ke Kelas':
            return `<span class="px-3 py-1 text-[10px] font-black rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300/50">Kembali ke Kelas</span>`;
        case 'Diizinkan Pulang':
            return `<span class="px-3 py-1 text-[10px] font-black rounded-full bg-amber-100 text-amber-700 border border-amber-300/50">Diizinkan Pulang</span>`;
        case 'Rujukan RS':
            return `<span class="px-3 py-1 text-[10px] font-black rounded-full bg-rose-100 text-rose-700 border border-rose-300/50">Rujukan RS</span>`;
        default:
            return `<span class="px-3 py-1 text-[10px] font-black rounded-full bg-slate-100 text-slate-700">${status}</span>`;
    }
}

// Notification Toast Utility (iOS Style Banner Alert)
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toast-icon');
    const toastMessage = document.getElementById('toast-message');

    if (!toast) return;

    toastMessage.textContent = message;

    if (type === 'success') {
        toastIcon.innerHTML = '<i class="fa-solid fa-circle-check text-emerald-500"></i>';
    } else if (type === 'error') {
        toastIcon.innerHTML = '<i class="fa-solid fa-circle-xmark text-rose-500"></i>';
    } else {
        toastIcon.innerHTML = '<i class="fa-solid fa-circle-info text-pink-500"></i>';
    }

    toast.classList.remove('translate-y-[-180%]', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.add('translate-y-[-180%]', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3200);
}

// Inisialisasi Aplikasi
document.addEventListener('DOMContentLoaded', () => {
    const activeUser = getStorage('uks_active_user', null);
    if (activeUser) {
        navigateTo('dashboard');
    } else {
        navigateTo('auth');
    }
});