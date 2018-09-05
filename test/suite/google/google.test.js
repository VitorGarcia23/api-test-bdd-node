import rest from '../../helpers/rest';

const { BASE_URL } = process.env;

describe('When testing google route', () => {
	it('Should return 200 for a request', async () => {
		const response = await rest.get(BASE_URL);
		expect(response.status).to.be.eq(200);
	});
});
