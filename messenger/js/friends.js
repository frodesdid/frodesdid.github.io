// Показать диалог приглашения
async function showInviteDialog() {
    try {
        const modal = document.getElementById('invite-modal');
        const content = document.getElementById('invite-content');
        
        // Загружаем существующие инвайты
        const invites = await loadUserInvites();
        
        content.innerHTML = `
            <div class="invite-section">
                <h3>Создать новый инвайт</h3>
                <p>Поделитесь этим кодом с другом. Каждый код можно использовать один раз.</p>
                <button class="btn-primary" onclick="createNewInvite()" id="create-invite-btn">
                    Создать инвайт-код
                </button>
            </div>
            
            <div class="invite-section">
                <h3>Активные инвайты</h3>
                ${invites.length > 0 ? `
                    <div class="invites-list">
                        ${invites.map(invite => `
                            <div class="invite-item ${invite.used ? 'used' : 'active'}">
                                <div class="invite-code">
                                    <strong>${invite.code}</strong>
                                    <span class="invite-status">${invite.used ? 'Использован' : 'Активен'}</span>
                                </div>
                                <div class="invite-details">
                                    <span>Создан: ${formatDate(invite.createdAt)}</span>
                                    ${invite.used ? `<span>Использован: ${invite.usedByEmail || formatDate(invite.usedAt)}</span>` : ''}
                                    ${invite.expiresAt ? `<span>Истекает: ${formatDate(invite.expiresAt)}</span>` : ''}
                                </div>
                                ${!invite.used ? `
                                    <button class="btn-small" onclick="copyInviteCode('${invite.code}')">Копировать</button>
                                    <button class="btn-small btn-danger" onclick="deleteInvite('${invite.id}')">Удалить</button>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : '<p>У вас пока нет инвайт-кодов</p>'}
            </div>
            
            <div class="invite-section">
                <h3>Как это работает</h3>
                <ol class="invite-instructions">
                    <li>Создайте инвайт-код</li>
                    <li>Отправьте код другу</li>
                    <li>Друг использует код при регистрации</li>
                    <li>Он автоматически добавляется в ваши друзья</li>
                    <li>Чат создается автоматически</li>
                </ol>
            </div>
        `;
        
        modal.style.display = 'flex';
        
    } catch (error) {
        console.error("Ошибка загрузки диалога инвайтов:", error);
        showNotification("Не удалось загрузить инвайты", "error");
    }
}

// Создание нового инвайта
async function createNewInvite() {
    try {
        const btn = document.getElementById('create-invite-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Создание...';
        btn.disabled = true;
        
        // Генерируем уникальный код
        const code = generateInviteCode();
        
        // Создаем инвайт в базе данных
        const inviteData = {
            code: code,
            createdBy: currentUser.uid,
            createdAt: timestamp(),
            used: false,
            usedCount: 0,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней
            maxUses: 1
        };
        
        await db.collection('invites').add(inviteData);
        
        // Показываем уведомление
        showNotification(`Инвайт-код создан: ${code}`, 'success');
        
        // Обновляем список
        showInviteDialog();
        
    } catch (error) {
        console.error("Ошибка создания инвайта:", error);
        showNotification("Не удалось создать инвайт", "error");
        
        // Восстанавливаем кнопку
        const btn = document.getElementById('create-invite-btn');
        btn.innerHTML = 'Создать инвайт-код';
        btn.disabled = false;
    }
}

// Генерация инвайт-кода
function generateInviteCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Без 0,1,O,I для читаемости
    let code = '';
    
    // Первая часть
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    code += '-';
    
    // Вторая часть
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return code;
}

// Загрузка инвайтов пользователя
async function loadUserInvites() {
    try {
        const invitesQuery = await db.collection('invites')
            .where('createdBy', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .limit(10)
            .get();
        
        const invites = [];
        
        for (const doc of invitesQuery.docs) {
            const invite = { id: doc.id, ...doc.data() };
            
            // Если инвайт использован, получаем информацию о пользователе
            if (invite.used && invite.usedBy) {
                try {
                    const userDoc = await db.collection('users').doc(invite.usedBy).get();
                    if (userDoc.exists) {
                        invite.usedByEmail = userDoc.data().email;
                    }
                } catch (error) {
                    console.error("Ошибка загрузки пользователя:", error);
                }
            }
            
            invites.push(invite);
        }
        
        return invites;
    } catch (error) {
        console.error("Ошибка загрузки инвайтов:", error);
        return [];
    }
}

// Копирование инвайт-кода в буфер обмена
async function copyInviteCode(code) {
    try {
        await navigator.clipboard.writeText(code);
        showNotification('Код скопирован в буфер обмена!', 'success');
    } catch (error) {
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Код скопирован!', 'success');
    }
}

// Удаление инвайта
async function deleteInvite(inviteId) {
    if (!confirm("Удалить этот инвайт-код? Его нельзя будет использовать для регистрации.")) {
        return;
    }
    
    try {
        await db.collection('invites').doc(inviteId).delete();
        showNotification('Инвайт удален', 'success');
        showInviteDialog();
    } catch (error) {
        console.error("Ошибка удаления инвайта:", error);
        showNotification("Не удалось удалить инвайт", "error");
    }
}

// Закрытие модального окна
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Подписка на обновления друзей
function subscribeToFriendsUpdates() {
    if (unsubscribeFunctions.friends) {
        unsubscribeFunctions.friends();
    }
    
    // Подписываемся на изменения статуса друзей
    const userDoc = db.collection('users').doc(currentUser.uid);
    
    unsubscribeFunctions.friends = userDoc.onSnapshot(async (doc) => {
        if (doc.exists) {
            const userData = doc.data();
            const friendIds = userData.friends || [];
            
            // Обновляем статусы друзей в реальном времени
            updateFriendsStatuses(friendIds);
            
            // Если добавился новый друг, обновляем список
            if (friendIds.length !== document.querySelectorAll('.friend-item').length) {
                await loadFriends();
            }
        }
    }, (error) => {
        console.error("Ошибка подписки на друзей:", error);
    });
}

// Обновление статусов друзей в реальном времени
function updateFriendsStatuses(friendIds) {
    friendIds.forEach(friendId => {
        db.collection('users').doc(friendId).onSnapshot((doc) => {
            if (doc.exists) {
                const friend = doc.data();
                const friendElement = document.querySelector(`.friend-item[data-user-id="${friendId}"]`);
                
                if (friendElement) {
                    const statusEl = friendElement.querySelector('.friend-status');
                    if (statusEl) {
                        statusEl.textContent = getStatusText(friend.status);
                        statusEl.className = `friend-status ${friend.status || 'offline'}`;
                    }
                }
                
                // Если это текущий собеседник, обновляем его статус в чате
                if (currentChatId && currentChatId.includes(friendId)) {
                    const chatStatusEl = document.getElementById('chat-partner-status');
                    if (chatStatusEl) {
                        chatStatusEl.textContent = getStatusText(friend.status);
                        chatStatusEl.className = `status ${friend.status || 'offline'}`;
                    }
                }
            }
        });
    });
}

// Утилиты для дат
function formatDate(date) {
    if (!date) return '';
    
    const d = date.toDate ? date.toDate() : new Date(date);
    const now = new Date();
    const diff = now - d;
    
    if (diff < 24 * 60 * 60 * 1000) {
        return `сегодня в ${d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diff < 48 * 60 * 60 * 1000) {
        return `вчера в ${d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
        return d.toLocaleDateString('ru-RU', { 
            day: 'numeric', 
            month: 'short',
            year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
        });
    }
}

// Начало нового чата (из интерфейса)
async function startNewChat() {
    // В будущем можно добавить поиск пользователей
    // Сейчас просто показываем сообщение
    showNotification('Чтобы начать новый чат, нажмите на друга в списке', 'info');
}

// Экспортируем функции
window.showInviteDialog = showInviteDialog;
window.createNewInvite = createNewInvite;
window.copyInviteCode = copyInviteCode;
window.deleteInvite = deleteInvite;
window.closeModal = closeModal;
window.startNewChat = startNewChat;
