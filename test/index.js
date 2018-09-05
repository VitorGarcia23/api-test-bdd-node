import path from 'path';
import yargs from 'yargs';
import { spawnSync } from 'child_process';
import dotenv from 'dotenv';

const environments = ['dev', 'stg'];

function getParams(args) {
	const params = {
		file: {
			arg: '-F or --file',
			value: args.F || args.file,
			optional: true
		},
		folder: {
			arg: '-P or --path',
			value: args.P || args.path,
			optional: true
		},
		test: {
			arg: '-T or --Test',
			value: args.T || args.test,
			optional: true
		},
		env: {
			arg: '-E or --env',
			value: args.E || args.env || 'dev'
		},
		report: {
			arg: '-R or --report',
			value: args.hasOwnProperty('R') || args.hasOwnProperty('report'),
			optional: true
		}
	};

	if (!environments.includes(params.env.value)) {
		throw new Error(
			`Environment passed is not valid. Enviroment must be one of the following ${environments}`
		);
	}

	if (params.file.value && !params.folder.value) {
		throw new Error('The parameter "file" depends on parameter "folder"');
	}

	Object.keys(params).forEach(item => {
		if (!params[item].optional && !params[item].value) {
			throw new Error(`The parameter "${params[item].arg}" is required`);
		}
	});

	return Object.keys(params)
		.map(key => ({ [key]: params[key].value }))
		.reduce((acc, param) => Object.assign(acc, param), {});
}

(async args => {
	try {
		const { folder, file, test, report, env } = getParams(args);

		const pathFolder = folder || 'suite';

		const watchTests = file
			? path.join('test', pathFolder, `${file}.test.js`)
			: path.join('test', pathFolder);

		const command = [
			'--opts',
			path.join('test', 'config', 'mocha.opts'),
			watchTests,
			'--recursive'
		];

		if (report) {
			command.push(
				'--reporter',
				'mochawesome',
				'--reporter-options',
				'timestamp=true,reportDir=test-results/reports,reportFilename=test'
			);
		}

		if (test) {
			command.push('-g', test);
		}
	
		dotenv.config({ path: `test/config/environments/${env}.env` });

		console.log("\x1b[33m",`Running tests on '${env}' environment`);

		spawnSync('mocha', command, { stdio: 'inherit', shell: true });
	} catch (err) {
		console.error(err.message);
	}
})(yargs.argv);
