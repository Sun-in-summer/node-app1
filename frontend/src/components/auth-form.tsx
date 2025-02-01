import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Captcha from "./captcha";
import { UserRegisterData, UserLoginData } from '../types/user-types';

interface AuthFormProps {
    isRegister: boolean;
    onSubmit: (values: UserRegisterData | UserLoginData) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isRegister, onSubmit }) => {
    const initialValues = isRegister
        ? {
            email: "",
            password: "",
            confirmPassword: "",
            captcha: "",
        }
        : {
            email: "",
            password: "",
            captcha: "",
        };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Некорректный email")
            .required("Email обязателен"),
        password: Yup.string()
            .min(8, "Пароль должен содержать минимум 8 символов")
            .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, "Пароль должен содержать заглавную букву, цифру и спецсимвол")
            .required("Пароль обязателен"),
        confirmPassword: isRegister
            ? Yup.string()
                .oneOf([Yup.ref("password") as Yup.Reference<string>], "Пароли не совпадают")
                .required("Подтвердите пароль")
            : Yup.string(),
        captcha: Yup.string().required("Капча обязательна"),
    });

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => onSubmit(values)}
        >
            {({ errors, touched }) => (
                <Form>
                    <div>
                        <label htmlFor="email">Email</label>
                        <Field type="email" name="email" />
                        {errors.email && touched.email && (
                            <div className="error">{errors.email}</div>)}
                    </div>

                    <div>
                        <label htmlFor="password">Пароль</label>
                        <Field type="password" name="password" />
                        {errors.password && touched.password && (
                            <div className="error">{errors.password}</div>)}
                    </div>

                    {isRegister && (
                        <div>
                            <label htmlFor="confirmPassword">Подтверждение пароля</label>
                            <Field type="password" name="confirmPassword" />
                            {errors.confirmPassword && touched.confirmPassword && (
                                <div className="error">{errors.confirmPassword}</div>
                            )}
                        </div>
                    )}

                    <Captcha />

                    <button type="submit">{isRegister ? "Зарегистрироваться" : "Войти"}</button>
                </Form>
            )}
        </Formik>
    );
};

export default AuthForm;