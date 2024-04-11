// Подключаем библиотеку Express
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const router = require('./routes');
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'uploads')));
app.use(fileUpload({}));
app.use('/api', router)
 
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});