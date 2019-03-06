import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import Task from '../components/Task';

Enzyme.configure({ adapter: new Adapter() });

describe('the Task component', () => {
  const task = {
    id: 1,
    title: 'A',
    description: 'a',
    status: 'Unstarted',
    timer: 0,
  };
  const onStatusChange = jest.fn();

  it('should render a status', () => {
    const wrapper = shallow(
      <Task task={task} onStatusChange={onStatusChange} />
    );

    const select = wrapper.find('select').first();
    expect(select.props().value).toEqual('Unstarted');
    select.prop('onChange')({ target: { value: 'In Progress' } });
    expect(onStatusChange).toHaveBeenCalled();
  });

  it('should match the last snapshot', () => {
    const wrapper = shallow(
      <Task task={task} onStatusChange={onStatusChange} />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
