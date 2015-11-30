function Handler (client) {
	this.client = client;
}

Handler.prototype.eventHandler = function(msg, callback) {
	function onComplete(){

		var error = Math.random() > 0.85;

		callback(error, msg);

	}

	// processing takes time...

	setTimeout(onComplete, Math.floor(Math.random()*1000));
};

Handler.prototype.errorHandler = function(err, msg) {
	if (err) {
		this.client.rpush('message:error', msg);
	}
};

Handler.prototype.handle = function(msg) {
	var 
		self = this;

	this.client.lpop('message:queue', function(err, reply) {
		if (err != null) {
			throw err;
		}
		
		self.eventHandler(reply, self.errorHandler.bind(self));
	});
};

module.exports = Handler;