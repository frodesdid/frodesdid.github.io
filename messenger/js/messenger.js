// Экспортируем функции ГЛОБАЛЬНО
window.openChat = async function(chatId) {
    try {
        currentChatId = chatId;
        
        // Скрываем заглушку, показываем чат
        document.getElementById('chat-placeholder').style.display = 'none';
        document.getElementById('chat-container').style.display = 'flex';
        
        // Находим собеседника
        const chatDoc = await db.collection('chats').doc(chatId).get();
        const chatData = chatDoc.data();
        const otherUserId = chatData.participants.find(id => id !== currentUser.uid);
        
        // Загружаем информацию о собеседнике
        const userDoc = await db.collection('users').doc(otherUserId).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            document.getElementById('chat-partner-name').textContent = userData.displayName;
            document.getElementById('chat-avatar').src = userData.photoURL || 'assets/default-avatar.png';
        }
        
        // Загружаем сообщения
        const messagesQuery = await db.collection('chats')
            .doc(chatId)
            .collection('messages')
            .orderBy('timestamp', 'asc')
            .get();
        
        const container = document.getElementById('messages-container');
        container.innerHTML = '';
        
        messagesQuery.forEach(doc => {
            const message = doc.data();
            const div = document.createElement('div');
            div.className = `message-wrapper ${message.senderId === currentUser.uid ? 'sent' : 'received'}`;
            div.innerHTML = `
                <div class="message-bubble">
                    <p>${message.content}</p>
                    <div class="message-footer">
                        <span class="message-time">${message.timestamp?.toDate().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
        
        // Прокручиваем вниз
        container.scrollTop = container.scrollHeight;
        
        // Фокусируемся на поле ввода
        document.getElementById('message-input').focus();
        
    } catch (error) {
        console.error("Ошибка открытия чата:", error);
        alert("Не удалось открыть чат: " + error.message);
    }
};

// Загрузка информации о чате
async function loadChatInfo(chatId) {
    try {
        const chatDoc = await db.collection('chats').doc(chatId).get();
        if (!chatDoc.exists) {
            throw new Error("Чат не найден");
        }
        
        const chatData = chatDoc.data();
        const otherUserId = chatData.participants.find(id => id !== currentUser.uid);
        
        // Загружаем информацию о собеседнике
        const userDoc = await db.collection('users').doc(otherUserId).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            
            // Обновляем заголовок чата
            document.getElementById('chat-partner-name').textContent = userData.displayName;
            document.getElementById('chat-avatar').src = userData.photoURL || 'assets/default-avatar.png';
            
            // Статус
            const statusEl = document.getElementById('chat-partner-status');
            statusEl.textContent = getStatusText(userData.status);
            statusEl.className = `status ${userData.status || 'offline'}`;
        }
        
    } catch (error) {
        console.error("Ошибка загрузки информации о чате:", error);
    }
}

// Загрузка сообщений
async function loadMessages(chatId) {
    const container = document.getElementById('messages-container');
    container.innerHTML = '<div class="loading">Загрузка сообщений...</div>';
    
    try {
        // Получаем последние 50 сообщений
        const messagesQuery = await db.collection('chats')
            .doc(chatId)
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .limit(50)
            .get();
        
        if (messagesQuery.empty) {
            container.innerHTML = '<div class="empty-state">Пока нет сообщений</div>';
            return;
        }
        
        // Конвертируем в массив и сортируем по времени
        const messages = [];
        messagesQuery.forEach(doc => {
            messages.push({ id: doc.id, ...doc.data() });
        });
        
        messages.reverse(); // От старых к новым
        
        // Очищаем контейнер
        container.innerHTML = '';
        
        // Добавляем сообщения
        messages.forEach(message => {
            const messageElement = createMessageElement(message);
            container.appendChild(messageElement);
        });
        
        // Прокручиваем вниз
        scrollToBottom();
        
    } catch (error) {
        console.error("Ошибка загрузки сообщений:", error);
        container.innerHTML = '<div class="error">Ошибка загрузки сообщений</div>';
    }
}

// Создание элемента сообщения
function createMessageElement(message) {
    const isSent = message.senderId === currentUser.uid;
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${isSent ? 'sent' : 'received'}`;
    
    const time = message.timestamp ? formatTimeDetailed(message.timestamp.toDate()) : 'только что';
    let content = '';
    
    // Обработка разных типов сообщений
    switch (message.type) {
        case 'system':
            wrapper.className = 'message-wrapper system';
            content = `
                <div class="system-message">
                    <span>${message.content}</span>
                    <span class="message-time">${time}</span>
                </div>
            `;
            break;
            
        case 'image':
            content = `
                <div class="message-bubble">
                    <img src="${message.content}" alt="Изображение" class="message-image" onclick="openImageModal('${message.content}')">
                    ${message.text ? `<p>${escapeHtml(message.text)}</p>` : ''}
                    <div class="message-footer">
                        <span class="message-time">${time}</span>
                        ${isSent ? `<span class="message-status">${getMessageStatusIcon(message.status)}</span>` : ''}
                    </div>
                </div>
            `;
            break;
            
        case 'file':
            const fileName = message.filename || 'Файл';
            const fileSize = message.size ? formatFileSize(message.size) : '';
            content = `
                <div class="message-bubble">
                    <div class="file-message">
                        <div class="file-icon">📎</div>
                        <div class="file-info">
                            <strong>${escapeHtml(fileName)}</strong>
                            ${fileSize ? `<span>${fileSize}</span>` : ''}
                        </div>
                        <button class="btn-small" onclick="downloadFile('${message.content}', '${fileName}')">Скачать</button>
                    </div>
                    ${message.text ? `<p>${escapeHtml(message.text)}</p>` : ''}
                    <div class="message-footer">
                        <span class="message-time">${time}</span>
                        ${isSent ? `<span class="message-status">${getMessageStatusIcon(message.status)}</span>` : ''}
                    </div>
                </div>
            `;
            break;
            
        default: // Текстовое сообщение
            content = `
                <div class="message-bubble">
                    <p>${escapeHtml(message.content)}</p>
                    <div class="message-footer">
                        <span class="message-time">${time}</span>
                        ${isSent ? `<span class="message-status">${getMessageStatusIcon(message.status)}</span>` : ''}
                    </div>
                </div>
            `;
    }
    
    wrapper.innerHTML = content;
    return wrapper;
}

// Подписка на новые сообщения
function subscribeToMessages(chatId) {
    // Отписываемся от предыдущей подписки
    if (unsubscribeFunctions.messages) {
        unsubscribeFunctions.messages();
    }
    
    const messagesQuery = db.collection('chats')
        .doc(chatId)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .limit(1);
    
    unsubscribeFunctions.messages = messagesQuery.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const message = { id: change.doc.id, ...change.doc.data() };
                
                // Показываем только если это не наше сообщение
                // (наши сообщения добавляются локально)
                if (message.senderId !== currentUser.uid) {
                    addMessageToChat(message);
                    
                    // Показываем уведомление, если окно не активно
                    if (document.hidden) {
                        showDesktopNotification(message);
                    }
                }
            }
        });
    }, (error) => {
        console.error("Ошибка подписки на сообщения:", error);
    });
}

// Добавление нового сообщения в чат
function addMessageToChat(message) {
    const container = document.getElementById('messages-container');
    const messageElement = createMessageElement(message);
    container.appendChild(messageElement);
    
    // Если мы внизу, прокручиваем к новому сообщению
    if (isAtBottom()) {
        scrollToBottom();
    }
    
    // Обновляем последнее сообщение в списке чатов
    updateChatList(message);
}

// Отправка сообщения
async function sendMessage() {
    const input = document.getElementById('message-input');
    const content = input.value.trim();
    
    if (!content || !currentChatId) {
        return;
    }
    
    try {
        // Создаем объект сообщения
        const message = {
            senderId: currentUser.uid,
            content: content,
            timestamp: timestamp(),
            type: 'text',
            status: 'sent'
        };
        
        // Добавляем сообщение в базу
        const docRef = await db.collection('chats')
            .doc(currentChatId)
            .collection('messages')
            .add(message);
        
        // Обновляем статус сообщения на доставленное
        await docRef.update({
            status: 'delivered',
            id: docRef.id
        });
        
        // Обновляем последнее сообщение в чате
        await db.collection('chats').doc(currentChatId).update({
            lastMessage: {
                content: content,
                senderId: currentUser.uid,
                timestamp: timestamp()
            },
            [`unreadCount.${getOtherParticipant(currentChatId)}`]: increment(1)
        });
        
        // Очищаем поле ввода
        input.value = '';
        autoResize(input);
        
        // Добавляем сообщение локально (чтобы не ждать синхронизации)
        message.id = docRef.id;
        message.status = 'delivered';
        addMessageToChat(message);
        
    } catch (error) {
        console.error("Ошибка отправки сообщения:", error);
        showNotification("Не удалось отправить сообщение", "error");
    }
}

// Отправка файла
async function sendFile(file) {
    if (!currentChatId || !file) return;
    
    try {
        showNotification("Загрузка файла...", "info");
        
        // Генерируем уникальное имя файла
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const storagePath = `attachments/${currentChatId}/${fileName}`;
        
        // Загружаем файл в Storage
        const storageRef = storage.ref(storagePath);
        const uploadTask = storageRef.put(file);
        
        // Следим за прогрессом загрузки
        uploadTask.on('state_changed',
            (snapshot) => {
                // Можно показать прогресс-бар
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Прогресс загрузки: ${progress}%`);
            },
            (error) => {
                console.error("Ошибка загрузки файла:", error);
                showNotification("Ошибка загрузки файла", "error");
            },
            async () => {
                // Файл загружен успешно
                const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                
                // Определяем тип сообщения
                let messageType = 'file';
                if (file.type.startsWith('image/')) {
                    messageType = 'image';
                }
                
                // Создаем сообщение
                const message = {
                    senderId: currentUser.uid,
                    content: downloadURL,
                    timestamp: timestamp(),
                    type: messageType,
                    status: 'delivered',
                    filename: file.name,
                    size: file.size,
                    mimeType: file.type
                };
                
                // Сохраняем сообщение в базе
                const docRef = await db.collection('chats')
                    .doc(currentChatId)
                    .collection('messages')
                    .add(message);
                
                // Обновляем последнее сообщение в чате
                await db.collection('chats').doc(currentChatId).update({
                    lastMessage: {
                        content: messageType === 'image' ? '📷 Изображение' : '📎 Файл',
                        senderId: currentUser.uid,
                        timestamp: timestamp()
                    },
                    [`unreadCount.${getOtherParticipant(currentChatId)}`]: increment(1)
                });
                
                showNotification("Файл отправлен", "success");
            }
        );
        
    } catch (error) {
        console.error("Ошибка отправки файла:", error);
        showNotification("Не удалось отправить файл", "error");
    }
}

// Вспомогательные функции
function getOtherParticipant(chatId) {
    const participants = chatId.split('_');
    return participants.find(id => id !== currentUser.uid);
}

function isAtBottom() {
    const container = document.getElementById('messages-container');
    return container.scrollHeight - container.clientHeight <= container.scrollTop + 100;
}

function scrollToBottom() {
    const container = document.getElementById('messages-container');
    container.scrollTop = container.scrollHeight;
}

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
}

function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function attachFile() {
    document.getElementById('file-input').click();
}

// Обработчик выбора файла
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.addEventListener('change', (event) => {
            const files = Array.from(event.target.files);
            files.forEach(file => {
                if (file.size > 10 * 1024 * 1024) { // 10MB лимит
                    showNotification("Файл слишком большой (макс. 10MB)", "error");
                    return;
                }
                sendFile(file);
            });
            
            // Сбрасываем input
            event.target.value = '';
        });
    }
});

function formatTimeDetailed(date) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (date.getTime() > now.getTime() - 60000) { // Меньше минуты назад
        return 'только что';
    } else if (date.getTime() > now.getTime() - 3600000) { // Меньше часа назад
        const minutes = Math.floor((now - date) / 60000);
        return `${minutes} мин. назад`;
    } else if (messageDate.getTime() === today.getTime()) { // Сегодня
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else if (messageDate.getTime() === today.getTime() - 86400000) { // Вчера
        return `вчера ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
    }
}

function getMessageStatusIcon(status) {
    const icons = {
        'sent': '✓',
        'delivered': '✓✓',
        'read': '✓✓👁️'
    };
    return icons[status] || '';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Б';
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Обновление списка чатов при новом сообщении
function updateChatList(message) {
    const chatItem = document.querySelector(`.chat-item[data-chat-id="${currentChatId}"]`);
    if (chatItem) {
        const lastMessageEl = chatItem.querySelector('.chat-last-message');
        const timeEl = chatItem.querySelector('.chat-time');
        
        if (lastMessageEl) {
            let preview = message.content;
            if (message.type === 'image') preview = '📷 Изображение';
            if (message.type === 'file') preview = '📎 Файл';
            if (preview.length > 30) preview = preview.substring(0, 30) + '...';
            
            lastMessageEl.textContent = preview;
        }
        
        if (timeEl) {
            timeEl.textContent = formatTimeDetailed(message.timestamp.toDate());
        }
        
        // Перемещаем чат вверх списка
        const chatsList = document.getElementById('chats-list');
        if (chatItem.parentNode === chatsList && chatItem !== chatsList.firstChild) {
            chatsList.insertBefore(chatItem, chatsList.firstChild);
        }
    }
}

// Пометить сообщения как прочитанные
async function markMessagesAsRead(chatId) {
    try {
        // Обновляем счетчик непрочитанных
        await db.collection('chats').doc(chatId).update({
            [`unreadCount.${currentUser.uid}`]: 0
        });
        
        // Помечаем сообщения как прочитанные
        const unreadMessages = await db.collection('chats')
            .doc(chatId)
            .collection('messages')
            .where('senderId', '!=', currentUser.uid)
            .where('status', 'in', ['sent', 'delivered'])
            .get();
        
        const batch = db.batch();
        unreadMessages.forEach(doc => {
            batch.update(doc.ref, { status: 'read' });
        });
        
        if (unreadMessages.size > 0) {
            await batch.commit();
        }
        
    } catch (error) {
        console.error("Ошибка пометки сообщений как прочитанных:", error);
    }
}

// Показать уведомление на рабочем столе
function showDesktopNotification(message) {
    if (!("Notification" in window)) return;
    
    if (Notification.permission === "granted") {
        createNotification(message);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                createNotification(message);
            }
        });
    }
}

function createNotification(message) {
    const chatName = document.getElementById('chat-partner-name')?.textContent || "Новое сообщение";
    const notification = new Notification(chatName, {
        body: message.type === 'image' ? '📷 Изображение' : 
              message.type === 'file' ? '📎 Файл' : 
              message.content,
        icon: document.getElementById('chat-avatar')?.src || 'assets/default-avatar.png'
    });
    
    notification.onclick = () => {
        window.focus();
        notification.close();
    };
}

// Начать новый чат с другом
async function startChatWith(friendId) {
    try {
        // Проверяем, есть ли уже чат с этим пользователем
        const existingChat = await findExistingChat(friendId);
        
        if (existingChat) {
            openChat(existingChat.id);
        } else {
            // Создаем новый чат
            const chatId = [currentUser.uid, friendId].sort().join('_');
            
            await db.collection('chats').doc(chatId).set({
                id: chatId,
                participants: [currentUser.uid, friendId],
                createdAt: timestamp(),
                lastMessage: null,
                unreadCount: {
                    [currentUser.uid]: 0,
                    [friendId]: 0
                }
            });
            
            // Добавляем системное сообщение
            await db.collection('chats').doc(chatId).collection('messages').add({
                senderId: 'system',
                content: 'Чат создан',
                timestamp: timestamp(),
                type: 'system'
            });
            
            openChat(chatId);
        }
    } catch (error) {
        console.error("Ошибка создания чата:", error);
        showNotification("Не удалось создать чат", "error");
    }
}

// Поиск существующего чата
async function findExistingChat(friendId) {
    try {
        const chatQuery = await db.collection('chats')
            .where('participants', 'array-contains', currentUser.uid)
            .get();
        
        for (const doc of chatQuery.docs) {
            const chat = doc.data();
            if (chat.participants.includes(friendId)) {
                return chat;
            }
        }
        
        return null;
    } catch (error) {
        console.error("Ошибка поиска чата:", error);
        return null;
    }
}

// Открыть изображение в модальном окне
function openImageModal(src) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-content">
            <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <img src="${src}" alt="Изображение">
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Закрытие по клику вне изображения
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Скачать файл
function downloadFile(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
}

// Добавить CSS для модального окна изображения
const imageModalCSS = `
.image-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.image-modal-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
}

.image-modal-content img {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
}

.close-modal {
    position: absolute;
    top: -40px;
    right: 0;
    color: white;
    font-size: 40px;
    cursor: pointer;
}

.file-message {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: rgba(0,0,0,0.05);
    border-radius: 8px;
    margin-bottom: 10px;
}

.file-icon {
    font-size: 24px;
}

.file-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.system-message {
    text-align: center;
    color: #666;
    font-size: 12px;
    margin: 10px 0;
}

.message-image {
    max-width: 300px;
    max-height: 300px;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 10px;
}
`;

// Добавляем CSS в документ
if (!document.querySelector('#image-modal-css')) {
    const style = document.createElement('style');
    style.id = 'image-modal-css';
    style.textContent = imageModalCSS;
    document.head.appendChild(style);
}

// Экспортируем функции
window.openChat = openChat;
window.startChatWith = startChatWith;
window.sendMessage = sendMessage;
window.attachFile = attachFile;
window.autoResize = autoResize;
window.handleKeyDown = handleKeyDown;
window.openImageModal = openImageModal;
window.downloadFile = downloadFile;
