const exceptionRepository = require('../dataAccessLayer').repositories.ExceptionRepository;

const exceptionsApi = () => {
    const messages = [
        {en: "Password not long enough (8 caracteres)", es: "La contraseña debe contener al menos 8 caracteres"},
        {en: "Password must have uppercase characters", es: "La contraseña debe contener al menos una letra mayúscula"},
        {en: "Password must have lowercase characters", es: "La contraseña debe contener al menos una letra minúscula"},
        {en: "Password must have numeric characters", es: "La contraseña debe contener caracteres numéricos"},
        {en: "Password must have symbol characters", es: "La contraseña debe contener al menos un signo"}
    ];
    for (let index = 0; index < messages.length; index++) {
        const m = messages[index];
        //await exceptionRepository.createIfNotExists(m);
    }
    return JSON.stringify(exceptionsApi);
}

module.exports = {
    exceptionsApi
};