
/**
 * The SMTP Instance object allows you to connect, authenticate, 
 * and send an email while specifying the domain.
 *
 * Source: http://forum.wakanda.org/showthread.php?6295-Sending-email-through-GoDaddy&p=28656
 *
 * //send email message
 * require('email').sendMail({
 *     sendTo: 'receipent@domain.com',
 *     sendFrom: 'sender@domain.com',
 *     subject: 'Subject',
 *     content: 'Content Text'
 * });
 */

var sendMail = function( options ) {
	try {
		var smtp = require('waf-mail/SMTP'),
			mail = require('waf-mail/mail');

		// options
		var options = options || {},
			sendTo = options.sendTo,
			sendFrom = options.sendFrom,
			subject = options.subject,
			content = options.content,
			contentType = options.contentType || 'text/plain',
			priority = options.priority || 3,
			message;
		
		// mail config
		var config = {
			address: __CONFIG.SYSTEM.EMAIL.address,
			port: __CONFIG.SYSTEM.EMAIL.port,
			isSSL: __CONFIG.SYSTEM.EMAIL.isSSL,
			domain: ''
		};

		// create email message
		message = new mail.Mail();
		message.subject = subject;
		message.from = sendFrom;
		message.to = sendTo;
		// check if html or text
		if (contentType == 'text/plain') {
			message.setBodyType('text/plain; charset=utf-8');
			message.setBody(content);		
		} else if (contentType == 'text/html') {
			message.setBodyType('text/html; charset=utf-8');
			if (options.list) {
				var listContent = renderHtmlTable(options.list);
				
				// add list to content
				message.setBody('<pre style="font-family: monospace;">' + content + listContent + '</pre>');				
			} else {
				message.setBody('<pre style="font-family: monospace;">' + content + '</pre>');		
			}
		} else {
			message.setBodyType(contentType);
			message.setBody(content);		
		}
		// add priority field
		message.addField('X-Priority', priority + '');
	    //init error tracking
	    var errName = '';
	    var errInfo = [];
	   	var isSent = false;
	    //connect
	    var client = new smtp.SMTP();
	    client.connect(config.address, config.port, config.isSSL, config.domain, function onAfterConnect(isConnected, replyArr, isESMTP) {
	        if ( isConnected ) {
	        	//send without authentication
	            client.send(message.from, message.to, message, function onAfterSend(isSent, replyArr) {
	                if ( isSent ) {
	                    exitWait();
	                } else {
	                    errName = 'smtp_SendFailed';
	                    errInfo = replyArr;
	                    exitWait();
	                }
	            });
	        } else {
	            errName = 'smtp_CouldNotConnect';
	            errInfo = replyArr;
	            exitWait();
	        }
	    });
	    wait();
	    // determine if sent
	    if ( errName === '' ) {
	        isSent = true;
	    } else {
	        isSent = false;
	    }
	 
	    return {
	        isSent: isSent,
	        errName: errName,
	        errInfo: errInfo
	    };		
	} catch (e) {
		WAKTOOLS.Error.log(e);
		return e;		
	}
};


/**
 * send info mail
 */

var sendInfoMail = function() {
	try {
		sendMail({
			subject: application.name + ' start [' + application.httpServer.hostName + ']', 
			content: 'WAKANDA APPLICATION REPORT'
				+ '<br>=========================='
				+ '<br>'
				+ '<br>' + moment().format('DD.MM.YYYY HH:mm')
				+ '<br>'
				+ '<br>APPLICATION' 
				+ '<br>------------------------------------------------------------'
				+ '<br>Server:             ' + application.httpServer.hostName
				+ '<br>IP:                 ' + application.httpServer.ipAddress
				+ '<br>Port:               ' + application.httpServer.port
				+ '<br>SSL:                ' + application.httpServer.ssl.enabled
				+ '<br>SSL Port:           ' + application.httpServer.ssl.port 
				+ '<br>'
				+ '<br>WAKANDA'
				+ '<br>------------------------------------------------------------'
				+ '<br>Product:            ' + application.process.productName
				+ '<br>Version:            ' + application.process.version
				+ '<br>PID:                ' + application.process.pid 
				+ '<br>'
				+ '<br>SYSTEM'
				+ '<br>------------------------------------------------------------'
				+ '<br>DataFolder:         ' + ds.getDataFolder().path
				+ '<br>Volume Size:        ' + Math.round(ds.getModelFolder().getVolumeSize('WithQuotas') / 1024 / 1024 / 1024) + ' GB'
				+ '<br>Free Disk Space:    ' + Math.round(ds.getModelFolder().getFreeSpace('WithQuotas') / 1024 / 1024 / 1024) + ' GB',
			contentType: 'text/html'
		});			
	} catch (e) {
		WAKTOOLS.Error.log(e);
		return e;		
	}
};


/**
 * render html table from object array
 */

var renderHtmlTable = function (objArray) {
	try {
		var enableTableHeader = false,
			result = '';
			
	    // header theme	 
	    result = '<table border="0" cellspacing="0" cellpadding="0" style="font-family: Calibri, sans-serif;>';
	    // table head
	    if (enableTableHeader) {
	        result += '<thead><tr>';
	        for (var index in objArray[0]) {
	            result += '<th scope="col">' + index + '</th>';
	        }
	        result += '</tr></thead>';
	    }
	    // table body
	    result += '<tbody>';
	    for (var i = 0; i < objArray.length; i++) {
	        result += (i % 2 == 0) ? '<tr class="alt">' : '<tr>';
	        for (var index in objArray[i]) {
	            result += '<td style="padding:10px 25px 0px 0px">' + objArray[i][index] + '</td>';
	        }
	        result += '</tr>';
	    }
	    result += '</tbody>';
	    result += '</table>';

	    return result;
	} catch (e) {
		WAKTOOLS.Error.log(e);
		return e;		
	}
};

exports.sendMail = sendMail;
exports.sendInfoMail = sendInfoMail;