const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Загрузка переменных окружения
require('dotenv').config();

// Форсированно устанавливаем продакшн режим если запускается на Railway
if (process.env.RAILWAY_ENVIRONMENT) {
  process.env.NODE_ENV = 'production';
}

const app = express();
const PORT = process.env.PORT || 3000;

// Логирование режима работы
console.log(`🔧 Режим работы: ${process.env.NODE_ENV || 'development'}`);
console.log(`📡 Порт: ${PORT}`);

// Настройка Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyAoxCiJH3aEfrPyjdM8eL0RvV7_U0_8OoE');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.session.user.username + '_' + Date.now() + ext);
  }
});
const upload = multer({ storage: storage });

// Настройка middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'razgrom-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production' && process.env.COOKIE_SECURE === 'true',
    maxAge: 24 * 60 * 60 * 1000 // 24 часа
  }
}));

// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Функции для работы с JSON файлами
function readJSONFile(filename) {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return filename.includes('users') ? {} : [];
  }
}

function writeJSONFile(filename, data) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

// Простая функция хеширования (MD5 для вида)
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

// Middleware для проверки авторизации
function requireAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Создание необходимых папок и файлов при запуске
function initializeProject() {
  const dirs = ['public/uploads', 'data'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Инициализация JSON файлов
  if (!fs.existsSync('data/users.json')) {
    writeJSONFile('data/users.json', {});
  }
  if (!fs.existsSync('data/messages.json')) {
    writeJSONFile('data/messages.json', []);
  }  if (!fs.existsSync('data/chronicle.json')) {
    writeJSONFile('data/chronicle.json', [
      {
        id: 1,
        date: '2025-06-23',
        title: 'Начало Проекта Разгром',
        description: 'Первый день нашего тайного сообщества. Система запущена и готова к работе.',
        category: 'СИСТЕМА'
      },
      {
        id: 2,
        date: '2025-06-23',
        title: 'Мобильная оптимизация',
        description: 'Добавлен адаптивный дизайн и мобильный сайдбар для удобства использования.',
        category: 'ОБНОВЛЕНИЕ'
      },
      {
        id: 3,
        date: '2025-06-23',
        title: 'AI генераторы активированы',
        description: 'Все генераторы теперь используют искусственный интеллект для создания уникального контента.',
        category: 'ФУНКЦИЯ'
      }
    ]);
  }
}

// Маршруты

// Главная страница
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

// Регистрация
app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  
  console.log('Registration attempt:', { username, password: '***' });
  
  if (!username || !password) {
    return res.render('register', { error: 'Все поля обязательны!' });
  }

  const users = readJSONFile('data/users.json');
  
  if (users[username]) {
    return res.render('register', { error: 'Такой боец уже существует!' });
  }

  const hashedPassword = hashPassword(password);
  console.log('Creating user with hashed password:', hashedPassword);

  users[username] = {
    username: username,
    password: hashedPassword,
    fightName: '',
    bio: '',
    photo: '',
    achievements: [],
    rating: 0,
    joinDate: new Date().toISOString()
  };

  writeJSONFile('data/users.json', users);
  console.log('User registered successfully:', username);
  res.redirect('/login');
});

// Вход
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readJSONFile('data/users.json');
  
  console.log('Login attempt:', { username, password: '***' });
  console.log('User exists:', !!users[username]);
  
  if (users[username]) {
    const inputPasswordHash = hashPassword(password);
    const storedPasswordHash = users[username].password;
    console.log('Password hashes:', { 
      input: inputPasswordHash, 
      stored: storedPasswordHash,
      match: inputPasswordHash === storedPasswordHash 
    });
    
    if (storedPasswordHash === inputPasswordHash) {
      req.session.user = users[username];
      console.log('Login successful for:', username);
      res.redirect('/dashboard');
    } else {
      console.log('Password mismatch for:', username);
      res.render('login', { error: 'Неверные данные для входа!' });
    }
  } else {
    console.log('User not found:', username);
    res.render('login', { error: 'Неверные данные для входа!' });
  }
});

// Выход
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Панель управления
app.get('/dashboard', requireAuth, (req, res) => {
  const users = readJSONFile('data/users.json');
  const messages = readJSONFile('data/messages.json');
  
  res.render('dashboard', { 
    user: req.session.user,
    totalUsers: Object.keys(users).length,
    totalMessages: messages.length
  });
});

// Профиль пользователя
app.get('/profile/:username', requireAuth, (req, res) => {
  const users = readJSONFile('data/users.json');
  const profile = users[req.params.username];
  
  if (!profile) {
    return res.status(404).send('Боец не найден!');
  }

  const isOwner = req.session.user.username === req.params.username;
  res.render('profile', { user: req.session.user, profile, isOwner });
});

// Обновление профиля
app.post('/profile/:username', requireAuth, upload.single('photo'), (req, res) => {
  if (req.session.user.username !== req.params.username) {
    return res.status(403).send('Доступ запрещен!');
  }

  const users = readJSONFile('data/users.json');
  const { fightName, bio } = req.body;
  
  users[req.params.username].fightName = fightName || '';
  users[req.params.username].bio = bio || '';
  
  if (req.file) {
    users[req.params.username].photo = req.file.filename;
  }

  writeJSONFile('data/users.json', users);
  req.session.user = users[req.params.username];
  
  res.redirect(`/profile/${req.params.username}`);
});

// Добавление достижения
app.post('/add-achievement', requireAuth, (req, res) => {
  const { achievement } = req.body;
  const users = readJSONFile('data/users.json');
  
  if (!users[req.session.user.username].achievements) {
    users[req.session.user.username].achievements = [];
  }
  
  users[req.session.user.username].achievements.push({
    id: Date.now(),
    text: achievement,
    date: new Date().toISOString()
  });

  writeJSONFile('data/users.json', users);
  req.session.user = users[req.session.user.username];
  
  res.redirect(`/profile/${req.session.user.username}`);
});

// Боевой журнал
app.get('/journal', requireAuth, (req, res) => {
  const messages = readJSONFile('data/messages.json');
  res.render('journal', { user: req.session.user, messages: messages.reverse() });
});

app.post('/journal', requireAuth, (req, res) => {
  const { message, anonymous } = req.body;
  const messages = readJSONFile('data/messages.json');
  
  const newMessage = {
    id: Date.now(),
    text: message,
    author: anonymous ? null : req.session.user.username,
    timestamp: new Date().toISOString()
  };

  messages.push(newMessage);
  writeJSONFile('data/messages.json', messages);
  
  res.redirect('/journal');
});

// Рейтинг
app.get('/rating', requireAuth, (req, res) => {
  const users = readJSONFile('data/users.json');
  const usersList = Object.values(users).sort((a, b) => (b.rating || 0) - (a.rating || 0));
  
  res.render('rating', { user: req.session.user, users: usersList });
});

app.post('/vote/:username', requireAuth, (req, res) => {
  if (req.session.user.username === req.params.username) {
    return res.json({ error: 'Нельзя голосовать за себя!' });
  }

  const users = readJSONFile('data/users.json');
  
  if (!users[req.params.username]) {
    return res.json({ error: 'Пользователь не найден!' });
  }

  users[req.params.username].rating = (users[req.params.username].rating || 0) + 1;
  writeJSONFile('data/users.json', users);
  
  res.json({ success: true, newRating: users[req.params.username].rating });
});

// Развлечения
app.get('/fun', requireAuth, (req, res) => {
  res.render('fun', { user: req.session.user });
});

// Хроника
app.get('/chronicle', requireAuth, (req, res) => {
  const chronicle = readJSONFile('data/chronicle.json');
  res.render('chronicle', { user: req.session.user, events: chronicle });
});

// API для генератора заданий
app.get('/api/random-task', requireAuth, async (req, res) => {
  try {
    const prompt = `Сгенерируй одно безумное, веселое и слегка неадекватное задание для друзей в интернете. 
    Задание должно быть:
    - Смешным и немного матерным (но не слишком)
    - Необходимо взаимоействие с людьми, желательно с одним незнакомым человеком
    - Очень абсурдным, но не в том плане что "единороги", а чтобы человек поучувствовал себя неуютно или сбитым с толку 
    - В стиле "Проект Разгром" - тайного анархического клуба 
    - Не зацикливайся на убеждении людей, важно именно сбить столку а не выставить себя идиотом
    
    Примеры стиля: "Внезапно объяви всем вокруг, что вы участвуете в молчаливом конкурсе на самый длинный взгляд." "Отключи все видимые часы в радиусе доступа." "Положи случайный объект в совершенно нелогичное место, откуда его невозможно будет убрать." "Когда кто-то спрашивает "Как дела?", ответь, что ты только что изобрел новый способ дышать." "Постоянно переставляй чужие вещи на рабочем месте на один сантиметр." "При каждой встрече с одним и тем же человеком меняй свое имя." "Посреди толпы начни шептать "Они знают о цветах"."
    
    Ответь ТОЛЬКО текстом задания, без кавычек и дополнительных слов.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const task = response.text().trim();
    
    res.json({ task: task });
  } catch (error) {
    console.error('Ошибка Gemini API:', error);
    // Fallback на статические задания
    const fallbackTasks = [
      "Сделай фото того, что ешь прямо сейчас",
      "Найди самую странную вещь в своей комнате и опиши её",
      "Покажи своё рабочее место или любимый уголок дома"
    ];
    const randomTask = fallbackTasks[Math.floor(Math.random() * fallbackTasks.length)];
    res.json({ task: randomTask });
  }
});

// API для генератора фактов
app.get('/api/random-fact', requireAuth, async (req, res) => {
  try {
    const prompt = `Сгенерируй один безумный, ироничный и матерный факт о фильме "Бойцовский клуб" или современной жизни. 
    Факт должен быть:
    - Максимально ироничным и современным (Gen Alpha humor)
    - Немного абсурдным но правдоподобным
    - С юмором и легким матом
    - В стиле постиронии и мемов
    
    Примеры стиля: "Твйно Дернул изначально хотел создать криптовалюту, но передумал", "В оригинале фильма было больше рофлов, но цензура вырезала", "Актеры дрались по-настоящему, потому что каскадеры были слишком дорогие для нулевых"
    
    Ответь ТОЛЬКО текстом факта, без кавычек и дополнительных слов.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const fact = response.text().trim();
    
    res.json({ fact: fact });
  } catch (error) {
    console.error('Ошибка Gemini API:', error);
    // Fallback на статические факты
    const fallbackFacts = [
      "Тайно Дернул - это псевдоним, который звучит как ник геймера 2000-х.",
      "В фильме есть скрытые кадры, которые теперь разбирают тиктокеры.",
      "Финальная сцена взрыва обошлась дешевле, чем реклама в инстаграме."
    ];
    const randomFact = fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];
    res.json({ fact: randomFact });
  }
});

// API для генератора цитат
app.get('/api/random-quote', requireAuth, async (req, res) => {
  try {
    const prompt = `Сгенерируй одну ироничную, мемную цитату в стиле "Бойцовского клуба" но с современным Gen Alpha юмором.
    Цитата должна быть:
    - Максимально постироничной и не кринжовой
    - С современным сленгом и мемами
    - Философской но максимально абсурдной
    - Немного матерной (можно  перебарщивать)
    
    Примеры стиля: "Ты не твой банковский счёт в банке, ты пидор", "Первое правило тикток-хауса: никому не рассказывать про тикток-хаус", "Мы целое поколение обслуживающих не мак, а доширак"
    
    Ответь ТОЛЬКО текстом цитаты, без кавычек и дополнительных слов.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const quote = response.text().trim();
    
    res.json({ quote: quote });
  } catch (error) {
    console.error('Ошибка Gemini API:', error);
    // Fallback на статические цитаты
    const fallbackQuotes = [
      "Ты не твой банковский счёт в Сбербанке, ты твоя коллекция мемов.",
      "Первое правило тикток-хауса: никому не рассказывать про тикток-хаус.",
      "Мы целое поколение обслуживающих не мак, а доширак."
    ];
    const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    res.json({ quote: randomQuote });
  }
});

// API для генератора боевых имен
app.get('/api/random-name', requireAuth, async (req, res) => {
  try {
    const prompt = `Сгенерируй одно безумное, ироничное "боевое имя" для участника тайного клуба в стиле Gen Alpha.
    Имя должно быть:
    - Максимально абсурдным и смешным
    - Современным и мемным
    - Матерным (но креативно)
    - В стиле интернет-культуры и мемов
    
    Примеры стиля: "Пенис", "Негр", "Зумер Разрушитель", "але", "Сигма Мужик", "Чел Который"
    
    Ответь ТОЛЬКО текстом имени, без кавычек и дополнительных слов.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const name = response.text().trim();
    
    res.json({ name: name });
  } catch (error) {
    console.error('Ошибка Gemini API:', error);
    // Fallback на статические имена
    const fallbackNames = [
      "Крипипастович",
      "Дед Инсайд", 
      "Зумер Разрушитель",
      "Анкл Бенс",
      "Сигма Мужик"
    ];
    const randomName = fallbackNames[Math.floor(Math.random() * fallbackNames.length)];
    res.json({ name: randomName });
  }
});

// Запуск сервера
initializeProject();

app.listen(PORT, () => {
  console.log(`🥊 Проект Разгром запущен на порту ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 Сайт доступен по Railway URL`);
    console.log(`✅ Продакшн режим активирован`);
  } else {
    console.log(`🌐 Открой браузер: http://localhost:${PORT}`);
    console.log(`🔧 Режим разработки`);
  }
});
