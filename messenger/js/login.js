// Переключение между вкладками
function showTab(tabName) {
    // Скрываем все формы
    document.querySelectorAll('.form-container').forEach(form => {
        form.style.display = 'none';
    });
    
    // Убираем активный класс со всех вкладок
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Показываем нужную форму и активируем вкладку
    document.getElementById(`${tabName}-form`).style.display = 'block';
    event.target.classList.add('active');
    
    // Очищаем сообщения
    document.getElementById('message').textContent = '';
}

// Вход пользователя
async function loginUser(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const messageEl = document.getElementById('message');
    
    try {
        messageEl.textContent = "Вход...";
        messageEl.className = "message info";
        
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        
        // Обновляем статус пользователя на "online"
        await db.collection('users').doc(userCredential.user.uid).update({
            status: 'online',
            lastSeen: timestamp()
        });
        
        messageEl.textContent = "Успешный вход!";
        messageEl.className = "message success";
        
        // Приложение загрузится автоматически через auth-state.js
        
    } catch (error) {
        console.error("Ошибка входа:", error);
        messageEl.textContent = getErrorMessage(error.code);
        messageEl.className = "message error";
    }
}

// Регистрация пользователя
async function registerUser(event) {
    event.preventDefault();
    
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const displayName = document.getElementById('reg-displayname').value;
    const inviteCode = document.getElementById('reg-invite').value.toUpperCase();
    const messageEl = document.getElementById('message');
    
    try {
        messageEl.textContent = "Проверка инвайт-кода...";
        messageEl.className = "message info";
        
        // 1. Проверяем инвайт-код
        const inviteQuery = await db.collection('invites')
            .where('code', '==', inviteCode)
            .where('used', '==', false)
            .limit(1)
            .get();
        
        if (inviteQuery.empty) {
            throw new Error('Неверный или уже использованный инвайт-код');
        }
        
        const inviteDoc = inviteQuery.docs[0];
        const inviteData = inviteDoc.data();
        
        // Проверяем срок действия
        if (inviteData.expiresAt && inviteData.expiresAt.toDate() < new Date()) {
            throw new Error('Инвайт-код истек');
        }
        
        // Проверяем лимит использований
        if (inviteData.maxUses <= (inviteData.usedCount || 0)) {
            throw new Error('Инвайт-код уже использован максимальное число раз');
        }
        
        // 2. Создаем пользователя в Firebase Authentication
        messageEl.textContent = "Создание аккаунта...";
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // 3. Обновляем displayName
        await user.updateProfile({
            displayName: displayName
        });
        
        // 4. Создаем документ пользователя в Firestore
        await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            email: email,
            displayName: displayName,
            createdAt: timestamp(),
            status: 'online',
            friends: [inviteData.createdBy], // Добавляем создателя инвайта в друзья
            pendingRequests: [],
            settings: {
                theme: 'light',
                notifications: true,
                sound: true
            },
            photoURL: ''
        });
        
        // 5. Обновляем инвайт
        await inviteDoc.ref.update({
            used: true,
            usedBy: user.uid,
            usedAt: timestamp(),
            usedCount: increment(1)
        });
        
        // 6. Добавляем нового пользователя в друзья к создателю инвайта
        await db.collection('users').doc(inviteData.createdBy).update({
            friends: firebase.firestore.FieldValue.arrayUnion(user.uid)
        });
        
        // 7. Создаем чат между ними
        const chatId = [inviteData.createdBy, user.uid].sort().join('_');
        await db.collection('chats').doc(chatId).set({
            id: chatId,
            participants: [inviteData.createdBy, user.uid],
            createdAt: timestamp(),
            lastMessage: null,
            unreadCount: {
                [inviteData.createdBy]: 0,
                [user.uid]: 0
            }
        });
        
        // 8. Отправляем приветственное сообщение
        await db.collection('chats').doc(chatId).collection('messages').add({
            senderId: 'system',
            content: `${displayName} присоединился к чату через ваш инвайт!`,
            timestamp: timestamp(),
            type: 'system'
        });
        
        messageEl.textContent = "Аккаунт создан! Выполняется вход...";
        messageEl.className = "message success";
        
        // Вход выполнится автоматически
        
    } catch (error) {
        console.error("Ошибка регистрации:", error);
        messageEl.textContent = getErrorMessage(error.code) || error.message;
        messageEl.className = "message error";
    }
}

// Проверка инвайт-кода
async function checkInvite(event) {
    event.preventDefault();
    
    const inviteCode = document.getElementById('invite-code').value.toUpperCase();
    const messageEl = document.getElementById('message');
    
    try {
        messageEl.textContent = "Проверка...";
        messageEl.className = "message info";
        
        const inviteQuery = await db.collection('invites')
            .where('code', '==', inviteCode)
            .where('used', '==', false)
            .limit(1)
            .get();
        
        if (inviteQuery.empty) {
            throw new Error('Инвайт-код не найден или уже использован');
        }
        
        const inviteData = inviteQuery.docs[0].data();
        
        // Проверяем срок действия
        if (inviteData.expiresAt && inviteData.expiresAt.toDate() < new Date()) {
            throw new Error('Инвайт-код истек');
        }
        
        // Если инвайт валидный, переключаем на форму регистрации
        messageEl.textContent = "✅ Инвайт-код действителен! Заполните данные";
        messageEl.className = "message success";
        
        showTab('register');
        document.getElementById('reg-invite').value = inviteCode;
        
    } catch (error) {
        messageEl.textContent = error.message;
        messageEl.className = "message error";
    }
}

// Функция для перевода кодов ошибок Firebase
function getErrorMessage(errorCode) {
    const messages = {
        'auth/user-not-found': 'Пользователь не найден',
        'auth/wrong-password': 'Неверный пароль',
        'auth/email-already-in-use': 'Email уже используется',
        'auth/weak-password': 'Пароль слишком слабый',
        'auth/invalid-email': 'Неверный формат email',
        'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже'
    };
    
    return messages[errorCode] || 'Произошла ошибка';
}
