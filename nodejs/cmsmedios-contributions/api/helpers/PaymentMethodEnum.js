var Enum = require('enum');
//This payments Methods should be the same at DB to use and add when webhook is recevied and proccesed
const paymentMethodsId = new Enum({ 'PaypalSub': 1, 'PaypalWebChk': 2, 'PayU': 3, 'MercadoPagoWebChk': 4, 'MercadoPagoSub': 5 , 'SerfinsaWebChk': 6, 'SerfinsaSub': 7 });
module.exports = {
    paymentMethodsId
}