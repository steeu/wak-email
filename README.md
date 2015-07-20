# Wakanda Email Module

Wakanda module for simple email handling

## Send email example
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
    from: 'sender@email.com',
    to: 'receipent@email.com',
    subject: 'Mail Subject',
    content: 'Mail Content'
});
// quit mailserver connection
email.quit();
```

## Receive email example
```javascript
var emailModule = require('email');
var mailbox = new emailModule.Mailbox({
    address: 'pop.gmail.com',
    port: 995,
    isSSL: true,
    user: 'user',
    password: 'password'
});

// connect to mailserver
mailbox.connect();
// authenticate
mailbox.authenticate();
// get all message sizes
mailbox.getAllMessageSizes()
// quit mailserver connection
mailbox.quit();
```
