export const checkCaptcha = (userInput, session) => {
  if (!userInput || !session.captcha) {
    return false;
  }
  const isValid = userInput.toLowerCase() === session.captcha.toLowerCase();
  session.captcha = null;
  return isValid;
};

//   return true;
// };
