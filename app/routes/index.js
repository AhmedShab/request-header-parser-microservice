'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();

	app.route('/')
	.get(isLoggedIn, function (req, res) {
		res.sendFile(path + '/public/index.html');
	});

	app.route('/api/whoami/')
	.get(function (req, res) {
		var ip = req.headers['x-forwarded-for'] ||
						 req.connection.remoteAddress;
		var language = req.headers["accept-language"].split(',')[0];
		var os = req.headers["user-agent"].match(/\((.*?)\)/)[1]
		// console.log(language.language);
		res.send(JSON.stringify({
			ipaddress : ip,
			language: language,
			system: os
		}));
	});

	app.route('/login')
	.get(function (req, res) {
		res.sendFile(path + '/public/login.html');
	});

	app.route('/logout')
	.get(function (req, res) {
		req.logout();
		res.redirect('/login');
	});

	app.route('/profile')
	.get(isLoggedIn, function (req, res) {
		res.sendFile(path + '/public/profile.html');
	});

	app.route('/api/:id')
	.get(isLoggedIn, function (req, res) {
		res.json(req.user.github);
	});

	app.route('/auth/github')
	.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
	.get(passport.authenticate('github', {
		successRedirect: '/',
		failureRedirect: '/login'
	}));

	app.route('/api/:id/clicks')
	.get(isLoggedIn, clickHandler.getClicks)
	.post(isLoggedIn, clickHandler.addClick)
	.delete(isLoggedIn, clickHandler.resetClicks);
};
