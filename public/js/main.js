// Основной JavaScript файл для всех страниц

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация эффектов
    initGlitchEffects();
    initButtonEffects();
    initScrollEffects();
    
    // Инициализация специфичных для страницы функций
    if (window.location.pathname === '/') {
        initHomePage();
    } else if (window.location.pathname.includes('/profile/')) {
        initProfilePage();
    } else if (window.location.pathname === '/journal') {
        initJournalPage();
    } else if (window.location.pathname === '/rating') {
        initRatingPage();    }
    
    initMobileSidebar();
    // УДАЛЕНО: initMobileNavigation() - теперь используется только сайдбар
});

// Глитч эффекты
function initGlitchEffects() {
    const glitchElements = document.querySelectorAll('.glitch-text');
    
    glitchElements.forEach(element => {
        // Случайные глитчи
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% шанс
                element.style.animation = 'none';
                setTimeout(() => {
                    element.style.animation = 'glitch 2s infinite';
                }, 50);
            }
        }, 3000);
    });
}

// Эффекты кнопок
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            // Звуковой эффект можно добавить здесь
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('click', function() {
            // Эффект нажатия
            this.style.transform = 'translateY(1px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-2px) scale(1.02)';
            }, 100);
        });
    });
}

// Эффекты прокрутки
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Добавляем анимацию появления для карточек
    const cards = document.querySelectorAll('.stat-card, .action-card, .message-item, .fighter-card, .fun-card, .event-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Инициализация главной страницы
function initHomePage() {
    // Анимация печатания для цитат
    const quotes = document.querySelectorAll('.quote');
    quotes.forEach(quote => {
        typeWriter(quote, quote.textContent, 50);
    });
    
    // Мерцающий эффект для warning блоков
    const warnings = document.querySelectorAll('.warning');
    warnings.forEach(warning => {
        setInterval(() => {
            warning.style.opacity = warning.style.opacity === '0.7' ? '1' : '0.7';
        }, 1500);
    });
}

// Инициализация страницы профиля
function initProfilePage() {
    // Предварительный просмотр фото
    const photoInput = document.getElementById('photo');
    if (photoInput) {
        photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.querySelector('.profile-photo') || document.querySelector('.photo-placeholder');
                    if (preview) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.className = 'profile-photo';
                        img.style.width = '200px';
                        img.style.height = '200px';
                        img.style.objectFit = 'cover';
                        preview.parentNode.replaceChild(img, preview);
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Автосохранение черновика биографии
    const bioTextarea = document.getElementById('bio');
    if (bioTextarea) {
        bioTextarea.addEventListener('input', function() {
            localStorage.setItem('bio_draft', this.value);
        });
        
        // Восстановление черновика
        const draft = localStorage.getItem('bio_draft');
        if (draft && !bioTextarea.value) {
            bioTextarea.value = draft;
        }
    }
    
    // Подтверждение очистки достижений
    const achievementForm = document.querySelector('.achievement-form');
    if (achievementForm) {
        achievementForm.addEventListener('submit', function(e) {
            const input = this.querySelector('input[name="achievement"]');
            if (input.value.trim().length < 3) {
                e.preventDefault();
                alert('Достижение должно содержать минимум 3 символа!');
                input.focus();
            }
        });
    }
}

// Инициализация журнала
function initJournalPage() {
    // Счетчик символов для сообщений
    const messageTextarea = document.querySelector('textarea[name="message"]');
    if (messageTextarea) {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.textAlign = 'right';
        counter.style.color = '#666';
        counter.style.fontSize = '0.8rem';
        counter.style.marginTop = '5px';
        
        messageTextarea.parentNode.appendChild(counter);
        
        messageTextarea.addEventListener('input', function() {
            const length = this.value.length;
            counter.textContent = `${length}/1000 символов`;
            
            if (length > 1000) {
                counter.style.color = '#ff4444';
                this.style.borderColor = '#ff4444';
            } else {
                counter.style.color = '#666';
                this.style.borderColor = '#333';
            }
        });
        
        // Инициализация счетчика
        messageTextarea.dispatchEvent(new Event('input'));
    }
    
    // Автообновление сообщений каждые 30 секунд
    setInterval(() => {
        if (document.visibilityState === 'visible') {
            location.reload();
        }
    }, 30000);
    
    // Подтверждение анонимной отправки
    const messageForm = document.querySelector('.message-form');
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            const anonymous = this.querySelector('input[name="anonymous"]');
            if (anonymous.checked) {
                if (!confirm('Отправить сообщение анонимно? Отменить отправку будет невозможно.')) {
                    e.preventDefault();
                }
            }
        });
    }
}

// Инициализация рейтинга
function initRatingPage() {
    // Анимация обновления рейтинга
    const ratingElements = document.querySelectorAll('.score-number');
    ratingElements.forEach(element => {
        const targetValue = parseInt(element.textContent);
        element.textContent = '0';
        
        animateNumber(element, 0, targetValue, 1000);
    });
    
    // Предотвращение множественных голосований
    const voteButtons = document.querySelectorAll('.btn-vote');
    voteButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.disabled = true;
            this.textContent = 'ОБРАБОТКА...';
        });
    });
}

// Вспомогательные функции

// Эффект печатания
function typeWriter(element, text, speed = 100) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Анимация чисел
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        const currentValue = Math.floor(start + (end - start) * easeOutCubic(progress));
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Функция плавности анимации
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Генерация случайных эффектов
function randomGlitch() {
    const elements = document.querySelectorAll('.glitch-text, .btn, .nav-link');
    const randomElement = elements[Math.floor(Math.random() * elements.length)];
    
    if (randomElement) {
        randomElement.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            randomElement.style.filter = 'none';
        }, 200);
    }
}

// Случайные глитчи каждые 10-30 секунд
setInterval(() => {
    if (Math.random() < 0.3) {
        randomGlitch();
    }
}, Math.random() * 20000 + 10000);

// Пасхальные яйца
document.addEventListener('keydown', function(e) {
    // Konami Code: ↑↑↓↓←→←→BA
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    window.konamiSequence = window.konamiSequence || [];
    window.konamiSequence.push(e.keyCode);
    
    if (window.konamiSequence.length > konamiCode.length) {
        window.konamiSequence.shift();
    }
    
    if (JSON.stringify(window.konamiSequence) === JSON.stringify(konamiCode)) {
        activateEasterEgg();
        window.konamiSequence = [];
    }
});

function activateEasterEgg() {
    // Секретный режим "Анархия"
    document.body.style.animation = 'glitch 0.5s infinite';
    document.body.style.filter = 'invert(1) hue-rotate(180deg)';
    
    const message = document.createElement('div');
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.background = 'rgba(255, 0, 0, 0.9)';
    message.style.color = '#fff';
    message.style.padding = '20px';
    message.style.border = '2px solid #fff';
    message.style.fontSize = '2rem';
    message.style.fontFamily = 'Courier Prime, monospace';
    message.style.textAlign = 'center';
    message.style.zIndex = '9999';
    message.innerHTML = 'АНАРХИЯ АКТИВИРОВАНА!<br><small>Нажми ESC для выхода</small>';
    
    document.body.appendChild(message);
    
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            document.body.style.animation = '';
            document.body.style.filter = '';
            message.remove();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
    
    // Автоотключение через 10 секунд
    setTimeout(() => {
        document.body.style.animation = '';
        document.body.style.filter = '';
        if (message.parentNode) {
            message.remove();
        }
    }, 10000);
}

// Сохранение состояния формы
function saveFormState(formSelector, key) {
    const form = document.querySelector(formSelector);
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const formData = {};
            inputs.forEach(inp => {
                if (inp.type === 'checkbox') {
                    formData[inp.name] = inp.checked;
                } else {
                    formData[inp.name] = inp.value;
                }
            });
            localStorage.setItem(key, JSON.stringify(formData));
        });
    });
    
    // Восстановление данных
    const savedData = localStorage.getItem(key);
    if (savedData) {
        const formData = JSON.parse(savedData);
        inputs.forEach(input => {
            if (formData[input.name] !== undefined) {
                if (input.type === 'checkbox') {
                    input.checked = formData[input.name];
                } else {
                    input.value = formData[input.name];
                }
            }
        });
    }
}

// Автосохранение для форм
if (document.querySelector('.message-form')) {
    saveFormState('.message-form', 'message_draft');
}

if (document.querySelector('.profile-form')) {
    saveFormState('.profile-form', 'profile_draft');
}

// Уведомления
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.border = '1px solid';
    notification.style.fontFamily = 'Courier Prime, monospace';
    notification.style.fontWeight = 'bold';
    notification.style.zIndex = '1000';
    notification.style.animation = 'slideIn 0.3s ease';
    
    if (type === 'success') {
        notification.style.background = 'rgba(0, 255, 0, 0.1)';
        notification.style.borderColor = '#00ff00';
        notification.style.color = '#00ff00';
    } else if (type === 'error') {
        notification.style.background = 'rgba(255, 0, 0, 0.1)';
        notification.style.borderColor = '#ff0000';
        notification.style.color = '#ff0000';
    } else {
        notification.style.background = 'rgba(255, 68, 68, 0.1)';
        notification.style.borderColor = '#ff4444';
        notification.style.color = '#ff4444';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, duration);
}

// Добавляем CSS для анимации уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Мобильная оптимизация и улучшения UX

// Определение мобильного устройства
function isMobileDevice() {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Улучшенная обработка сенсорных событий
function addTouchSupport() {
    if (isMobileDevice()) {
        // Добавляем поддержку свайпов для навигации
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', function(e) {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Горизонтальный свайп (для навигации между страницами)
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    // Свайп вправо - назад
                    if (document.referrer && document.referrer !== window.location.href) {
                        // history.back();
                    }
                } else {
                    // Свайп влево - вперед
                    // Можно добавить навигацию к следующей странице
                }
            }
        });
        
        // Предотвращаем двойное нажатие для зума
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
}

// Оптимизация для мобильных форм
function optimizeMobileForms() {
    if (isMobileDevice()) {
        // Автоматически скролл к активному элементу формы
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                setTimeout(() => {
                    this.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 300); // Задержка для открытия клавиатуры
            });
        });
        
        // Улучшение для числовых полей
        const numberInputs = document.querySelectorAll('input[type="number"]');
        numberInputs.forEach(input => {
            input.setAttribute('inputmode', 'numeric');
            input.setAttribute('pattern', '[0-9]*');
        });
    }
}

// Адаптивные размеры для генераторов
function adaptGeneratorsForMobile() {
    if (isMobileDevice()) {
        // Уменьшаем скорость анимации печатания для мобильных
        window.mobileTypewriterSpeed = 30; // Быстрее для мобильных
        
        // Адаптируем размеры элементов
        const largeTexts = document.querySelectorAll('.glitch-text, .stat-number');
        largeTexts.forEach(element => {
            element.style.fontSize = window.getComputedStyle(element).fontSize;
        });
    }
}

// Оптимизация производительности на мобильных
function optimizePerformance() {
    if (isMobileDevice()) {
        // Уменьшаем количество анимаций на слабых устройствах
        if (navigator.hardwareConcurrency <= 2) {
            document.body.classList.add('reduced-animations');
            
            // Добавляем CSS класс для упрощенных анимаций
            const style = document.createElement('style');
            style.textContent = `
                .reduced-animations * {
                    animation-duration: 0.2s !important;
                    transition-duration: 0.2s !important;
                }
                .reduced-animations .glitch-text {
                    animation: none !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Ленивая загрузка для изображений
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
    }
}

// Улучшенная навигация для мобильных
function improveMobileNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        // Добавляем визуальную обратную связь для нажатий
        link.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
            this.style.opacity = '0.8';
        });
        
        link.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
                this.style.opacity = '';
            }, 150);
        });
    });
}

// Адаптивное меню (если нужно добавить гамбургер-меню)
function createMobileMenu() {
    if (isMobileDevice() && window.innerWidth <= 480) {
        const nav = document.querySelector('.nav-links');
        if (nav && nav.children.length > 4) {
            nav.classList.add('mobile-collapsible');
            
            // Можно добавить кнопку "показать больше" для длинного меню
            const showMoreBtn = document.createElement('button');
            showMoreBtn.textContent = '••• Еще';
            showMoreBtn.className = 'btn btn-secondary mobile-menu-toggle';
            showMoreBtn.style.fontSize = '12px';
            showMoreBtn.style.padding = '8px 12px';
            
            let isExpanded = false;
            showMoreBtn.addEventListener('click', function() {
                isExpanded = !isExpanded;
                nav.style.maxHeight = isExpanded ? 'none' : '200px';
                nav.style.overflow = isExpanded ? 'visible' : 'hidden';
                this.textContent = isExpanded ? '••• Скрыть' : '••• Еще';
            });
            
            // nav.appendChild(showMoreBtn);
        }
    }
}

// Инициализация всех мобильных улучшений
function initMobileOptimizations() {
    addTouchSupport();
    optimizeMobileForms();
    adaptGeneratorsForMobile();
    optimizePerformance();
    improveMobileNavigation();
    createMobileMenu();
    
    // Дополнительные настройки для iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        // Исправляем проблему с 100vh на iOS
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
    }
}

// Запускаем мобильные оптимизации после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    initMobileOptimizations();
    initPWA();
});

// Переопределяем функцию typeWriterAsync для мобильных устройств
const originalTypeWriterAsync = window.typeWriterAsync;
if (typeof originalTypeWriterAsync === 'function') {
    window.typeWriterAsync = function(element, text, speed = 50) {
        const mobileSpeed = isMobileDevice() ? Math.max(speed * 0.6, 20) : speed;
        return originalTypeWriterAsync(element, text, mobileSpeed);
    };
}

// PWA и Service Worker
function initPWA() {
    // Регистрация Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('SW registered: ', registration);
                })
                .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    // Предложение установки PWA
    let deferredPrompt;
    const installButton = document.createElement('button');
    installButton.textContent = '📱 Установить приложение';
    installButton.className = 'btn btn-secondary install-app-btn';
    installButton.style.display = 'none';
    installButton.style.position = 'fixed';
    installButton.style.bottom = '20px';
    installButton.style.right = '20px';
    installButton.style.zIndex = '1000';
    installButton.style.fontSize = '12px';
    installButton.style.padding = '8px 12px';

    document.body.appendChild(installButton);

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installButton.style.display = 'block';
    });

    installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            deferredPrompt = null;
            installButton.style.display = 'none';
        }
    });

    // Скрываем кнопку если PWA уже установлено
    window.addEventListener('appinstalled', () => {
        installButton.style.display = 'none';
    });
}

// Инициализация мобильного сайдбара
function initMobileSidebar() {
    console.log('Initializing mobile sidebar...');
    console.log('Current page:', window.location.pathname);
    
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('mobile-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    console.log('Elements found:', { 
        menuToggle: !!menuToggle, 
        sidebar: !!sidebar, 
        overlay: !!overlay 
    });
    
    if (!menuToggle) {
        console.error('Mobile menu toggle not found!');
        return;
    }
    
    if (!sidebar) {
        console.error('Mobile sidebar not found!');
        return;
    }
    
    if (!overlay) {
        console.error('Sidebar overlay not found!');
        return;
    }
    
    console.log('Setting up sidebar events...');
    
    // Открытие сайдбара
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Menu toggle clicked');
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Блокируем скролл
    });
    
    // Закрытие сайдбара при клике на overlay
    overlay.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Overlay clicked');
        closeSidebar();
    });
    
    // Закрытие сайдбара при swipe влево
    let startX = 0;
    let startY = 0;
    
    sidebar.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    sidebar.addEventListener('touchmove', function(e) {
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = startX - currentX;
        const diffY = Math.abs(startY - currentY);
        
        // Только горизонтальный swipe
        if (diffX > 50 && diffY < 100) {
            closeSidebar();
        }
    });
    
    // Закрытие при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    });
    
    function closeSidebar() {
        console.log('Closing sidebar');
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Возвращаем скролл
    }
    
    // Автозакрытие при клике на ссылку
    const sidebarLinks = sidebar.querySelectorAll('a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Sidebar link clicked:', this.href);
            // Небольшая задержка для плавности
            setTimeout(() => {
                closeSidebar();
            }, 200);
        });
    });
    
    console.log('Mobile sidebar initialized successfully!');
}

// Инициализация PWA
document.addEventListener('DOMContentLoaded', initPWA);

// УДАЛЕНО: Функция мобильной навигации - заменена на сайдбар
