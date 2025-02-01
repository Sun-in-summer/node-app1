import AuthForm from "../components/auth-form";
import axios from "axios";
import { LoginResponse } from '../types/response-types';
import { UserLoginData } from '../types/user-types';

const LoginPage: React.FC = () => {
    const handleLogin = async (values: UserLoginData) => {
        console.log('LOGIN!!')
        try {
            await axios.post<LoginResponse>("/api/auth/login", values);
            alert("Авторизация успешна!");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Произошла ошибка при авторизации";
                alert(`Ошибка авторизации: ${message}`);
            } else {
                console.error("Неизвестная ошибка:", error);
                alert("Произошла неизвестная ошибка при авторизации");
            }
        }
    };

    return (
        <div>
            <h2>Вход</h2>
            <AuthForm isRegister={false} onSubmit={handleLogin} />
        </div>
    );
};

export default LoginPage;