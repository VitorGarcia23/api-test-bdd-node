import dataSet from './dataset';
import Http from '../../lib/Http';

describe('When testing google route', () => {
	it('Should return 200 for a request', async () => {
		const response = await Http.get(dataSet.route);
		expect(response.status).to.be.eq(200);
	});
});
