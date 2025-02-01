import React, { useState, useEffect } from "react";
import axios from "axios";
import { ErrorMessage } from 'formik';

const Captcha: React.FC = () => {
    const [captchaData, setCaptchaData] = useState<string>("");


    useEffect(() => {
        const fetchCaptcha = async () => {
            try {
                const response = await axios.get("/api/captcha");
                if (!response.data || !response.data.data) {
                    console.error("Неверный формат ответа сервера");
                    return;
                }
                setCaptchaData(response.data.data); // Получаем Base64-строку
            } catch (error) {
                console.error("Ошибка при получении капчи:", error);
            }
        };

        fetchCaptcha();
    }, []);

    

    return (
        <div>
            <p>Введите текст с картинки:</p>
            {captchaData ? (
                <img src={captchaData} alt="Captcha" />
            ) : (
                <div>Загрузка...</div>
            )}
            <input type="text" name="captcha" />
            <ErrorMessage name="captcha" component="div" className="error" />
        </div>
    );
};

export default Captcha;