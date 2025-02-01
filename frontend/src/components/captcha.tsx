import React, { useEffect, useState } from "react";
import axios from "axios";
import { useController, useFormContext } from "react-hook-form";



const Captcha: React.FC = () => {
    const { control } = useFormContext();
    const { field, fieldState } = useController({
        name: "captcha",
        control,
        defaultValue: "",
    });

    const [captchaImage, setCaptchaImage] = useState<string>("");

    useEffect(() => {
        const fetchCaptcha = async () => {
            try {
                const response = await axios.get("/api/captcha");
                if (!response.data || !response.data.data) {
                    console.error("Неверный формат ответа сервера");
                    return;
                }
                setCaptchaImage(response.data.data);
            } catch (error) {
                console.error("Ошибка при получении капчи:", error);
            }
        };
        fetchCaptcha();
    }, []);

    return (
        <div>
            <p>Введите текст с картинки:</p>
            {/* Отображаем изображение капчи */}
            <img src={captchaImage} alt="Captcha" />
            {/* Текстовое поле для ввода капчи */}
            <input type="text" {...field} />
            {/* Отображаем ошибки */}
            {fieldState.error && <div className="error">{fieldState.error.message}</div>}
        </div>
    );
};

export default Captcha;