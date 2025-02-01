const MainPage: React.FC = () => {

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Добро пожаловать!</h1>
            <p>Выберите действие:</p>
            <button style={{ margin: "10px" }}>
                <a href="/register" style={{ textDecoration: "none", color: "black" }}>
                    Зарегистрироваться
                </a>
            </button>
            <button style={{ margin: "10px" }}>
                <a href="/login" style={{ textDecoration: "none", color: "black" }}>
                    Войти
                </a>
            </button>
        </div>
    );
};

export default MainPage;