# 🚀 Инструкция по деплою проекта "Разгром"

## Вариант 1: Railway (Рекомендуется) - БЕСПЛАТНО

### 1. Подготовка
1. Зарегистрируйтесь на [Railway.app](https://railway.app)
2. Подключите свой GitHub аккаунт
3. Создайте новый репозиторий на GitHub и загрузите туда код

### 2. Деплой
1. В Railway нажмите "New Project"
2. Выберите "Deploy from GitHub repo"
3. Выберите ваш репозиторий
4. Railway автоматически определит Node.js приложение

### 3. Настройка переменных окружения
В разделе Variables добавьте:
```
GEMINI_API_KEY=ваш_ключ_gemini_api
SESSION_SECRET=супер_секретный_ключ_для_сессий
NODE_ENV=production
COOKIE_SECURE=true
```

### 4. Домен
Railway автоматически выдаст домен типа: `your-app-name.up.railway.app`

---

## Вариант 2: Render - БЕСПЛАТНО

### 1. Подготовка
1. Зарегистрируйтесь на [Render.com](https://render.com)
2. Подключите GitHub аккаунт

### 2. Деплой
1. Создайте "New Web Service"
2. Подключите GitHub репозиторий
3. Build Command: `npm install`
4. Start Command: `npm start`

### 3. Переменные окружения
Добавьте в Environment Variables:
```
GEMINI_API_KEY=ваш_ключ
SESSION_SECRET=секретный_ключ
NODE_ENV=production
```

---

## Вариант 3: Vercel (только для статики, нужны изменения)

Vercel лучше подходит для фронтенда, но можно использовать Vercel Functions.

---

## ⚠️ Важные моменты

### 1. База данных
Сейчас используются JSON файлы. Для продакшена рекомендуется:
- MongoDB Atlas (бесплатно)
- PostgreSQL на Railway
- Firebase Firestore

### 2. Файлы загрузок
- На продакшене используйте cloud storage (Cloudinary, AWS S3)
- Локальные файлы не сохраняются при перезапуске

### 3. API ключи
- Никогда не коммитьте .env файлы
- Используйте переменные окружения хостинга

### 4. Безопасность
- Смените SESSION_SECRET на случайную строку
- Включите HTTPS на продакшене
- Настройте CORS при необходимости

---

## 🔧 Команды для деплоя

```bash
# 1. Подготовка кода
git init
git add .
git commit -m "Initial commit"

# 2. Создание репозитория на GitHub
# (через веб-интерфейс GitHub)

# 3. Загрузка кода
git remote add origin https://github.com/ваш-username/razgrom.git
git push -u origin main
```

После этого можно деплоить через Railway или Render!
