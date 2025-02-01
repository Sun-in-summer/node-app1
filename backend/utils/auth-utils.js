export const validateEmail = (email) => {
  const re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!re.test(password)) {
    let errorMessage = '';
    if (password.length < 8) {
      errorMessage += 'Password must be at least 8 characters long. ';
    }
    if (!/[a-z]/.test(password)) {
      errorMessage += 'Password must contain at least one lowercase letter. ';
    }
    if (!/[A-Z]/.test(password)) {
      errorMessage += 'Password must contain at least one uppercase letter. ';
    }
    if (!/\d/.test(password)) {
      errorMessage += 'Password must contain at least one digit. ';
    }
    if (!/[@$!%*?&]/.test(password)) {
      errorMessage +=
        'Password must contain at least one special character (@$!%*?&). ';
    }
    return { valid: false, message: errorMessage.trim() };
  }
  return { valid: true, message: '' };
};

