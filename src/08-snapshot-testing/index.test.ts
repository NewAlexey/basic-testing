import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const snapshot = { next: { next: null, value: null }, value: 1 };

    const result = generateLinkedList([1]);
    expect(result).toStrictEqual(snapshot);
  });

  test('should generate linked list from values 2', () => {
    const result = generateLinkedList([1, 2]);
    expect(result).toMatchSnapshot();
  });
});
