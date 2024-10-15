import axios, { AxiosInstance } from 'axios';

import { throttledGetDataFromApi } from './index';

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runAllTimers();
  });

  test('should create instance with provided base url', async () => {
    const baseURL = 'https://jsonplaceholder.typicode.com';

    jest
      .spyOn(axios, 'create')
      .mockReturnValue({ get: () => jest.fn() } as unknown as AxiosInstance);
    jest.spyOn(axios, 'get').mockReturnValue(Promise.resolve(undefined));

    await throttledGetDataFromApi('some-path');

    expect(axios.create).toHaveBeenCalledWith({ baseURL });
  });

  test('should perform request to correct provided url', async () => {
    const providedURL = 'some-url';

    const axiosInstance = {
      get: jest.fn(),
    } as unknown as AxiosInstance;

    jest.spyOn(axios, 'create').mockReturnValue(axiosInstance);
    jest
      .spyOn(axiosInstance, 'get')
      .mockReturnValue(Promise.resolve({ data: '' }));

    await throttledGetDataFromApi(providedURL);

    expect(axiosInstance.get).toHaveBeenCalledWith(providedURL);
  });

  test('should return response data', async () => {
    const mockData: string[] = [];

    const axiosInstance = {
      get: jest.fn(),
    } as unknown as AxiosInstance;

    jest.spyOn(axios, 'create').mockReturnValue(axiosInstance);
    jest
      .spyOn(axiosInstance, 'get')
      .mockReturnValue(Promise.resolve({ data: mockData }));

    const result = await throttledGetDataFromApi('');

    expect(result).toEqual(mockData);
  });
});
