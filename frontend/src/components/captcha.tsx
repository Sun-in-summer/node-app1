import React, { useState, useEffect } from "react";
import axios from "axios";
import { ErrorMessage } from 'formik';

const Captcha: React.FC = () => {
    const [captchaValue, setCaptchaValue] = useState<string>("");
   

    useEffect(() => {
        const generateCaptcha = async () => {
            try {
                const response = await axios.get("/api/captcha/generate");
                setCaptchaValue(response.data.value);
            } catch (error) {
                console.error("Ошибка при получении капчи:", error);
            }
        };

        generateCaptcha();
    }, []);

    return (
        <div>
            <p>Введите текст с картинки:</p>
            <img src={`/api/captcha/image?value=${encodeURIComponent(captchaValue)}`} alt="Captcha" />
            <input type="text" name="captcha" />
            <ErrorMessage name="captcha" component="div" className="error" />
        </div>
    );
};

export default Captcha;