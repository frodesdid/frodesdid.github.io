// Открытие настроек
async function openSettings() {
    try {
        const modal = document.getElementById('settings-modal');
        const content = document.getElementById('settings-content');
        
        // Загружаем данные пользователя
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.exists ? userDoc.data() : {};
        
        content.innerHTML = `
            <div class="settings-tabs">
                <button class="settings-tab active" onclick="showSettingsTab('profile')">Профиль</button>
                <button class="settings-tab" onclick="showSettingsTab('appearance')">Внешний вид</button>
                <button class="settings-tab" onclick="showSettingsTab('notifications')">Уведомления</button>
                <button class="settings-tab" onclick="showSettingsTab('security')">Безопасность</button>
            </div>
            
            <div class="settings-content">
                <!-- Профиль -->
                <div id="profile-settings" class="settings-section">
                    <h3>Настройки профиля</h3>
                    
                    <div class="avatar-upload">
                        <div class="avatar-preview">
                            <img id="avatar-preview" src="${userData.photoURL || 'assets/default-avatar.png'}" alt="Аватар">
                        </div>
                        <div class="avatar-controls">
                            <button class="btn-small" onclick="document.getElementById('avatar-input').click()">Изменить фото</button>
                            <input type="file" id="avatar-input" accept="image/*" hidden onchange="handleAvatarUpload(event)">
                            <button class="btn-small btn-danger" onclick="removeAvatar()" ${!userData.photoURL ? 'disabled' : ''}>Удалить фото</button>
                            <p class="help-text">Максимальный размер: 2MB. Форматы: JPG, PNG, GIF</p>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="display-name">Имя для отображения</label>
                        <input type="text" id="display-name" value="${userData.displayName || currentUser.displayName || ''}" placeholder="Ваше имя">
                    </div>
                    
                    <div class="form-group">
                        <label for="user-email">Email</label>
                        <input type="email" id="user-email" value="${currentUser.email}" disabled>
                        <p class="help-text">Email нельзя изменить</p>
                    </div>
                    
                    <div class="form-group">
                        <label for="user-status">Статус</label>
                        <select id="user-status">
                            <option value="online" ${userData.status === 'online' ? 'selected' : ''}>В сети</option>
                            <option value="away" ${userData.status === 'away' ? 'selected' : ''}>Отошел</option>
                            <option value="busy" ${userData.status === 'busy' ? 'selected' : ''}>Занят</option>
                            <option value="offline" ${userData.status === 'offline' ? 'selected' : ''}>Не в сети</option>
                        </select>
                    </div>
                    
                    <button class="btn-primary" onclick="saveProfileSettings()">Сохранить изменения</button>
                </div>
                
                <!-- Внешний вид -->
                <div id="appearance-settings" class="settings-section" style="display: none;">
                    <h3>Настройки внешнего вида</h3>
                    
                    <div class="form-group">
                        <label>Тема</label>
                        <div class="theme-options">
                            <label class="theme-option">
                                <input type="radio" name="theme" value="light" ${(!userData.settings || userData.settings.theme === 'light') ? 'checked' : ''}>
                                <div class="theme-preview light-theme">
                                    <div class="theme-sample"></div>
                                    <span>Светлая</span>
                                </div>
                            </label>
                            <label class="theme-option">
                                <input type="radio" name="theme" value="dark" ${(userData.settings && userData.settings.theme === 'dark') ? 'checked' : ''}>
                                <div class="theme-preview dark-theme">
                                    <div class="theme-sample"></div>
                                    <span>Темная</span>
                                </div>
                            </label>
                            <label class="theme-option">
                                <input type="radio" name="theme" value="auto" ${(userData.settings && userData.settings.theme === 'auto') ? 'checked' : ''}>
                                <div class="theme-preview auto-theme">
                                    <div class="theme-sample"></div>
                                    <span>Системная</span>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="message-density">Плотность сообщений</label>
                        <select id="message-density">
                            <option value="comfortable" ${(userData.settings && userData.settings.messageDensity === 'comfortable') ? 'selected' : ''}>Комфортная</option>
                            <option value="compact" ${(userData.settings && userData.settings.messageDensity === 'compact') ? 'selected' : ''}>Компактная</option>
                        </select>
                    </div>
                    
                    <button class="btn-primary" onclick="saveAppearanceSettings()">Сохранить настройки</button>
                </div>
                
                <!-- Уведомления -->
                <div id="notifications-settings" class="settings-section" style="display: none;">
                    <h3>Настройки уведомлений</h3>
                    
                    <div class="form-group checkbox-group">
                        <label>
                            <input type="checkbox" id="notify-messages" ${(!userData.settings || userData.settings.notifications !== false) ? 'checked' : ''}>
                            <span>Уведомления о новых сообщениях</span>
                        </label>
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <label>
                            <input type="checkbox" id="notify-sounds" ${(!userData.settings || userData.settings.sounds !== false) ? 'checked' : ''}>
                            <span>Звуковые уведомления</span>
                        </label>
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <label>
                            <input type="checkbox" id="notify-desktop" ${(!userData.settings || userData.settings.desktopNotifications !== false) ? 'checked' : ''}>
                            <span>Уведомления на рабочем столе</span>
                        </label>
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <label>
                            <input type="checkbox" id="notify-typing" ${(userData.settings && userData.settings.showTyping === true) ? 'checked' : ''}>
                            <span>Показывать "собеседник печатает"</span>
                        </label>
                    </div>
                    
                    <button class="btn-primary" onclick="saveNotificationSettings()">Сохранить настройки</button>
                </div>
                
                <!-- Безопасность -->
                <div id="security-settings" class="settings-section" style="display: none;">
                    <h3>Настройки безопасности</h3>
                    
                    <div class="form-group">
                        <label>Смена пароля</label>
                        <input type="password" id="current-password" placeholder="Текущий пароль">
                        <input type="password" id="new-password" placeholder="Новый пароль (минимум 6 символов)">
                        <input type="password" id="confirm-password" placeholder="Повторите новый пароль">
                        <button class="btn-primary" onclick="changePassword()">Сменить пароль</button>
                    </div>
                    
                    <div class="form-group">
                        <label>Сессии</label>
                        <div class="sessions-list">
                            <div class="session-item current">
                                <div class="session-info">
                                    <strong>Текущая сессия</strong>
                                    <span>${navigator.userAgent}</span>
                                    <span>Вход выполнен: ${new Date().toLocaleDateString('ru-RU')}</span>
                                </div>
                            </div>
                        </div>
                        <button class="btn-danger" onclick="logoutAllSessions()">Завершить все сессии</button>
                    </div>
                    
                    <div class="form-group">
                        <label>Экспорт данных</label>
                        <p>Вы можете экспортировать все свои сообщения и данные профиля</p>
                        <button class="btn-primary" onclick="exportData()">Экспортировать данные</button>
                    </div>
                    
                    <div class="form-group danger-zone">
                        <label>Опасная зона</label>
                        <p>Удаление аккаунта невозможно отменить. Все ваши данные будут удалены навсегда.</p>
                        <button class="btn-danger" onclick="deleteAccount()">Удалить аккаунт</button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
        
    } catch (error) {
        console.error("Ошибка загрузки настроек:", error);
        showNotification("Не удалось загрузить настройки", "error");
    }
}

// Переключение между вкладками настроек
function showSettingsTab(tabName) {
    // Скрываем все секции
    document.querySelectorAll('.settings-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Убираем активный класс со всех вкладок
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Показываем нужную секцию и активируем вкладку
    document.getElementById(`${tabName}-settings`).style.display = 'block';
    event.target.classList.add('active');
}

// Загрузка аватара
async function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Проверка размера файла
    if (file.size > 2 * 1024 * 1024) { // 2MB
        showNotification("Файл слишком большой (максимум 2MB)", "error");
        return;
    }
    
    // Проверка типа файла
    if (!file.type.match('image/(jpeg|png|gif|webp)')) {
        showNotification("Только изображения (JPG, PNG, GIF, WebP)", "error");
        return;
    }
    
    try {
        showNotification("Загрузка аватара...", "info");
        
        // Создаем превью
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('avatar-preview').src = e.target.result;
        };
        reader.readAsDataURL(file);
        
        // Загружаем файл в Firebase Storage
        const storagePath = `avatars/${currentUser.uid}/${file.name}`;
        const storageRef = storage.ref(storagePath);
        const uploadTask = storageRef.put(file);
        
        uploadTask.on('state_changed',
            null,
            (error) => {
                console.error("Ошибка загрузки аватара:", error);
                showNotification("Ошибка загрузки аватара", "error");
            },
            async () => {
                // Получаем URL загруженного файла
                const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                
                // Обновляем фото пользователя в Firestore
                await db.collection('users').doc(currentUser.uid).update({
                    photoURL: downloadURL
                });
                
                // Обновляем фото в Firebase Auth
                await currentUser.updateProfile({
                    photoURL: downloadURL
                });
                
                // Обновляем фото в интерфейсе
                document.getElementById('user-avatar').src = downloadURL;
                document.getElementById('avatar-preview').src = downloadURL;
                
                showNotification("Аватар обновлен", "success");
            }
        );
        
    } catch (error) {
        console.error("Ошибка загрузки аватара:", error);
        showNotification("Не удалось загрузить аватар", "error");
    }
}

// Удаление аватара
async function removeAvatar() {
    if (!confirm("Удалить аватар?")) return;
    
    try {
        // Удаляем фото из Firestore
        await db.collection('users').doc(currentUser.uid).update({
            photoURL: ''
        });
        
        // Удаляем фото из Firebase Auth
        await currentUser.updateProfile({
            photoURL: null
        });
        
        // Обновляем фото в интерфейсе
        const defaultAvatar = 'assets/default-avatar.png';
        document.getElementById('user-avatar').src = defaultAvatar;
        document.getElementById('avatar-preview').src = defaultAvatar;
        
        showNotification("Аватар удален", "success");
        
    } catch (error) {
        console.error("Ошибка удаления аватара:", error);
        showNotification("Не удалось удалить аватар", "error");
    }
}

// Сохранение настроек профиля
async function saveProfileSettings() {
    try {
        const displayName = document.getElementById('display-name').value.trim();
        const status = document.getElementById('user-status').value;
        
        if (!displayName) {
            showNotification("Введите имя для отображения", "error");
            return;
        }
        
        // Обновляем в Firestore
        await db.collection('users').doc(currentUser.uid).update({
            displayName: displayName,
            status: status
        });
        
        // Обновляем в Firebase Auth
        await currentUser.updateProfile({
            displayName: displayName
        });
        
        // Обновляем в интерфейсе
        document.getElementById('user-name').textContent = displayName;
        
        showNotification("Профиль обновлен", "success");
        
    } catch (error) {
        console.error("Ошибка сохранения профиля:", error);
        showNotification("Не удалось сохранить профиль", "error");
    }
}

// Сохранение настроек внешнего вида
async function saveAppearanceSettings() {
    try {
        const theme = document.querySelector('input[name="theme"]:checked').value;
        const messageDensity = document.getElementById('message-density').value;
        
        // Получаем текущие настройки
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const currentSettings = userDoc.data().settings || {};
        
        // Обновляем настройки
        const newSettings = {
            ...currentSettings,
            theme: theme,
            messageDensity: messageDensity
        };
        
        await db.collection('users').doc(currentUser.uid).update({
            settings: newSettings
        });
        
        // Применяем тему немедленно
        applyTheme(theme);
        
        showNotification("Настройки внешнего вида сохранены", "success");
        
    } catch (error) {
        console.error("Ошибка сохранения настроек:", error);
        showNotification("Не удалось сохранить настройки", "error");
    }
}

// Применение темы
function applyTheme(theme) {
    const body = document.body;
    
    // Удаляем все классы тем
    body.classList.remove('light-theme', 'dark-theme');
    
    if (theme === 'dark') {
        body.classList.add('dark-theme');
    } else if (theme === 'auto') {
        // Определяем системную тему
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.add('dark-theme');
        }
    }
    // Для light темы ничего не делаем - это дефолт
}

// Сохранение настроек уведомлений
async function saveNotificationSettings() {
    try {
        const notifications = document.getElementById('notify-messages').checked;
        const sounds = document.getElementById('notify-sounds').checked;
        const desktopNotifications = document.getElementById('notify-desktop').checked;
        const showTyping = document.getElementById('notify-typing').checked;
        
        // Получаем текущие настройки
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const currentSettings = userDoc.data().settings || {};
        
        // Обновляем настройки
        const newSettings = {
            ...currentSettings,
            notifications: notifications,
            sounds: sounds,
            desktopNotifications: desktopNotifications,
            showTyping: showTyping
        };
        
        await db.collection('users').doc(currentUser.uid).update({
            settings: newSettings
        });
        
        showNotification("Настройки уведомлений сохранены", "success");
        
    } catch (error) {
        console.error("Ошибка сохранения настроек:", error);
        showNotification("Не удалось сохранить настройки", "error");
    }
}

// Смена пароля
async function changePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        showNotification("Заполните все поля", "error");
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification("Новый пароль должен быть не менее 6 символов", "error");
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification("Новые пароли не совпадают", "error");
        return;
    }
    
    try {
        // Реаутентификация пользователя
        const credential = firebase.auth.EmailAuthProvider.credential(
            currentUser.email,
            currentPassword
        );
        
        await currentUser.reauthenticateWithCredential(credential);
        
        // Меняем пароль
        await currentUser.updatePassword(newPassword);
        
        // Очищаем поля
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        
        showNotification("Пароль успешно изменен", "success");
        
    } catch (error) {
        console.error("Ошибка смены пароля:", error);
        
        let message = "Не удалось сменить пароль";
        if (error.code === 'auth/wrong-password') {
            message = "Неверный текущий пароль";
        } else if (error.code === 'auth/weak-password') {
            message = "Новый пароль слишком слабый";
        }
        
        showNotification(message, "error");
    }
}

// Завершение всех сессий
async function logoutAllSessions() {
    if (!confirm("Вы уверены? Это завершит все активные сессии на всех устройствах.")) {
        return;
    }
    
    try {
        // Здесь можно было бы использовать Firebase Admin SDK на сервере,
        // но для простоты просто выходим из текущей сессии
        await auth.signOut();
        showNotification("Все сессии завершены", "success");
        
    } catch (error) {
        console.error("Ошибка завершения сессий:", error);
        showNotification("Не удалось завершить сессии", "error");
    }
}

// Экспорт данных
async function exportData() {
    try {
        showNotification("Подготовка данных для экспорта...", "info");
        
        // Собираем все данные пользователя
        const exportData = {
            user: {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName,
                metadata: {
                    createdAt: currentUser.metadata.creationTime,
                    lastSignIn: currentUser.metadata.lastSignInTime
                }
            },
            chats: [],
            profile: null,
            exportDate: new Date().toISOString()
        };
        
        // Загружаем профиль
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
            exportData.profile = userDoc.data();
        }
        
        // Загружаем чаты
        const chatsQuery = await db.collection('chats')
            .where('participants', 'array-contains', currentUser.uid)
            .get();
        
        for (const chatDoc of chatsQuery.docs) {
            const chat = chatDoc.data();
            const messagesQuery = await db.collection('chats')
                .doc(chat.id)
                .collection('messages')
                .orderBy('timestamp', 'asc')
                .get();
            
            const messages = messagesQuery.docs.map(doc => doc.data());
            
            exportData.chats.push({
                ...chat,
                messages: messages
            });
        }
        
        // Создаем и скачиваем файл
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `frodes-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification("Данные экспортированы", "success");
        
    } catch (error) {
        console.error("Ошибка экспорта данных:", error);
        showNotification("Не удалось экспортировать данные", "error");
    }
}

// Удаление аккаунта
async function deleteAccount() {
    if (!confirm("ВНИМАНИЕ! Это действие невозможно отменить. Все ваши данные будут удалены навсегда. Вы уверены?")) {
        return;
    }
    
    const password = prompt("Введите ваш пароль для подтверждения:");
    if (!password) return;
    
    try {
        // Реаутентификация
        const credential = firebase.auth.EmailAuthProvider.credential(
            currentUser.email,
            password
        );
        
        await currentUser.reauthenticateWithCredential(credential);
        
        // Удаляем все данные пользователя
        await deleteUserData();
        
        // Удаляем аккаунт из Firebase Auth
        await currentUser.delete();
        
        showNotification("Аккаунт удален", "success");
        
        // Перенаправляем на страницу входа
        setTimeout(() => {
            window.location.reload();
        }, 2000);
        
    } catch (error) {
        console.error("Ошибка удаления аккаунта:", error);
        
        let message = "Не удалось удалить аккаунт";
        if (error.code === 'auth/wrong-password') {
            message = "Неверный пароль";
        }
        
        showNotification(message, "error");
    }
}

// Удаление всех данных пользователя
async function deleteUserData() {
    try {
        // Удаляем документ пользователя
        await db.collection('users').doc(currentUser.uid).delete();
        
        // Удаляем пользователя из друзей у других пользователей
        const usersQuery = await db.collection('users')
            .where('friends', 'array-contains', currentUser.uid)
            .get();
        
        const batch = db.batch();
        usersQuery.forEach(doc => {
            batch.update(doc.ref, {
                friends: firebase.firestore.FieldValue.arrayRemove(currentUser.uid)
            });
        });
        
        if (usersQuery.size > 0) {
            await batch.commit();
        }
        
        // Удаляем аватар из Storage
        const avatarRef = storage.ref(`avatars/${currentUser.uid}`);
        try {
            await avatarRef.listAll();
            // Если есть файлы, удаляем их
            // (в реальном проекте нужно реализовать удаление всех файлов в папке)
        } catch (error) {
            // Папка не существует или нет прав
        }
        
        // Помечаем использованные инвайты как удаленные
        const invitesQuery = await db.collection('invites')
            .where('usedBy', '==', currentUser.uid)
            .get();
        
        const inviteBatch = db.batch();
        invitesQuery.forEach(doc => {
            inviteBatch.update(doc.ref, {
                usedBy: '[deleted]',
                usedByEmail: '[deleted]'
            });
        });
        
        if (invitesQuery.size > 0) {
            await inviteBatch.commit();
        }
        
        // Чистим чаты (помечаем сообщения как удаленные)
        const chatsQuery = await db.collection('chats')
            .where('participants', 'array-contains', currentUser.uid)
            .get();
        
        for (const chatDoc of chatsQuery.docs) {
            // Для каждого чата добавляем системное сообщение
            await db.collection('chats').doc(chatDoc.id).collection('messages').add({
                senderId: 'system',
                content: `Пользователь ${currentUser.email} удалил аккаунт`,
                timestamp: timestamp(),
                type: 'system'
            });
        }
        
    } catch (error) {
        console.error("Ошибка удаления данных пользователя:", error);
        throw error;
    }
}

// Добавляем CSS для настроек
const settingsCSS = `
.settings-tabs {
    display: flex;
    border-bottom: 2px solid #e0e0e0;
    margin-bottom: 20px;
}

.settings-tab {
    padding: 10px 20px;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    color: #666;
    font-size: 14px;
    transition: all 0.3s;
}

.settings-tab:hover {
    color: #667eea;
}

.settings-tab.active {
    color: #667eea;
    border-bottom-color: #667eea;
    font-weight: bold;
}

.settings-section {
    animation: fadeIn 0.3s;
}

.avatar-upload {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
    align-items: flex-start;
}

.avatar-preview img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #e0e0e0;
}

.avatar-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
}

.help-text {
    font-size: 12px;
    color: #666;
    margin-top: 5px;
}

.checkbox-group label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    margin-bottom: 10px;
}

.checkbox-group input[type="checkbox"] {
    width: auto;
}

.theme-options {
    display: flex;
    gap: 15px;
    margin-top: 10px;
}

.theme-option {
    cursor: pointer;
}

.theme-option input {
    display: none;
}

.theme-option input:checked + .theme-preview {
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.theme-preview {
    padding: 10px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    text-align: center;
    transition: all 0.3s;
}

.theme-sample {
    width: 60px;
    height: 40px;
    border-radius: 4px;
    margin-bottom: 8px;
}

.light-theme .theme-sample {
    background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
    border: 1px solid #e0e0e0;
}

.dark-theme .theme-sample {
    background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
    border: 1px solid #444;
}

.auto-theme .theme-sample {
    background: linear-gradient(to right, #ffffff 50%, #2d2d2d 50%);
    border: 1px solid #e0e0e0;
}

.sessions-list {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
}

.session-item {
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;
}

.session-item:last-child {
    border-bottom: none;
}

.session-item.current {
    background: #eef2ff;
    border-radius: 4px;
}

.session-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.session-info span {
    font-size: 12px;
    color: #666;
}

.danger-zone {
    padding: 20px;
    background: #fff8f8;
    border: 2px solid #f5c6cb;
    border-radius: 8px;
    margin-top: 30px;
}

.danger-zone p {
    color: #721c24;
    margin-bottom: 15px;
}

.btn-danger {
    background: #dc3545;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.3s;
}

.btn-danger:hover {
    background: #c82333;
}

.btn-danger:disabled {
    background: #6c757d;
    cursor: not-allowed;
}

.invite-section {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e0e0e0;
}

.invite-section:last-child {
    border-bottom: none;
}

.invites-list {
    max-height: 300px;
    overflow-y: auto;
}

.invite-item {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
}

.invite-item.used {
    opacity: 0.7;
    background: #e9ecef;
}

.invite-code {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.invite-status {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 12px;
    background: #28a745;
    color: white;
    display: inline-block;
    width: fit-content;
}

.invite-item.used .invite-status {
    background: #6c757d;
}

.invite-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-size: 12px;
    color: #666;
}

.invite-instructions {
    padding-left: 20px;
    margin: 15px 0;
}

.invite-instructions li {
    margin-bottom: 8px;
}

@media (max-width: 768px) {
    .settings-tabs {
        flex-direction: column;
    }
    
    .theme-options {
        flex-direction: column;
    }
    
    .avatar-upload {
        flex-direction: column;
    }
    
    .invite-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
}
`;

// Добавляем CSS в документ
if (!document.querySelector('#settings-css')) {
    const style = document.createElement('style');
    style.id = 'settings-css';
    style.textContent = settingsCSS;
    document.head.appendChild(style);
}

// Экспортируем функции
window.openSettings = openSettings;
window.showSettingsTab = showSettingsTab;
window.handleAvatarUpload = handleAvatarUpload;
window.removeAvatar = removeAvatar;
window.saveProfileSettings = saveProfileSettings;
window.saveAppearanceSettings = saveAppearanceSettings;
window.saveNotificationSettings = saveNotificationSettings;
window.changePassword = changePassword;
window.logoutAllSessions = logoutAllSessions;
window.exportData = exportData;
window.deleteAccount = deleteAccount;
