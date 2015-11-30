var
	argv = require('minimist')(process.argv.slice(2)),
	redis		= require('redis'),
	client	= redis.createClient(),

	Dispatcher = new (require('./src/msg-dispatcher'))(client);


init = (function (MSG_SEND_TIMEOUT) {
	if (argv._.indexOf('getErrors') > -1) {
		Dispatcher.getErrors();
	} else {
		setInterval(() => { Dispatcher.run(); }, MSG_SEND_TIMEOUT);
	}
})(500);