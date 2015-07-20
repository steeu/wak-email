# Wakanda Email Module
Send email example:
```javascript
var emailModule = require('email');
var email = new emailModule.Mail({
    address: 'smtp.gmail.com',
    port: 465,
    isSSL: true,
    user: 'user',
    password: 'password'
});

// connect to mailserver
email.connect();
// send email
email.send({
    from: __CONFIG.MAIL_FROM,
    to: __CONFIG.MAIL_DEFAULT_TO,
    subject: message.subject,
    content: message.content
});
// quit mailserver connection
email.quit();
```

Receive email example:
