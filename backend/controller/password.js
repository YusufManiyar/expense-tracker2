const User = require('../model/user.js')
const sequelize = require('../utils/data-config.js');

const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.EMAIL_API_KEY

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

module.exports = {
    forgetPassword : async (req, res) => {
        try {
          const { email } = req.body
          const sendSmtpEmail = {
            sender:{  
              "name":"Yusuf Maniyar",
              "email":"yusufmaniyar108@gmail.com"
            },
            to: [{
              email: email
            }],
            "subject":"Reset Password",
            "htmlContent":"<html><head></head><body><p>You recently requested to reset your password for your account. Click the button below to reset it. If you didn't request this, you can ignore this email. </p></body></html>",
            headers: {
              'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
            }
          };

          const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
          res.status(200).json({message: 'Reset Password instructions sent successfully'});
        } catch (error) {
          console.log(error)
            res.status(500).json({ message: error.toString() });
        }
    }
}