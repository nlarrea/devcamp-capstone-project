export const checkUsername = (user, isError, errorMessage) => {
    const forbiddenChars = /(?=.*[@#$%^&*()=+,[\]{}]){1,}/g
    console.log(forbiddenChars.test(user));

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

    return true;
}


export const checkPasswords = (pass1, pass2, isError, errorMessage) => {
    const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[,.*_&])[A-z\d,.*_&]{8,}$/;
    const hasUpper = /(?=.*[A-Z]{1,})/.test(pass1);
    const hasLower = /(?=.*[a-z]{1,})/.test(pass1);
    const hasNumber = /(?=.*\d){1,}/.test(pass1);
    const hasSpecial = /(?=.*[.,*_&])/.test(pass1);

    if (pass1 !== pass2) {
        isError(true);
        errorMessage('Both passwords must be equals.');
        return false;
    } else if (pass1.length < 8) {
        isError(true);
        errorMessage('Password must be at least 8 characters.');
        return false;
    } else if (!passRegex.test(pass1)) {
        isError(true);
        errorMessage('Password doesn\'t meet the conditions.');
        alert(
            `Password must include at least:\n\
            - 1 upper char ${hasUpper ? '' : ' - (Not inserted)'}\n\
            - 1 lower char ${hasLower ? '' : ' - (Not inserted)'}\n\
            - 1 numeric char ${hasNumber ? '' : ' - (Not inserted)'}\n\
            - One of these: . , * _ & ${hasSpecial ? '' : ' - (Not inserted)'}`
        );
        return false;
    }

    return true;
}