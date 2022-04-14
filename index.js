const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const {gameOptions, againOptions} = require('./options');

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Угадай цифру от 0 до 9!`)
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;

  await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}
const start = () => {
  bot.setMyCommands([
    { command: '/start', description: "Приветствие!" },
    { command: '/info', description: 'Инфо о пользователе' },
    { command: '/game', description: 'Угадайка!' },
  ])

  bot.on('message', async (msg) => {
    console.log(msg);
    const chatId = msg.chat.id;
    if (msg.text == '/dog') {
      return bot.sendMessage(chatId, "You sent 'dog'")
    }
    if (msg.text == '/start') {
      return bot.sendMessage(chatId, "hello!")
    }
    if (msg.text == '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
    }
    if (msg.text == '/game') {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, 'Я тебя не понимаю :<');
    // bot.sendPoll(chatId, 'Is Telegram great?', [`Sure`, `Of course`])
  })

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data == chats[chatId]) {
      return bot.sendMessage(chatId, `Ты отгадал цифру ${chats[chatId]}!`, againOptions);
    } else {
      return bot.sendMessage(chatId, `Ты не угадал, бот загадал цифру ${chats[chatId]}!`, againOptions);
    }
    // bot.sendMessage(chatId, `Ты выбрал цифру ${data}`);
  })

}

start();


// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
//     bot.sendMessage(chatId, 'Привет, Друг!');
//     console.log(chatId);
//   });

//Авторассылка для зарегестрированных пользователей

// let users = []

// bot.onText(/\/register/, (msg, match) => {
//     const chatId = msg.chat.id
//     users.push(chatId)
//     console.log('user registered')
//     bot.sendMessage(chatId, 'Done.')
// })

// setInterval(function () {
//     if (users.length > 0) {
//         for (let i = 0; i < users.length; i++) {
//             bot.sendMessage(users[i], 'Is this annoying?')
//         }
//     } else {
//         console.log('no user registered')
//     }
// }, 86400)



// bot.onText(/\/echo (.+)/, (msg, match) => {

// 	const chatId = msg.chat.id
// 	const resp = match[1]

// 	bot.sendMessage(chatId, resp)
// })

// Массив с кнопками
// Конфиг клавиатуры
// const keyboard = [
//     [
//         {
//             text: 'Хочу кота', // текст на кнопке
//             callback_data: 'moreKeks' // данные для обработчика событий
//         }
//     ],
//     [
//         {
//             text: 'Хочу песика',
//             callback_data: 'morePes'
//         }
//     ],
//     [
//         {
//             text: 'Хочу ссылку в Сибирь',
//             url: 'http://www.osu.ru/' //внешняя ссылка
//         }
//     ]
// ];

// // Настройки для отправки сообщения
// let options = {
//     reply_markup: JSON.stringify({
//         // Добавляем наши кнопки
//         inline_keyboard: keyboard,
//     })
// };

// // Отслеживаем что пользователь зашёл к боту
// bot.on('message', (msg) => {
//     // Получаем индитенфикатор пользователя
//     const chatId = msg.chat.id;
//     // Отправляем пользователю сообщение
//     bot.sendMessage(chatId, 'Добрый день, чего хотите?', options);

//     // Проверка зажатия кнопки
//     bot.on('callback_query', (query) => {

//         // Путь до кнопки
//         let img = '';

//         // Проверка что нажата кнопка со значение один
//         if (query.data === "moreKeks") {
//             // Назначаем картинку
//             img = 'pictures//dD_CNVdTyFA.jpg';
//             // Текст для сообщения
//             options['caption'] = "Вот вам котик, ";
//         }

//         // Проверка что нажата кнопка со значение два
//         if (query.data === "morePes") {
//             // Назначаем картинку
//             img = 'pictures/dD_CNVdTyFA.jpg';
//             // Текст для сообщения
//             options['caption'] = "Вот вам пёсик, ";
//         }

//         // Проверка что нажата кнопка со значение два
//         if (query.data === "morePes") {
//             // Назначаем картинку
//             img = 'pictures/dD_CNVdTyFA.jpg';
//             // Текст для сообщения
//             options['caption'] = "Вот вам пёсик, ";
//         }

//         // Добавляем текст для сообщения
//         options['caption'] += "ещё что нибудь хотите?";

//         // Проверка сообщения
//         if (img) {
//             // Отправка фото
//             bot.sendPhoto(chatId, img, options);
//         }
//     });
// });