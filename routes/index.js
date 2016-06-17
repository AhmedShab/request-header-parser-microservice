var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/api/whoami/', function (req, res) {
		var ip = req.headers['x-forwarded-for'] ||
						 req.connection.remoteAddress;
		var language = req.headers["accept-language"].split(',')[0];
		var os = req.headers["user-agent"].match(/\((.*?)\)/)[1];
		// console.log(language.language);
		var results = [{
			ipaddress : ip,
			language: language,
			system: os
		}];

		return res.json(results);
	});

module.exports = router;
