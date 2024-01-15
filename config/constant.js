const axios = require("axios");
require("dotenv").config();
module.exports = constant = {
  appName: "Teemarh's Delight",
  appEmail: "Fatimatijjani78@gmail.com",
  appUrl: "http://localhost:4500",

  randomCode(len = 12, bits = 16) {
    bits = bits || 36;
    var outStr = "",
      newStr;
    while (outStr.length < len) {
      newStr = Math.random().toString(bits).slice(2);
      outStr += newStr.slice(0, Math.min(newStr.length, len - outStr.length));
    }
    return outStr.toUpperCase();
  },


  generatePayment: async (data) => {
    try {
      const resp = await axios.post(
        `${process.env.FLUTTERWAVE_URL}payments`,
        {
          tx_ref: data.tx_ref,
          amount: data.amount,
          currency: "NGN",
          redirect_url: `${process.env.FLUTTERWAVE_REDIRECT}`,
          customer: {
            email: data.email,
            phonenumber: data.phonenumber,
            name: data.name,
          },
          customizations: {
            title: constant.appName,
          },
        },
        {
          headers: {
            authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          },
        }
      );

      return resp;
    } catch (error) {
      console.error(error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  },


  verifyPayment: async (reference) => {
    try {
      // Log the reference for debugging purposes
      console.log('Verifying payment for reference:', reference);

      const resp = await axios.get(
        `${process.env.FLUTTERWAVE_URL}transactions/verify_by_reference?tx_ref=${reference}`,
        {
          headers: {
            authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
            // Include other headers if needed
          },
        }
      );

      // Return the response data if the request is successful
      return resp.data;
    } catch (error) {
      // Log the error for debugging purposes
      console.error('Error in verifying payment:', error);

      // Throw the error for handling it where this function is called
      throw error;
    }
  },
};

