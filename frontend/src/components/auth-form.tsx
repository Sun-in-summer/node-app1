import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Captcha from "./captcha";

// Типы данных для регистрации и входа (всё верно)
interface UserRegisterData {
    email: string;
    password: string;
    confirmPassword: string;
    captcha: string;
}

interface UserLoginData {
    email: string;
    password: string;
    captcha: string;
}

interface AuthFormProps {
    isRegister: boolean;
    onSubmit: (values: UserRegisterData | UserLoginData) => void;
}

type FormData = {
    email: string;
    password: string;
    captcha: string;
} & (AuthFormProps["isRegister"] extends true
    ? { confirmPassword: string }
    : { confirmPassword?: never });

// Обратите внимание: условный тип z.object внутри schema должен учитывать поле confirmPassword только при регистрации
const schema = (isRegister: boolean) => z.object({
    email: z.string().email("Некорректный email").nonempty("Email обязателен"),
    password: z.string()
        .min(8, "Пароль должен содержать минимум 8 символов")
        .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, "Пароль должен содержать заглавную букву, цифру и спецсимвол"),
    confirmPassword: isRegister ? z.string().min(1, "Подтверждение пароля обязательно") : z.undefined(),
    captcha: z.string().nonempty("Капча обязательна"),
}).superRefine((data, context) => {
    if (isRegister && data.confirmPassword !== data.password) {
        context.addIssue({
            path: ["confirmPassword"],
            code: z.ZodIssueCode.custom,
            message: "Пароли не совпадают"
        });
    }
});

const AuthForm: React.FC<AuthFormProps> = ({ isRegister, onSubmit }) => {


    const methods = useForm<FormData>({
        resolver: zodResolver(schema(isRegister)),
    });

    const { register, handleSubmit, formState: { errors } } = methods;



    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" {...register("email")} />
                    {errors.email && <div className="error">{String(errors.email.message)}</div>}
                </div>
                <div>
                    <label htmlFor="password">Пароль</label>
                    <input type="password" {...register("password")} />
                    {errors.password && <div className="error">{String(errors.password.message)}</div>}
                </div>
                {isRegister && (
                    <div>
                        <label htmlFor="confirmPassword">Подтверждение пароля</label>
                        <input type="password" {...register("confirmPassword")} />
                        {errors.confirmPassword?.message && (
                            <div className="error">{String(errors.confirmPassword.message)}</div>
                        )}
                    </div>
                )}
                <Captcha />
                <button type="submit">{isRegister ? "Зарегистрироваться" : "Войти"}</button>
            </form>
        </FormProvider>
    );
};

export default AuthForm;