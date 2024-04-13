const User = require('../model/user.js')
const ForgotPasswordRequest = require('../model/ForgotPasswordRequest.js')
const sequelize = require('../utils/data-config.js');

const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.EMAIL_API_KEY

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const bcrypt = require('bcrypt');
// Function to hash a password
async function hashPassword(password) {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
}

module.exports = {
    forgetPassword : async (req, res) => {
        try {
          const { email } = req.body
          const user = await User.findOne({where:{ email }})

          if(!user) {
            throw 'User not found'
          }

          const forgotPasswordRequest =  await ForgotPasswordRequest.create({userId: user.id})

          const sendSmtpEmail = {
            sender:{  
              "name":"Yusuf Maniyar",
              "email":"yusufmaniyar108@gmail.com"
            },
            to: [{
              email: email
            }],
            "subject":"Reset Password",
            "htmlContent":`<html><head></head><body><p>You recently requested to reset your password for your account. Click the link below to reset it. If you didn't request this, you can ignore this email. </p><br><a href='https://expense-tracker.osc-fr1.scalingo.io/password/resetpassword/${forgotPasswordRequest.id}'>https://expense-tracker.osc-fr1.scalingo.io/password/resetpassword/${forgotPasswordRequest.id}</a></body></html>`,
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
    },

    resetPassword : async (req, res) => {
      try {
        
        const id = req.url.split('/')[2]

        const forgotPasswordRequest = await ForgotPasswordRequest.findByPk(id)
        if(!forgotPasswordRequest || !forgotPasswordRequest.isactive) {
          throw 'Invalid request'
        }

        const updatePasswordForm = `
          <html>
            <head>
              <title>Reset Password</title>
            </head>
            <body>
              <h2>Reset Your Password</h2>
              <form id="resetPasswordForm">
                <label for="password">New Password:</label>
                <input type="password" id="password" name="password" required>
                <button type="submit">Submit</button>
              </form>
              <script>
                document.getElementById('resetPasswordForm').addEventListener('submit', async (event) => {
                event.preventDefault(); // Prevent default form submission
    
                const formData = new FormData(event.target); // Get form data
                const password = formData.get('password'); // Get password from form data
    
                const apiUrl = '${config.BACKEND_URL}/password/updatepassword';
    
                try {
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ password, requestId: '${id}' }) // Send password in JSON format
                    });
                    if (response.ok) {
                        // Password reset successful, redirect or show success message
                        console.log('Password reset successful');
                    } else {
                        // Handle error response
                        console.error('Error resetting password:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error resetting password:', error);
                }
            });
              </script>
            </body>
          </html>
        `;

        // Set the Content-Type header to text/html
        res.setHeader('Content-Type', 'text/html');
        // Send the HTML content as the response body
        res.status(200).send(updatePasswordForm);
      } catch (error) {
        console.log(error)
          res.status(500).json({ message: error.toString() });
      }
  },

  updatePassword : async (req, res) => {
    const t = await sequelize.transaction()
    try {
      
      const { requestId, password } = req.body

      const forgotPasswordRequest = await ForgotPasswordRequest.findByPk(requestId)
      console.log(requestId, password, forgotPasswordRequest)
      if(!forgotPasswordRequest || !forgotPasswordRequest.isactive) {
        throw 'Invalid request'
      }

      const hashedPassword = await hashPassword(password)

      await User.update({password: hashedPassword}, { where: { id: forgotPasswordRequest.userId }, transaction: t})
      await forgotPasswordRequest.update({isactive: false}, { transaction: t })

      t.commit()
      res.status(200).send({ message: 'Password updated successfully'});
    } catch (error) {
      console.log(error)
      t.rollback()
      res.status(500).json({ message: error.toString() });
    }
},
}