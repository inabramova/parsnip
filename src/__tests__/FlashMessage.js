import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import FlashMessage from '../components/FlashMessage';

Enzyme.configure({ adapter: new Adapter() });

describe('the TaskList component', () => {
  it('should render a status', () => {
    const errorText = 'some error just happened';
    const wrapper = shallow(<FlashMessage message={errorText} />);

    expect(wrapper.find('.flash-error').text()).toEqual(errorText);
  });

  it('should match the last snapshot with msg', () => {
    const wrapper = shallow(<FlashMessage message="oops" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
