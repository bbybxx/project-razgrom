// JavaScript для страницы развлечений

document.addEventListener('DOMContentLoaded', function() {
    initTaskGenerator();
    initCipher();
    initFactGenerator();
    initNameGenerator();
    initChaosCounter();
    initQuoteGenerator();
});

// Генератор заданий
function initTaskGenerator() {
    const generateBtn = document.getElementById('generate-task-btn');
    const taskDisplay = document.getElementById('random-task-display');
    
    if (generateBtn && taskDisplay) {
        generateBtn.addEventListener('click', async function() {
            this.disabled = true;
            this.textContent = 'ГЕНЕРАЦИЯ...';
            
            try {
                const response = await fetch('/api/random-task');
                const data = await response.json();
                
                // Эффект печатания
                taskDisplay.innerHTML = '<p style="color: #ff4444;">ЗАДАНИЕ ПОЛУЧЕНО:</p>';
                await typeWriterAsync(taskDisplay, data.task, 50);
                
            } catch (error) {
                taskDisplay.innerHTML = '<p style="color: #ff0000;">ОШИБКА СВЯЗИ С ЦЕНТРОМ УПРАВЛЕНИЯ</p>';
            } finally {
                this.disabled = false;
                this.textContent = 'СГЕНЕРИРОВАТЬ ЗАДАНИЕ';
            }
        });
    }
}

// Система шифрования
function initCipher() {
    window.encryptMessage = function() {
        const input = document.getElementById('cipher-input');
        const output = document.getElementById('cipher-output');
        
        if (!input.value.trim()) {
            output.innerHTML = '<p style="color: #ff4444;">ВВЕДИ ТЕКСТ ДЛЯ ШИФРОВАНИЯ</p>';
            return;
        }
        
        const encrypted = rot13(input.value);
        output.innerHTML = `
            <p style="color: #00ff00; font-weight: bold;">ЗАШИФРОВАНО:</p>
            <div style="background: rgba(0,255,0,0.1); padding: 10px; margin-top: 10px; word-break: break-all;">
                ${encrypted}
            </div>
        `;
    };
    
    window.decryptMessage = function() {
        const input = document.getElementById('cipher-input');
        const output = document.getElementById('cipher-output');
        
        if (!input.value.trim()) {
            output.innerHTML = '<p style="color: #ff4444;">ВВЕДИ ЗАШИФРОВАННЫЙ ТЕКСТ</p>';
            return;
        }
        
        const decrypted = rot13(input.value); // ROT13 сам себе обратный
        output.innerHTML = `
            <p style="color: #00ffff; font-weight: bold;">РАСШИФРОВАНО:</p>
            <div style="background: rgba(0,255,255,0.1); padding: 10px; margin-top: 10px; word-break: break-all;">
                ${decrypted}
            </div>
        `;
    };
}

// Генератор фактов
function initFactGenerator() {
    const generateBtn = document.getElementById('generate-fact-btn');
    const factDisplay = document.getElementById('random-fact-display');
    
    if (generateBtn && factDisplay) {
        generateBtn.addEventListener('click', async function() {
            this.disabled = true;
            this.textContent = 'ГЕНЕРАЦИЯ...';
            
            try {
                const response = await fetch('/api/random-fact');
                const data = await response.json();
                
                factDisplay.innerHTML = '<p style="color: #ff4444;">ЗАГРУЗКА ФАКТА...</p>';
                
                setTimeout(() => {
                    factDisplay.innerHTML = `
                        <div style="color: #fff; font-size: 1.1rem; line-height: 1.6;">
                            <div style="color: #ff4444; font-weight: bold; margin-bottom: 10px;">📚 ИНТЕРЕСНЫЙ ФАКТ:</div>
                            ${data.fact}
                        </div>
                    `;
                }, 300);
                
            } catch (error) {
                factDisplay.innerHTML = '<p style="color: #ff0000;">ОШИБКА ЗАГРУЗКИ ФАКТА</p>';
            } finally {
                this.disabled = false;
                this.textContent = 'СГЕНЕРИРОВАТЬ ФАКТ';
            }
        });
    }
}

// Генератор боевых имен
function initNameGenerator() {
    const generateBtn = document.getElementById('generate-name-btn');
    const nameDisplay = document.getElementById('fight-name-display');
    
    if (generateBtn && nameDisplay) {
        generateBtn.addEventListener('click', async function() {
            this.disabled = true;
            this.textContent = 'ГЕНЕРАЦИЯ...';
            
            try {
                const response = await fetch('/api/random-name');
                const data = await response.json();
                
                nameDisplay.innerHTML = '<p style="color: #ff4444;">ГЕНЕРАЦИЯ ИМЕНИ...</p>';
                
                setTimeout(() => {
                    nameDisplay.innerHTML = `
                        <div style="text-align: center;">
                            <div style="color: #ff4444; font-weight: bold; margin-bottom: 15px;">⚔️ ТВОЕ БОЕВОЕ ИМЯ:</div>
                            <div style="color: #fff; font-size: 1.5rem; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
                                ${data.name}
                            </div>
                            <div style="color: #888; font-size: 0.9rem; margin-top: 10px; font-style: italic;">
                                "Пусть этот мир запомнит это имя"
                            </div>
                        </div>
                    `;
                }, 500);
                
            } catch (error) {
                nameDisplay.innerHTML = '<p style="color: #ff0000;">ОШИБКА ГЕНЕРАЦИИ ИМЕНИ</p>';
            } finally {
                this.disabled = false;
                this.textContent = 'СГЕНЕРИРОВАТЬ ИМЯ';
            }
        });
    }
}

// Счетчик хаоса
function initChaosCounter() {
    const chaosBtn = document.getElementById('chaos-btn');
    const chaosNumber = document.getElementById('chaos-number');
    const chaosStatus = document.getElementById('chaos-status');
    
    let chaosLevel = parseInt(localStorage.getItem('chaosLevel')) || 0;
    chaosNumber.textContent = chaosLevel;
    updateChaosStatus(chaosLevel);
    
    if (chaosBtn) {
        chaosBtn.addEventListener('click', function() {
            chaosLevel++;
            localStorage.setItem('chaosLevel', chaosLevel);
            
            // Анимация увеличения числа
            animateNumberIncrease(chaosNumber, chaosLevel);
            updateChaosStatus(chaosLevel);
            
            // Визуальные эффекты
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            // Случайные эффекты при высоком уровне хаоса
            if (chaosLevel > 50) {
                randomChaosEffect();
            }
        });
    }
    
    function updateChaosStatus(level) {
        let status;
        let color;
        
        if (level === 0) {
            status = "Все спокойно...";
            color = "#666";
        } else if (level < 10) {
            status = "Легкое беспокойство в воздухе";
            color = "#888";
        } else if (level < 25) {
            status = "Хаос набирает обороты";
            color = "#ffaa00";
        } else if (level < 50) {
            status = "Ситуация выходит из под контроля!";
            color = "#ff6600";
        } else if (level < 100) {
            status = "ПОЛНЫЙ ХАОС! АНАРХИЯ БЛИЗКО!";
            color = "#ff4444";
        } else {
            status = "🔥 АБСОЛЮТНАЯ АНАРХИЯ! МИР ГОРИТ! 🔥";
            color = "#ff0000";
        }
        
        chaosStatus.textContent = status;
        chaosStatus.style.color = color;
        
        if (level > 25) {
            chaosStatus.style.animation = 'glitch 1s infinite';
        }
    }
    
    function randomChaosEffect() {
        const effects = [
            () => document.body.style.filter = 'hue-rotate(180deg)',
            () => document.body.style.animation = 'glitch 0.5s',
            () => {
                const elements = document.querySelectorAll('*');
                elements.forEach(el => {
                    if (Math.random() < 0.1) {
                        el.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
                    }
                });
            }
        ];
        
        const effect = effects[Math.floor(Math.random() * effects.length)];
        effect();
        
        setTimeout(() => {
            document.body.style.filter = '';
            document.body.style.animation = '';
            document.querySelectorAll('*').forEach(el => {
                el.style.transform = '';
            });
        }, 1000);
    }
}

// Генератор цитат
function initQuoteGenerator() {
    const generateBtn = document.getElementById('generate-quote-btn');
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    
    if (generateBtn && quoteText && quoteAuthor) {
        generateBtn.addEventListener('click', async function() {
            this.disabled = true;
            this.textContent = 'ГЕНЕРАЦИЯ...';
            
            try {
                const response = await fetch('/api/random-quote');
                const data = await response.json();
                
                // Анимация загрузки
                quoteText.textContent = "Загрузка мудрости...";
                quoteAuthor.textContent = "";
                
                setTimeout(() => {
                    quoteText.textContent = data.quote;
                    quoteAuthor.textContent = "— Твйно Дернул";
                    
                    // Анимация появления
                    quoteText.style.opacity = '0';
                    quoteAuthor.style.opacity = '0';
                    
                    setTimeout(() => {
                        quoteText.style.transition = 'opacity 0.5s ease';
                        quoteAuthor.style.transition = 'opacity 0.5s ease';
                        quoteText.style.opacity = '1';
                        quoteAuthor.style.opacity = '1';
                    }, 100);
                }, 300);
                
            } catch (error) {
                quoteText.textContent = "Ошибка загрузки мудрости...";
                quoteAuthor.textContent = "";
            } finally {
                this.disabled = false;
                this.textContent = 'НОВАЯ ЦИТАТА';
            }
        });
    }
}

// Вспомогательные функции

// ROT13 шифрование
function rot13(str) {
    return str.replace(/[a-zA-Zа-яА-Я]/g, function(char) {
        if (char >= 'a' && char <= 'z') {
            return String.fromCharCode((char.charCodeAt(0) - 97 + 13) % 26 + 97);
        } else if (char >= 'A' && char <= 'Z') {
            return String.fromCharCode((char.charCodeAt(0) - 65 + 13) % 26 + 65);
        } else if (char >= 'а' && char <= 'я') {
            return String.fromCharCode((char.charCodeAt(0) - 1072 + 13) % 33 + 1072);
        } else if (char >= 'А' && char <= 'Я') {
            return String.fromCharCode((char.charCodeAt(0) - 1040 + 13) % 33 + 1040);
        }
        return char;
    });
}

// Асинхронный эффект печатания
function typeWriterAsync(element, text, speed = 50) {
    return new Promise((resolve) => {
        const currentHTML = element.innerHTML;
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.innerHTML = currentHTML + '<p style="color: #fff; font-size: 1.1rem; line-height: 1.6;">' + text.substring(0, i + 1) + '</p>';
                i++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        
        type();
    });
}

// Анимация увеличения числа
function animateNumberIncrease(element, targetValue) {
    const startValue = targetValue - 1;
    const duration = 500;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        const currentValue = Math.floor(startValue + progress);
        element.textContent = currentValue;
        
        // Эффект масштабирования
        const scale = 1 + (Math.sin(progress * Math.PI) * 0.2);
        element.style.transform = `scale(${scale})`;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.style.transform = 'scale(1)';
        }
    }
    
    requestAnimationFrame(update);
}

// Пасхальное яйцо для страницы развлечений
let secretSequence = '';
document.addEventListener('keypress', function(e) {
    secretSequence += e.key.toLowerCase();
    
    if (secretSequence.includes('chaos')) {
        activateChaosMode();
        secretSequence = '';
    }
    
    if (secretSequence.length > 10) {
        secretSequence = secretSequence.slice(-10);
    }
});

function activateChaosMode() {
    document.body.style.animation = 'glitch 0.1s infinite';
    
    const message = document.createElement('div');
    message.style.position = 'fixed';
    message.style.top = '0';
    message.style.left = '0';
    message.style.width = '100%';
    message.style.height = '100%';
    message.style.background = 'rgba(255, 0, 0, 0.8)';
    message.style.display = 'flex';
    message.style.alignItems = 'center';
    message.style.justifyContent = 'center';
    message.style.fontSize = '4rem';
    message.style.color = '#fff';
    message.style.fontFamily = 'Courier Prime, monospace';
    message.style.textAlign = 'center';
    message.style.zIndex = '9999';
    message.style.animation = 'glitch 0.2s infinite';
    message.innerHTML = '🔥 CHAOS MODE ACTIVATED 🔥';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        document.body.style.animation = '';
        message.remove();
    }, 3000);
}
