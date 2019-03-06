import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ConnectedApp, { App } from '../App';

Enzyme.configure({ adapter: new Adapter() });

describe('the App container', () => {
  const spy = jest.fn();
  it('should dispatch fetchTasks on mount', () => {
    const wrapper = shallow(
      <App dispatch={spy} error="Boom!" tasks={[]} projects={[]} />
    );
    expect(wrapper.find('FlashMessage').exists()).toBe(true);
    expect(spy).toHaveBeenCalled();
  });
  it('should match the last snapshot', () => {
    const wrapper = shallow(
      <App dispatch={spy} error="Boom!" tasks={[]} projects={[]} />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should fetch tasks on mount', () => {
    const middlewares = [thunk];
    const initialState = {
      projects: {
        items: {},
        isLoading: false,
        error: null,
      },
      tasks: {
        items: {},
        isLoading: false,
        error: null,
      },
      page: {
        currentProjectId: null,
      },
    };
    const mockStore = configureMockStore(middlewares)(initialState);
    const wrapper = mount(
      <Provider store={mockStore}>
        <ConnectedApp />
      </Provider>
    );
    const expectedAction = { type: 'FETCH_PROJECTS_STARTED' };

    expect(mockStore.getActions()[0]).toEqual(expectedAction);
  });
});
