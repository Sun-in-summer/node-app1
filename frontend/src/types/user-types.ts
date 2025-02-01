export interface UserRegisterData {
    email: string;
    password: string;
    confirmPassword?: string; 
    captcha: string;
}

export interface UserLoginData {
    email: string;
    password: string;
    captcha: string;
}