import express from 'express';
import { StatusCodes } from 'http-status-codes';
import svgCaptcha from 'svg-captcha';

const captchaRouter = express.Router();

captchaRouter.get('/', (req, res) => {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 2,
    color: true,
    background: '#cc9966',
  });

  req.session.captcha = captcha.text;

  const base64Data = `data:image/svg+xml;base64,${Buffer.from(
    captcha.data
  ).toString('base64')}`;

  // res.type('svg');
  // res.status(StatusCodes.OK).send(captcha.data);
  res.type('application/json'); // Устанавливаем тип контента как JSON
  res.status(200).json({
    text: captcha.text, // Текст капчи
    data: base64Data, // Base64-представление SVG
  });
});

export default captchaRouter;
