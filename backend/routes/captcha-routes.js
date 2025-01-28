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

  res.type('svg');
  res.status(StatusCodes.OK).send(captcha.data);
});

export default captchaRouter;
