// Глобальные переменные
let currentUser = null;
let currentChatId = null;
let unsubscribeFunctions = {};
let activeRightPanel = null;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', async () => {
    // Ждем аутентификацию
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            await initApp();
        } else {
            console.log("Пользователь не авторизован");
        }
    });
});

// Инициализация приложения после входа
async function initApp() {
    console.log("Инициализация приложения для:", currentUser.email);
    
    // Обновляем статус пользователя
    await updateUserStatus('online');
    
    // Загружаем данные пользователя
    await loadUserProfile();
    
    // Загружаем друзей
    await loadFriends();
    
    // Загружаем чаты
    await loadChats();
    
    // Настраиваем слушатели
    setupEventListeners();
    
    // Подписываемся на изменения статуса друзей
    subscribeToFriendsUpdates();
    
    // Настраиваем авто-выход при закрытии вкладки
    setupWindowListeners();
    
    // Показываем приветственное сообщение
    showNotification(`Добро пожаловать, ${currentUser.displayName || 'друг'}!`, 'success');
}

// Загрузка профиля пользователя
async function loadUserProfile() {
    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            
            // Обновляем UI
            document.getElementById('user-name').textContent = userData.displayName || currentUser.email;
            document.getElementById('user-email').textContent = currentUser.email;
            
            // Аватар
            if (userData.photoURL) {
                document.getElementById('user-avatar').src = userData.photoURL;
            }
            
            // Статус
            const statusEl = document.getElementById('user-status');
            statusEl.className = `online-status ${userData.status || 'online'}`;
            
            // Применяем тему
            if (userData.settings?.theme === 'dark') {
                document.body.classList.add('dark-theme');
            }
            
        } else {
            console.error("Документ пользователя не найден!");
        }
    } catch (error) {
        console.error("Ошибка загрузки профиля:", error);
    }
}

// Загрузка списка друзей
async function loadFriends() {
    const friendsList = document.getElementById('friends-list');
    friendsList.innerHTML = '<div class="loading">Загрузка друзей...</div>';
    
    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();
        const friendIds = userData.friends || [];
        
        if (friendIds.length === 0) {
            friendsList.innerHTML = '<div class="empty-state">Пока нет друзей</div>';
            return;
        }
        
        // Получаем данные всех друзей
        const friendsPromises = friendIds.map(friendId => 
            db.collection('users').doc(friendId).get()
        );
        
        const friendDocs = await Promise.all(friendsPromises);
        
        // Очищаем список
        friendsList.innerHTML = '';
        
        // Добавляем друзей в список
        friendDocs.forEach(doc => {
            if (doc.exists) {
                const friend = doc.data();
                const friendElement = createFriendElement(friend);
                friendsList.appendChild(friendElement);
            }
        });
        
    } catch (error) {
        console.error("Ошибка загрузки друзей:", error);
        friendsList.innerHTML = '<div class="error">Ошибка загрузки друзей</div>';
    }
}

// Создание элемента друга
function createFriendElement(friend) {
    const div = document.createElement('div');
    div.className = 'friend-item';
    div.dataset.userId = friend.uid;
    
    const statusClass = friend.status || 'offline';
    const statusText = getStatusText(friend.status);
    
    div.innerHTML = `
        <img src="${friend.photoURL || 'assets/default-avatar.png'}" alt="${friend.displayName}" class="friend-avatar">
        <div class="friend-info">
            <h4 class="friend-name">${friend.displayName}</h4>
            <p class="friend-status ${statusClass}">${statusText}</p>
        </div>
        <button class="btn-icon chat-with-friend" onclick="startChatWith('${friend.uid}')" title="Написать сообщение">💬</button>
    `;
    
    // При клике на друга открываем чат
    div.addEventListener('click', (e) => {
        if (!e.target.classList.contains('btn-icon')) {
            startChatWith(friend.uid);
        }
    });
    
    return div;
}

// Загрузка чатов
async function loadChats() {
    const chatsList = document.getElementById('chats-list');
    chatsList.innerHTML = '<div class="loading">Загрузка чатов...</div>';
    
    try {
        // Получаем чаты, где пользователь является участником
        const chatsQuery = await db.collection('chats')
            .where('participants', 'array-contains', currentUser.uid)
            .orderBy('lastMessage.timestamp', 'desc')
            .get();
        
        if (chatsQuery.empty) {
            chatsList.innerHTML = '<div class="empty-state">Нет активных чатов</div>';
            return;
        }
        
        chatsList.innerHTML = '';
        
        chatsQuery.forEach(doc => {
            const chat = doc.data();
            const chatElement = createChatElement(chat);
            chatsList.appendChild(chatElement);
        });
        
    } catch (error) {
        console.error("Ошибка загрузки чатов:", error);
        chatsList.innerHTML = '<div class="error">Ошибка загрузки чатов</div>';
    }
}

// Создание элемента чата
function createChatElement(chat) {
    const div = document.createElement('div');
    div.className = 'chat-item';
    div.dataset.chatId = chat.id;
    
    // Находим собеседника
    const otherUserId = chat.participants.find(id => id !== currentUser.uid);
    
    // Временно: позже добавим кэш пользователей
    const partnerName = "Загрузка...";
    const lastMessage = chat.lastMessage?.content || "Нет сообщений";
    const time = chat.lastMessage?.timestamp ? formatTime(chat.lastMessage.timestamp.toDate()) : '';
    const unreadCount = chat.unreadCount?.[currentUser.uid] || 0;
    
    div.innerHTML = `
        <img src="assets/default-avatar.png" alt="" class="chat-avatar">
        <div class="chat-info">
            <h4 class="chat-name">${partnerName}</h4>
            <p class="chat-last-message">${lastMessage}</p>
            <p class="chat-time">${time}</p>
        </div>
        ${unreadCount > 0 ? `<span class="unread-badge">${unreadCount}</span>` : ''}
    `;
    
    // При клике на чат
    div.addEventListener('click', () => openChat(chat.id));
    
    // Загружаем информацию о собеседнике асинхронно
    loadChatPartnerInfo(otherUserId, div);
    
    return div;
}

// Загрузка информации о собеседнике в чате
async function loadChatPartnerInfo(userId, chatElement) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
            const user = userDoc.data();
            const avatar = chatElement.querySelector('.chat-avatar');
            const name = chatElement.querySelector('.chat-name');
            
            avatar.src = user.photoURL || 'assets/default-avatar.png';
            avatar.alt = user.displayName;
            name.textContent = user.displayName;
        }
    } catch (error) {
        console.error("Ошибка загрузки информации о пользователе:", error);
    }
}

// Настройка слушателей событий
function setupEventListeners() {
    // Поиск
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Отправка сообщения по Enter (без Shift)
    const messageInput = document.getElementById('message-input');
    messageInput.addEventListener('keydown', handleKeyDown);
}

// Обработка поиска
async function handleSearch(event) {
    const query = event.target.value.trim().toLowerCase();
    
    if (query.length < 2) {
        // Показываем все чаты при пустом поиске
        loadChats();
        loadFriends();
        return;
    }
    
    // Фильтруем чаты
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(item => {
        const name = item.querySelector('.chat-name').textContent.toLowerCase();
        item.style.display = name.includes(query) ? 'flex' : 'none';
    });
    
    // Фильтруем друзей
    const friendItems = document.querySelectorAll('.friend-item');
    friendItems.forEach(item => {
        const name = item.querySelector('.friend-name').textContent.toLowerCase();
        item.style.display = name.includes(query) ? 'flex' : 'none';
    });
}

// Debounce функция
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Утилиты
function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    
    if (diff < 24 * 60 * 60 * 1000) {
        // Сегодня
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
        // На этой неделе
        return date.toLocaleDateString('ru-RU', { weekday: 'short' });
    } else {
        // Ранее
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    }
}

function getStatusText(status) {
    const statusMap = {
        'online': 'В сети',
        'offline': 'Не в сети',
        'away': 'Отошел',
        'busy': 'Занят'
    };
    return statusMap[status] || 'Не в сети';
}

// Функции для работы с окнами
function setupWindowListeners() {
    // Обновляем статус при закрытии вкладки
    window.addEventListener('beforeunload', async () => {
        await updateUserStatus('offline');
    });
    
    // Обновляем статус при потере фокуса
    window.addEventListener('blur', async () => {
        await updateUserStatus('away');
    });
    
    window.addEventListener('focus', async () => {
        await updateUserStatus('online');
    });
}

async function updateUserStatus(status) {
    if (!currentUser) return;
    
    try {
        await db.collection('users').doc(currentUser.uid).update({
            status: status,
            lastSeen: timestamp()
        });
    } catch (error) {
        console.error("Ошибка обновления статуса:", error);
    }
}

// Показ уведомлений
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${getNotificationIcon(type)}</span>
        <span class="notification-message">${message}</span>
        <button class="btn-icon" onclick="this.parentElement.remove()" style="margin-left: auto;">✕</button>
    `;
    
    container.appendChild(notification);
    
    // Автоматическое удаление через 5 секунд
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': '✅',
        'error': '❌',
        'info': 'ℹ️',
        'warning': '⚠️'
    };
    return icons[type] || 'ℹ️';
}

// Экспортируем функции, которые понадобятся в других файлах
window.openChat = openChat;
window.startChatWith = startChatWith;
window.showNotification = showNotification;
window.logout = logout;
