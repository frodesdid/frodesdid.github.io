// friends.js - исправленная версия

// ВСЕГДА получаем currentUser из auth, а не из глобальной переменной
function getCurrentUser() {
    return auth.currentUser;
}

// Показать диалог приглашения
async function showInviteDialog() {
    const user = getCurrentUser();
    if (!user) {
        alert("Ошибка: вы не авторизованы! Перезагрузите страницу.");
        return;
    }
    
    try {
        const modal = document.getElementById('invite-modal');
        const content = document.getElementById('invite-content');
        
        content.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h3>Загрузка...</h3>
            </div>
        `;
        
        modal.style.display = 'flex';
        
        // Загружаем инвайты
        const invites = await loadUserInvites(user.uid);
        
        content.innerHTML = `
            <div class="invite-section">
                <h3>Создать новый инвайт</h3>
                <button class="btn-primary" onclick="createNewInvite()" id="create-invite-btn">
                    Создать инвайт-код
                </button>
            </div>
            
            <div class="invite-section">
                <h3>Активные инвайты</h3>
                ${invites.length > 0 ? `
                    <div class="invites-list">
                        ${invites.map(invite => `
                            <div class="invite-item">
                                <div class="invite-code">
                                    <strong style="font-size: 18px;">${invite.code}</strong>
                                    <span class="invite-status">${invite.used ? 'Использован' : 'Активен'}</span>
                                </div>
                                <div class="invite-details">
                                    <small>Создан: ${formatDate(invite.createdAt)}</small>
                                </div>
                                ${!invite.used ? `
                                    <button class="btn-small" onclick="copyInviteCode('${invite.code}')">Копировать</button>
                                    <button class="btn-small btn-danger" onclick="deleteInviteFunction('${invite.id}')">Удалить</button>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : '<p>У вас пока нет инвайт-кодов</p>'}
            </div>
            
            <div class="invite-section">
                <h3>Как пригласить друга</h3>
                <ol style="text-align: left;">
                    <li>Создайте инвайт-код</li>
                    <li>Скопируйте его</li>
                    <li>Отправьте другу</li>
                    <li>Друг использует код при регистрации</li>
                    <li>Он автоматически добавится в друзья</li>
                </ol>
            </div>
        `;
        
    } catch (error) {
        console.error("Ошибка:", error);
        const content = document.getElementById('invite-content');
        content.innerHTML = `
            <div style="color: red; padding: 20px;">
                <h3>Ошибка</h3>
                <p>${error.message}</p>
                <button onclick="location.reload()">Перезагрузить страницу</button>
            </div>
        `;
    }
}

// Загрузка инвайтов пользователя
async function loadUserInvites(userId) {
    try {
        const invitesQuery = await db.collection('invites')
            .where('createdBy', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();
        
        const invites = [];
        invitesQuery.forEach(doc => {
            invites.push({ id: doc.id, ...doc.data() });
        });
        
        return invites;
    } catch (error) {
        console.error("Ошибка загрузки инвайтов:", error);
        return [];
    }
}

// Создание нового инвайта
async function createNewInvite() {
    const user = getCurrentUser();
    if (!user) {
        alert("Ошибка: вы не авторизованы!");
        return;
    }
    
    try {
        const btn = document.getElementById('create-invite-btn');
        btn.innerHTML = 'Создание...';
        btn.disabled = true;
        
        // Генерируем код
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
        code += '-';
        for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
        
        // Создаем инвайт
        await db.collection('invites').add({
            code: code,
            createdBy: user.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            used: false,
            usedCount: 0,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            maxUses: 1
        });
        
        alert(`✅ Инвайт-код создан:\n\n${code}\n\nСкопируйте его и отправьте другу!`);
        
        // Обновляем список
        showInviteDialog();
        
    } catch (error) {
        console.error("Ошибка создания инвайта:", error);
        alert("Ошибка создания инвайта: " + error.message);
        
        const btn = document.getElementById('create-invite-btn');
        if (btn) {
            btn.innerHTML = 'Создать инвайт-код';
            btn.disabled = false;
        }
    }
}

// Копирование инвайт-кода
async function copyInviteCode(code) {
    try {
        await navigator.clipboard.writeText(code);
        alert('Код скопирован: ' + code);
    } catch (error) {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Код скопирован!');
    }
}

// Форматирование даты
function formatDate(date) {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('ru-RU') + ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

// Закрытие модального окна
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Функция удаления инвайта (используем другое имя чтобы не было конфликта)
async function deleteInviteFunction(inviteId) {
    if (!confirm("Удалить этот инвайт-код?")) return;
    
    try {
        await db.collection('invites').doc(inviteId).delete();
        alert('Инвайт удален');
        showInviteDialog(); // Обновляем список
    } catch (error) {
        console.error("Ошибка удаления инвайта:", error);
        alert("Ошибка: " + error.message);
    }
}

// Функция-обертка с правильным именем для HTML
async function deleteInvite(inviteId) {
    return deleteInviteFunction(inviteId);
}

// Экспортируем функции
window.showInviteDialog = showInviteDialog;
window.createNewInvite = createNewInvite;
window.copyInviteCode = copyInviteCode;
window.deleteInvite = deleteInvite; // Теперь работает!
window.closeModal = closeModal;
window.startNewChat = startNewChat;

// Функция удаления инвайта (используем другое имя чтобы не было конфликта)
async function deleteInviteFunction(inviteId) {
    if (!confirm("Удалить этот инвайт-код?")) return;
    
    try {
        await db.collection('invites').doc(inviteId).delete();
        alert('Инвайт удален');
        showInviteDialog(); // Обновляем список
    } catch (error) {
        console.error("Ошибка удаления инвайта:", error);
        alert("Ошибка: " + error.message);
    }
}

// Экспортируем под правильным именем
window.deleteInviteFunction = deleteInviteFunction;
