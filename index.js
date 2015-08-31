
/**
 * mailbox (POP3)
 */

Mailbox = function(options) {
	try {
	    var options = options || {};

	    this.pop3Module = require('email/POP3'); 
	    this.pop3 = new this.pop3Module.POP3();
	    
	    // settings
	    this.address  = options.address;
	    this.port     = options.port;
	    this.isSSL    = options.isSSL;
		this.user     = options.user;
		this.password = options.password;
	} catch (e) {
		WAKTOOLS.log(e);
		return e;
	}
};


/**
 * connect
 *
 * @return {Object} result
 */
 
Mailbox.prototype.connect = function() {
	try {
        var result = {};

        // pop3 connection
        this.pop3.connect(this.address, this.port, this.isSSL, function(isOK, replyArr) {
            // validate request
            if (isOK) {
                // update result
                result.success = 1;
                result.result = replyArr;
                exitWait();
            } else {
                // update error
                result.success = 0;
                result.error = 'POP3 connection failed';
                result.errorInfo = replyArr;
                exitWait();
            }
        });
        wait();

        return result;
	} catch (e) {
		WAKTOOLS.log(e);
		return e;
	}
};


/**
 * authenticate
 *
 * @return {Object} result
 */
 
Mailbox.prototype.authenticate = function() {
	try {
        var result = {};

        // pop3 authentication
        this.pop3.authenticate(this.user, this.password, function(isOK, replyArr) {
            // validate request
            if (isOK) {
                // update result
                result.success = 1;
                result.result = replyArr;
                exitWait();
            } else {
                // update error
                result.success = 0;
                result.error = 'POP3 authentication failed';
                result.errorInfo = replyArr;
                exitWait();
            }
        });
        wait();

        return result;
	} catch (e) {
		WAKTOOLS.log(e);
		return e;
	}
};


/**
 * get all message sizes
 *
 * @return {Object} result
 */
 
Mailbox.prototype.getAllMessageSizes = function() {
	try {
        var result = {};

        // get all message sizes
        this.pop3.getAllMessageSizes(function(isOK, replyArr) {
            // validate request
            if (isOK) {
                // update result
                result.success = 1;
                result.result = replyArr;
                exitWait();
            } else {
                // update error
                result.success = 0;
                result.error = 'POP3 get all message sizes failed';
                result.errorInfo = replyArr;
                exitWait();
            }
        });
        wait();

        return result;
	} catch (e) {
		WAKTOOLS.log(e);
		return e;
	}
};


/**
 * retrieve message
 *
 * @param  {Number} message number
 * @return {Object} result
 */
 
Mailbox.prototype.retrieveMessage = function(number) {
	try {
        var result = {};

        // retrieve message
        this.pop3.retrieveMessage(number, function(isOK, replyArr) {
            // validate request
            if (isOK) {
                // create message object
                result.success = 1;
                result.message = {};
                result.lines = replyArr;
                
                // add content
                if (replyArr[1] && replyArr[1].toString()) {
                    //result.message = parseMailContent(replyArr[1].toString());
                    result.message = replyArr[1];
                }
                exitWait();
            } else {
                // update error
                result.success = 0;
                result.error = 'POP3 retrieve message failed';
                result.errorInfo = replyArr;
                exitWait();
            }
        });
        wait();

        return result;
	} catch (e) {
		WAKTOOLS.log(e);
		return e;
	}
};


/**
 * mark for deletion
 *
 * @param  {Number} message number
 * @return {Object} result
 */
 
Mailbox.prototype.markForDeletion = function(number) {
	try {
        var result = {};

        // mark folder for deletion
        this.pop3.markForDeletion(number, function(isOK, replyArr) {
            // validate request
            if (isOK) {
                // update result
                result.success = 1;
                result.result = replyArr;
                exitWait();
            } else {
                // update error
                result.success = 0;
                result.error = 'POP3 mark for deletion failed';
                result.errorInfo = replyArr;
                exitWait();
            }
        });
        wait();

        return result;
	} catch (e) {
		WAKTOOLS.log(e);
		return e;
	}
};




/**
 * clear deletion marks
 *
 * @return {Object} result
 */
 
Mailbox.prototype.clearDeletionMarks = function() {
	try {
        var result = {};

        // clear deletion marks
        this.pop3.clearDeletionMarks(function(isOK, replyArr) {
            // validate request
            if (isOK) {
                // update result
                result.success = 1;
                result.result = replyArr;
                exitWait();
            } else {
                // update error
                result.success = 0;
                result.error = 'POP3 clear deletion marks failed';
                result.errorInfo = replyArr;
                exitWait();
            }
        });
        wait();

        return result;
	} catch (e) {
		WAKTOOLS.log(e);
		return e;
	}
};


/**
 * quit
 *
 * @return {Object} result
 */
 
Mailbox.prototype.quit = function() {
	try {
        var result = {};

        // quit
        this.pop3.quit(function(isOK, replyArr) {
            // validate request
            if (isOK) {
                // update result
                result.success = 1;
                result.result = replyArr;
                exitWait();
            } else {
                // update error
                result.success = 0;
                result.error = 'POP3 quit failed';
                result.errorInfo = replyArr;
                exitWait();
            }
        });
        wait();

        return result;
	} catch (e) {
		WAKTOOLS.log(e);
		return e;
	}
};


/**
 * send email messages
 *
 * @return {Object} result
 */
 
Mail = function(options) {
	try {
	    var options = options || {};

	    this.smtpModule = require('waf-mail/SMTP');
        this.mailModule = require('waf-mail/mail');
   	    
	    this.smtp = new this.smtpModule.SMTP();
	    
	    // settings
	    this.address  = options.address;
	    this.port     = options.port || 25;
	    this.isSSL    = options.isSSL || false;
	    this.domain   = options.domain || '';
	    this.user     = options.user || '';
	    this.password = options.password || '';
	} catch (e) {
		WAKTOOLS.log(e);
		return e;
	}
}


/**
 * connect to mailserver
 *
 * @return {Object} result
 */

Mail.prototype.connect = function() {
	try {
        var result = {};

        // connect
	    this.smtp.connect(this.address, this.port, this.isSSL, this.domain, function(isOK, replyArr) {
            // validate request
            if (isOK) {
                // update result
                result.success = 1;
                result.result = replyArr;
                exitWait();
            } else {
                // update error
                result.success = 0;
                result.error = 'SMTP connection failed';
                result.errorInfo = replyArr;
                exitWait();
            }
	    });
	    wait();
		
		return result;
	} catch (e) {
		WAKTOOLS.log(e);
		return e;		
	}
};


/**
 * authenticate
 *
 * @return {Object} result
 */
 
Mail.prototype.authenticate = function() {
	try {
        var result = {};

        // pop3 authentication
        this.smtp.authenticate(this.user, this.password, function(isOK, replyArr) {
            // validate request
            if (isOK) {
                // update result
                result.success = 1;
                result.result = replyArr;
                exitWait();
            } else {
                // update error
                result.success = 0;
                result.error = 'SMTP authentication failed';
                result.errorInfo = replyArr;
                exitWait();
            }
        });
        wait();

        return result;
	} catch (e) {
		WAKTOOLS.log(e);
		return e;
	}
};


/**
 * send mail
 *
 * @param  {Object} options
 * @return {Object} result
 */

Mail.prototype.send = function(options) {
	try {
	    var options = options || {},
	        result = {};
	   
	    this.from = options.from;
	    this.to = options.to;
	    this.subject = options.subject;
	    this.priority = options.priority || 3;
	    this.content = options.content || '';
	    this.contentType = options.contentType || 'text/plain';
	    

		// create email message
		var message = new this.mailModule.Mail();
		
		message.subject = this.subject;
		message.from = this.from;
		message.to = this.to;
    	message.setBody(this.content);	
		
		// check if html or text
		switch(this.contentType) {
			case 'text/plain':
    			message.setBodyType('text/plain; charset=utf-8');
				break;
			case 'text/html':
    			message.setBodyType('text/html; charset=utf-8');
				break;
			default:
				message.setBodyType(contentType);
		}
		// add priority field
		message.addField('X-Priority', this.priority + '');
		// send
        this.smtp.send(this.from, this.to, message, function(isOK, replyArr) {
            // validate request
            if (isOK) {
                // update result
                result.success = 1;
                result.result = replyArr;
                exitWait();
            } else {
                // update error
                result.success = 0;
                result.error = 'SMTP send email failed';
                result.errorInfo = replyArr;
                exitWait();
            }
        });
	    wait();
	    
	    return result;	
	} catch (e) {
		WAKTOOLS.log(e);
		return e;		
	}
};


/**
 * quit
 *
 * @return {Object} result
 */
 
Mail.prototype.quit = function() {
	try {
        var result = {};

        // quit
        this.smtp.quit(function(isOK, replyArr) {
            // validate request
            if (isOK) {
                // update result
                result.success = 1;
                result.result = replyArr;
                exitWait();
            } else {
                // update error
                result.success = 0;
                result.error = 'SMTP quit failed';
                result.errorInfo = replyArr;
                exitWait();
            }
        });
        wait();

        return result;
	} catch (e) {
		WAKTOOLS.log(e);
		return e;
	}
};


exports.Mail    = Mail;
exports.Mailbox = Mailbox;