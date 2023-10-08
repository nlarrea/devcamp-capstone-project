export const checkUsername = (user, isError, errorMessage) => {
    const forbiddenChars = /(?=.*[@#$%^&*()=+,[\]{}]){1,}/g

    if (user.length < 6) {
        isError(true);
        errorMessage('Username must be at least 6 characters.');
        return false;
    } else if (user.length > 30) {
        isError(true);
        errorMessage('Username must be less than 30 characters.');
        return false;
    } else if (forbiddenChars.test(user)) {
        isError(true);
        errorMessage('Valid special characters: ".", "-", "_"');
        return false;
    }

    isError(false);
    errorMessage('');
    return true;
}


const checkPassword = (password, isError, errorMsg) => {
    const minLength = 8;
    const maxLength = 80;

    if (password.length < minLength) {
        isError(true);
        errorMsg(`Password must be at least ${minLength} characters length.`);
        return false;
    } else if (password.length > maxLength) {
        isError(true);
        errorMsg(`Password must be more than ${maxLength} characters length.`);
        return false;
    }

    isError(false);
    errorMsg('');
    return true;
}

export const checkPasswords = (pass1, pass2, isError1, errorMsg1, isError2, errorMsg2) => {
    const pass1Correct = checkPassword(pass1, isError1, errorMsg1);
    const pass2Correct = checkPassword(pass2, isError2, errorMsg2);

    if (!pass1Correct || !pass2Correct) {
        return false;
    }

    if (pass1 !== pass2) {
        isError2(true);
        errorMsg2('Both passwords must be equals.');
    }

    return true;
}


export const passCharConditions = (password, isError, errorMessage) => {
    const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[,.*_&])[A-z\d,.*_&]{8,}$/;
    const hasUpper = /(?=.*[A-Z]{1,})/.test(password);
    const hasLower = /(?=.*[a-z]{1,})/.test(password);
    const hasNumber = /(?=.*\d){1,}/.test(password);
    const hasSpecial = /(?=.*[.,*_&])/.test(password);

    if (!passRegex.test(password)) {
        isError(true);
        errorMessage('Password doesn\'t meet the conditions');
    } else {
        isError(false);
        errorMessage('');
    }

    return {
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial
    };
}