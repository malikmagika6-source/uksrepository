let isRegisterMode = false;

function toggleAuthMode() {
    isRegisterMode = !isRegisterMode;
    const title = document.getElementById('auth-title');
    const submitBtn = document.getElementById('auth-submit-btn');
    const nameGroup = document.getElementById('name-input-group');
    const toggleLink = document.getElementById('auth-toggle-link');

    if (isRegisterMode) {
        title.textContent = 'Daftar Akun Petugas';
        submitBtn.innerHTML = '<span>Register</span> <i class="fa-solid fa-user-plus text-xs"></i>';
        nameGroup.classList.remove('hidden');
        toggleLink.innerHTML = 'Sudah punya akun? <a href="#" onclick="toggleAuthMode()" class="text-pink-600 font-bold hover:underline">Login disini</a>';
    } else {
        title.textContent = 'Masuk ke Akun Anda';
        submitBtn.innerHTML = '<span>Login</span> <i class="fa-solid fa-arrow-right text-xs"></i>';
        nameGroup.classList.add('hidden');
        toggleLink.innerHTML = 'Belum punya akun? <a href="#" onclick="toggleAuthMode()" class="text-pink-600 font-bold hover:underline">Register Akun Baru</a>';
    }
}

function handleAuthSubmit(e) {
    e.preventDefault();
    const usernameInput = document.getElementById('auth-username').value.trim();
    const passwordInput = document.getElementById('auth-password').value;
    const nameInput = document.getElementById('auth-fullname') ? document.getElementById('auth-fullname').value.trim() : '';

    const registeredUsers = getStorage('uks_registered_users', []);

    if (isRegisterMode) {
        if (!usernameInput || !passwordInput || !nameInput) {
            showToast('Lengkapi seluruh data registrasi!', 'error');
            return;
        }

        const userExists = registeredUsers.some(u => u.username.toLowerCase() === usernameInput.toLowerCase());
        if (userExists) {
            showToast('Username sudah terdaftar! Gunakan username lain.', 'error');
            return;
        }

        registeredUsers.push({
            name: nameInput,
            username: usernameInput,
            password: passwordInput
        });

        setStorage('uks_registered_users', registeredUsers);
        showToast('Registrasi berhasil! Silakan Login.', 'success');
        
        toggleAuthMode();
        document.getElementById('auth-username').value = usernameInput;
        document.getElementById('auth-password').value = '';
    } else {
        if (registeredUsers.length === 0) {
            showToast('Belum ada akun terdaftar! Silakan register dulu.', 'error');
            return;
        }

        const validUser = registeredUsers.find(u => u.username.toLowerCase() === usernameInput.toLowerCase() && u.password === passwordInput);

        if (!validUser) {
            showToast('Username atau password salah / Belum terdaftar!', 'error');
            return;
        }

        setStorage('uks_active_user', validUser);
        showToast(`Selamat datang kembali, ${validUser.name}!`, 'success');
        navigateTo('dashboard');
    }
}

function handleLogout() {
    localStorage.removeItem('uks_active_user');
    showToast('Berhasil logout.', 'info');
    navigateTo('auth');
}