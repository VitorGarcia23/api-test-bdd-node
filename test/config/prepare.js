/**
 * This file is called before the test framework is loaded
 * If you need to execute something once before all tests you can use this file
 * Like login in an API to get a Token you will share for all tests
 * Also you can use it for a global Teardown
 */

import prepare from 'mocha-prepare';

const globalSetUp = done => {
	console.log('execute anything before running any tests');
	done();
};

const globalTearDown = done => {
	console.log('execute anything after running all tests');
	done();
};

prepare(globalSetUp, globalTearDown);
