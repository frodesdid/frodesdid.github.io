// Переключение форм
function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    clearMessage();
}

function showLogin() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    clearMessage();
}

// Вход
async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showMessage('Заполните все поля', 'error');
        return;
    }
    
    showMessage('Вход...', 'info');
    
    try {
        const result = await auth.signInWithEmailAndPassword(email, password);
        showMessage('Успешный вход!', 'success');
        
        // Переход в мессенджер
        setTimeout(() => {
            window.location.href = 'app.html';
        }, 1000);
        
    } catch (error) {
        showMessage('Ошибка: ' + error.message, 'error');
    }
}

// Регистрация с инвайтом
async function register() {
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const name = document.getElementById('reg-name').value;
    const invite = document.getElementById('reg-invite').value.toUpperCase();
    
    // Проверка
    if (!email || !password || !name || !invite) {
        showMessage('Заполните все поля', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Пароль минимум 6 символов', 'error');
        return;
    }
    
    showMessage('Проверка инвайта...', 'info');
    
    try {
        // 1. Проверяем инвайт
        const invitesRef = db.collection('invites');
        const query = await invitesRef.where('code', '==', invite).get();
        
        if (query.empty) {
            throw new Error('Неверный инвайт-код');
        }
        
        const inviteDoc = query.docs[0];
        const inviteData = inviteDoc.data();
        
        if (inviteData.used) {
            throw new Error('Инвайт уже использован');
        }
        
        // 2. Создаем пользователя
        showMessage('Создание аккаунта...', 'info');
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // 3. Обновляем профиль
        await user.updateProfile({ displayName: name });
        
        // 4. Создаем запись в Firestore
        await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            email: email,
            displayName: name,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'online',
            friends: [inviteData.createdBy || 'admin'],
            photoURL: ''
        });
        
        // 5. Обновляем инвайт
        await inviteDoc.ref.update({
            used: true,
            usedBy: user.uid,
            usedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // 6. Добавляем нового пользователя в друзья создателю
        if (inviteData.createdBy && inviteData.createdBy !== 'admin') {
            await db.collection('users').doc(inviteData.createdBy).update({
                friends: firebase.firestore.FieldValue.arrayUnion(user.uid)
            });
        }
        
        showMessage('Аккаунт создан!', 'success');
        
        // Переход в мессенджер
        setTimeout(() => {
            window.location.href = 'app.html';
        }, 1500);
        
    } catch (error) {
        showMessage('Ошибка: ' + error.message, 'error');
        console.error(error);
    }
}

// Вспомогательные функции
function showMessage(text, type) {
    const el = document.getElementById('message');
    el.textContent = text;
    el.className = 'message ' + type;
}

function clearMessage() {
    const el = document.getElementById('message');
    el.textContent = '';
    el.className = 'message';
}

// Автопереход если уже авторизован
auth.onAuthStateChanged(user => {
    if (user && window.location.pathname.endsWith('index.html')) {
        window.location.href = 'app.html';
    }
});
