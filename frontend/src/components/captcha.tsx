import React, { useEffect } from "react";
import axios from "axios";
import { useField, useFormikContext } from 'formik';

interface FormValues {
    email: string;
    password: string;
    confirmPassword?: string; // Необязательное поле для подтверждения пароля
    captcha: string; // Текст капчи, введенный пользователем
    captchaImage: string; // Base64-изображение капчи
}
const Captcha: React.FC = () => {
    const [field, meta] = useField("captcha");
    const { setFieldValue, values } = useFormikContext<FormValues>();



    useEffect(() => {
        const fetchCaptcha = async () => {
            try {
                const response = await axios.get("/api/captcha");
                if (!response.data || !response.data.data) {
                    console.error("Неверный формат ответа сервера");
                    return;
                }
                setFieldValue("captchaImage", response.data.data);
            } catch (error) {
                console.error("Ошибка при получении капчи:", error);
            }
        };

        fetchCaptcha();
    }, [setFieldValue]);



    return (
        <div>
            <p>Введите текст с картинки:</p>
            {/* Отображаем изображение капчи */}
            <img src={values.captchaImage} alt="Captcha" />
            {/* Текстовое поле для ввода капчи */}
            <input
                type="text"
                name="captcha"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
            />
            {/* Отображаем ошибки */}
            {meta.touched && meta.error && <div className="error">{meta.error}</div>}

        </div>)
};

export default Captcha;