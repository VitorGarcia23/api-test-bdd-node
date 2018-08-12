import dataSet from './dataset';
import rest from '../../helpers/rest';

describe('When testing google route', () => {
	it('Should return 200 for a request', async () => {
		const response = await rest.get(dataSet.route);
		expect(response.status).to.be.eq(200);
	});
});
