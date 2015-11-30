function Generator (client) {
	this.client = client;
	this.id = new Date().getTime().toString() + Math.random().toString().substring(2);
}

Generator.prototype.getId = function(id) {
	return this.id;
};

Generator.prototype.generate = function() {
	this.client.rpush('message:queue', this.getMessage());
}

Generator.prototype.getMessage = function() {
	this.cnt = this.cnt || 0;

	return this.cnt++;
};

module.exports = Generator;