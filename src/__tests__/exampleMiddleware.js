import analytics from '../middleware/exampleMiddleware';
import fakeAnalyticsApi from '../middleware/exampleService';

jest.mock('../middleware/exampleService');

fakeAnalyticsApi.mockImplementation(
  () => new Promise((resolve, reject) => resolve('Success'))
);

const create = () => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
  };
  const next = jest.fn();
  const invoke = action => analytics(store)(next)(action);
  return { store, next, invoke };
};

describe('analytics middleware', () => {
  it('should pass on irrelevant keys', () => {
    const { next, invoke } = create();

    const action = { type: 'IRRELEVANT' };

    invoke(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(fakeAnalyticsApi).not.toHaveBeenCalled();
  });

  it('should make an analytics API call', () => {
    const { next, invoke } = create();

    const action = {
      type: 'RELEVANT',
      meta: {
        analytics: {
          event: 'foo',
          data: { extra: 'stuff' },
        },
      },
    };

    invoke(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(fakeAnalyticsApi).toHaveBeenCalled();
  });
});
