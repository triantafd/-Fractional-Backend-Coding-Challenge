import supertest from 'supertest';
import app from '../index';
const api = supertest(app);

test('Mno, countryCode, subscriberNumber, country are returned as json', async () => {
  await api
    .get('/phone/3069523?api_key=api2')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('The MSISDN works correctly and returns the right data', async () => {
  const response = {
    "id": 1,
    "mno": "Vodafone",
    "countryCode": "30",
    "subscriberNumber": "3069523",
    "country": "GR"
  };
  const resultPhone = await api
    .get('/phone/30695231235?api_key=api2')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(resultPhone.body).toEqual(response);
});

describe('All possible errors', () => {
  test('WRONG_API_KEY', async () => {
    const error = 'Api_key error, you are using a wrong api key';
    const resultPhone = await api
      .get(`/phone/30695231231?api_key=api6`)
      .expect(400);

    //eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access
    expect(resultPhone.body.error).toEqual(error);
  });

  test('WRONG_NUMBER', async () => {
    const error = 'WRONG_NUMBER error, you are using a number that doesnt exist';
    const resultPhone = await api
      .get(`/phone/30691111523?api_key=api2`)
      .expect(400);
    //eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access,
    expect(resultPhone.body.error).toEqual(error);
  });

  test('WRONG_QUERY', async () => {
    const error = 'WRONG_QUERY error, you are using a wrong query parameter for api key';
    const resultPhone = await api
      .get(`/phone/30691111523?apasdi_key=api2`)
      .expect(400);
    //eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access,
    expect(resultPhone.body.error).toEqual(error);
  });

  test('WRONG_INPUT', async () => {
    const error = 'WRONG_INPUT error, the input is not a telephone number';
    const resultPhone = await api
      .get(`/phone/texttexttext?api_key=api2`)
      .expect(400);
    //eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access,
    expect(resultPhone.body.error).toEqual(error);
  });

  test('API_KEY_MAX_USAGE (Did four before)', async () => {
    const error = 'API_KEY_MAX_USAGE, slow down your requests';

    await api
      .get(`/phone/3069523333?api_key=api2`)
      .expect(200);

    const resultPhone = await api
      .get(`/phone/3069523333?api_key=api2`)
      .expect(429);
    //eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access,
    expect(resultPhone.body.error).toEqual(error);
  });
});

