function Dispatcher (client) {
	this.client = client;
	this.generator = new (require('./msg-generator'))(client);
	this.handler = new (require('./msg-handler'))(client);
	this.msgQueue = '';
}

Dispatcher.prototype.getErrors = function() {
	var self = this;
	console.log('Errors list:');

	this.client.multi()
		.lrange('message:error', 0, -1, function(err, reply) {
			console.log(reply);
		})
		.del("message:error", function() {
			console.log("All error messages are deleted.");
			self.client.end();
		}).exec();
};

Dispatcher.prototype.run = function() {
	var self = this;

	this.client.get('generator', function(err, reply) {
		if (err != null) {
			throw err;
		}

		if(reply === null || reply === self.generator.getId()) {
			self.client.set('generator', self.generator.getId());
			self.client.expire('generator', 1);
			
			console.log('There\'ll be generator...');
			self.generator.generate();
		} else {
			console.log('There\'ll be handler...');
			self.handler.handle();
		}
	});
};

module.exports = Dispatcher;