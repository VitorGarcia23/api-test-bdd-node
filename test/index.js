import path from 'path';
import yargs from 'yargs';
import { spawnSync } from 'child_process';

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
		report: {
			arg: '-R or --report',
			value: args.hasOwnProperty('R') || args.hasOwnProperty('report'),
			optional: true
		}
	};

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
		const { folder, file, test, report } = getParams(args);

		const watchTests = file
			? path.join('test', folder, `${file}.test.js`)
			: path.join('test', 'suite');

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

		spawnSync('mocha', command, { stdio: 'inherit', shell: true });
	} catch (err) {
		console.error(err.message);
	}
})(yargs.argv);
