import AuthForm from "../components/auth-form";
import axios from "axios";
import { UserRegisterData } from '../types/user-types';
import { RegisterResponse } from '../types/response-types';



const RegisterPage: React.FC = () => {
    const handleRegister = async (values: UserRegisterData) => {
        console.log("REGISTER");
        try {
            await axios.post<RegisterResponse>("/api/auth/register", values);
            alert("Регистрация успешна!");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Произошла ошибка при регистрации";
                alert(`Ошибка регистрации: ${message}`);
            } else {
                console.error("Неизвестная ошибка:", error);
                alert("Произошла неизвестная ошибка при регистрации");
            }
        }
    };

    return (
        <div>
            <h2>Регистрация</h2>
            <AuthForm isRegister={true} onSubmit={handleRegister} />
        </div>
    );
};

export default RegisterPage;