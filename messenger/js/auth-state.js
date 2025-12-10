// Проверяем состояние авторизации при загрузке
document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged((user) => {
        const authContainer = document.getElementById('auth-container');
        
        if (user) {
            // Пользователь авторизован - показываем приложение
            loadApp();
        } else {
            // Пользователь не авторизован - показываем форму входа
            loadLogin();
        }
    });
});

// Загружаем форму входа
function loadLogin() {
    fetch('login.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('auth-container').innerHTML = html;
            // Подключаем скрипты логина после загрузки HTML
            const script = document.createElement('script');
            script.src = 'js/login.js';
            document.body.appendChild(script);
        });
}

// Загружаем приложение
function loadApp() {
    fetch('app.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('auth-container').innerHTML = html;
            // Подключаем скрипты приложения
            loadScripts([
                'js/app.js',
                'js/messenger.js',
                'js/friends.js',
                'js/profile.js'
            ]);
        });
}

// Функция для последовательной загрузки скриптов
function loadScripts(scripts) {
    if (scripts.length === 0) return;
    
    const script = document.createElement('script');
    script.src = scripts[0];
    script.onload = () => {
        loadScripts(scripts.slice(1));
    };
    document.body.appendChild(script);
}

// Функция выхода
function logout() {
    if (confirm("Выйти из аккаунта?")) {
        auth.signOut().then(() => {
            console.log("Пользователь вышел");
            location.reload();
        });
    }
}
