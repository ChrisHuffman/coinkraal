import React from 'react';
import {shallow} from 'enzyme';
import Loader from './Loader';

test('Loader: loader is visible', () => {
  const loader = shallow(<Loader visible={true} />);
  expect(loader.find('#loader').html()).toBe("<div id=\"loader\"></div>");
});

test('Loader: loader is hidden', () => {
  const loader = shallow(<Loader visible={false} />);
  expect(loader.find('#loader').length).toBe(0);
});