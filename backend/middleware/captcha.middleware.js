export const checkCaptcha = (userInput, session) => {
  if (!userInput || !session.captcha) {
    console.log('userInput', userInput);
    console.log('session.captcha', session.captcha);
    return false;
  }
  const isValid = userInput.toLowerCase() === session.captcha.toLowerCase();
  session.captcha = null;
  return isValid;
};

//   return true;
// };
