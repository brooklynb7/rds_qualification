var util = require('../util');
var fs = require('fs');

exports.index = function(req, res) {
	res.render("index", {});
};

exports.project = function(req, res) {
	res.render("project", {});
};

exports.postDoc = function(req, res) {
	var tmp_path = req.files.data.path;
	var target_path = './public/uploads/' + req.files.data.name;

	fs.rename(tmp_path, target_path, function(err) {
		if (err) util.sendSysError(500, err, res);

		fs.unlink(tmp_path, function() {
			if (err) util.sendSysError(500, err, res);
			res.send('File uploaded to: <a href="/uploads/' + req.files.data.name + '">' + target_path + '</a> - ' + req.files.data.size + ' bytes');
		});
	});
};