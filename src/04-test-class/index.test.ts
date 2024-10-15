import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from './index';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const balance = 42;

    const account = getBankAccount(balance);
    expect(account.getBalance()).toEqual(balance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const balance = 42;
    const amount = 420;

    const account = getBankAccount(balance);

    expect(() => account.withdraw(amount)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const balance = 42;
    const otherBalance = 420;

    const account = getBankAccount(balance);
    const otherAccount = getBankAccount(otherBalance);

    expect(() => account.transfer(balance + 10, otherAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const balance = 42;

    const account = getBankAccount(balance);

    expect(() => account.transfer(balance + 10, account)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const balance = 42;
    const deposit = 15;
    const resultDeposit = balance + deposit;

    const account = getBankAccount(balance);
    jest.spyOn(account, 'deposit');
    account.deposit(deposit);

    expect(account.getBalance()).toEqual(resultDeposit);
    expect(account.deposit).toHaveBeenCalled();
  });

  test('should withdraw money', () => {
    const balance = 42;
    const deposit = 15;
    const resultDeposit = balance - deposit;

    const account = getBankAccount(balance);
    jest.spyOn(account, 'withdraw');
    account.withdraw(deposit);

    expect(account.getBalance()).toEqual(resultDeposit);
    expect(account.withdraw).toHaveBeenCalled();
  });

  test('should transfer money', () => {
    const balance = 42;
    const otherBalance = 20;
    const transferAmount = 10;

    const accountBalance = balance - transferAmount;
    const otherAccountBalance = otherBalance + transferAmount;

    const account = getBankAccount(balance);
    const otherAccount = getBankAccount(otherBalance);
    jest.spyOn(account, 'transfer');
    jest.spyOn(account, 'withdraw');
    jest.spyOn(otherAccount, 'deposit');
    account.transfer(transferAmount, otherAccount);

    expect(account.getBalance()).toEqual(accountBalance);
    expect(otherAccount.getBalance()).toEqual(otherAccountBalance);
    expect(account.transfer).toHaveBeenCalled();
    expect(account.withdraw).toHaveBeenCalled();
    expect(otherAccount.deposit).toHaveBeenCalled();
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const newBalance = 42;

    const account = getBankAccount(5);
    jest
      .spyOn(account, 'fetchBalance')
      .mockImplementation(async () => newBalance);

    const result = await account.fetchBalance();

    expect(result).toEqual(newBalance);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const newBalance = 42;

    const account = getBankAccount(5);
    jest
      .spyOn(account, 'fetchBalance')
      .mockImplementation(async () => newBalance);

    await account.synchronizeBalance();

    expect(account.getBalance()).toEqual(newBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(5);
    jest.spyOn(account, 'fetchBalance').mockImplementation(async () => null);

    await expect(() => account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
