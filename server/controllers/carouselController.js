const fs = require('fs')
const path = require('path');


class CarouselController {
  // Метод для получения списка всех изображений в карусели
  async getAllImages(req, res) {
    try {
      // Путь к папке с загруженными изображениями на сервере
      const uploadPath = path.join(__dirname, '../uploads');

      // Получаем список файлов в папке uploads
      const files = fs.readdirSync(uploadPath);

      // Проверяем, существует ли папка для загруженных изображений, и если нет, создаем ее
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }

      // Возвращаем список файлов (изображений) в ответе
      return res.json(files);
    } catch (error) {
      console.error('Ошибка при получении списка изображений из карусели:', error);
      return res.status(500).json({ error: 'Произошла ошибка при получении списка изображений из карусели.' });
    }
  }

  async addImage(req, res) {
    try {
      const { img } = req.files;

      // Проверяем, есть ли файл в запросе
      if (!img) {
        return res.status(400).json({ message: 'Файл изображения не найден' });
      }

      // Генерируем уникальное имя для файла
      const fileName = Date.now() + '_' + img.name;

      // Сохраняем файл на сервере
      img.mv(path.resolve(__dirname, '..', 'uploads', fileName));

      // Возвращаем успешный статус и сообщение об успешном добавлении
      return res.status(201).json({ message: 'Изображение успешно добавлено в карусель' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Ошибка сервера при добавлении изображения в карусель' });
    }
  }

  // Метод для удаления изображения из карусели
  async deleteImage(req, res) {
    try {
      const { imageName } = req.query;

      // Путь к файлу изображения на сервере
      const imagePath = path.join(__dirname, '..', `uploads/${imageName}`);

      // Проверяем, существует ли файл изображения
      if (fs.existsSync(imagePath)) {
        // Удаляем файл изображения
        fs.unlinkSync(imagePath);
      }

      // Возвращаем успешный статус и сообщение об успешном удалении
      res.json({ message: `Изображение с именем ${imageName} успешно удалено из карусели.` });
    } catch (error) {
      console.error('Ошибка при удалении изображения из карусели:', error);
      res.status(500).json({ error: 'Произошла ошибка при удалении изображения из карусели.' });
    }
  }
}

module.exports = new CarouselController();