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

var BusyIndicator = function(element) {
	this.element = element;
	this.isVisible = false;
};
BusyIndicator.prototype.show = function() {
	if (this.element) {
		this.element.block({
			message: '<img src="/images/ajax-loader.gif" />',
			css: {
				backgroundColor: 'transparent',
				border: '0px'
			},
			overlayCSS: {
				backgroundColor: '#EEE',
				opacity: 0.5
			},
			baseZ: 10000
		});
		this.isVisible = true;
	}
	return this;
};
BusyIndicator.prototype.hide = function() {
	if (this.element) {
		this.element.unblock();
	}
	this.isVisible = false;
	return this;
};

function getFileName(filePath){
	var filePathArray = filePath.split('\\');
	return filePathArray[filePathArray.length-1];
}

function createUploadedFileDiv(file){
	return $('<div>file:<a href="/uploads/'+ file.name +'" target="_blank">' + file.name + '</a> create at:' + new Date(file.create_time).Format("yyyy-MM-dd hh:mm:ss") + '</div>');
}