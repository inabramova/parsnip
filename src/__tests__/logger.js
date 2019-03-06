import logger from '../middleware/logger';

const create = () => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
  };
  const next = jest.fn();
  const invoke = action => logger(store)(next)(action);
  return { store, next, invoke };
};

describe('logger middleware', () => {
  it('should call console', () => {
    const { next, invoke } = create();

    const action = { type: 'IRRELEVANT' };

    jest.spyOn(global.console, 'log');

    invoke(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(console.log).toHaveBeenCalled();
  });
});
