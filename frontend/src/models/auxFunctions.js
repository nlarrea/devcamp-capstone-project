export const getApiErrorMsg = (error) => {
    const resMessage = (
        error.response &&
        error.response.data &&
        error.response.data.detail &&
        error.response.data.detail.message
        ) ||
        error.message ||
        error.toString();

    return resMessage;
}