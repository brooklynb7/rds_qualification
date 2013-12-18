var page = require('./routes/index');

module.exports = function(app) {
	app.get('/', page.index);
	app.get('/project', page.project);

	app.post('/postDoc', page.postDoc);
}