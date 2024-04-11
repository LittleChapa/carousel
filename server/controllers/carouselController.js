const fs = require('fs')
const path = require('path');


class CarouselController {
  async getAllImages(req, res) {
    try {
      const uploadPath = path.join(__dirname, '../uploads');

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }

      const files = fs.readdirSync(uploadPath);

      return res.json(files);
    } catch (error) {
      console.error('Ошибка при получении списка изображений из карусели:', error);
      return res.status(500).json({ error: 'Произошла ошибка при получении списка изображений из карусели.' });
    }
  }

  async addImage(req, res) {
    try {
      const { img } = req.files;

      if (!img) {
        return res.status(400).json({ message: 'Файл изображения не найден' });
      }

      const fileName = Date.now() + '_' + img.name;

      img.mv(path.resolve(__dirname, '..', 'uploads', fileName));

      return res.status(201).json({ message: 'Изображение успешно добавлено в карусель' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Ошибка сервера при добавлении изображения в карусель' });
    }
  }

  async deleteImage(req, res) {
    try {
      const { imageName } = req.query;

      const imagePath = path.join(__dirname, '..', `uploads/${imageName}`);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      res.json({ message: `Изображение с именем ${imageName} успешно удалено из карусели.` });
    } catch (error) {
      console.error('Ошибка при удалении изображения из карусели:', error);
      res.status(500).json({ error: 'Произошла ошибка при удалении изображения из карусели.' });
    }
  }
}

module.exports = new CarouselController();