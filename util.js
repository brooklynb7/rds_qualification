var crypto = require('crypto');

Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S": this.getMilliseconds()
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};

Date.prototype.last5days = function(){
	return this.valueOf() - 60*60*24*5*1000;
};

exports.md5 = function(text) {
	return crypto.createHash('md5').update(text).digest('hex');
};

exports.random = function(upper, floor){
	var upper = typeof upper == 'number' ? upper : 100;
	var floor = typeof floor == 'number' ? floor : 0;
	return parseInt(Math.random() * (upper - floor + 1) + floor);
};

exports.sendSysError = function(statueCode, error, response){
	response.statusCode = statueCode;
	response.send(error);
};