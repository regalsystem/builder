import React from 'react';

import { find } from '../../../editor/lib/ast';
import Icon from './heading.svg';
import layoutConstraint from '../layout-constraint';
import styles from './styles';

const containsHeadline2 = ast => !!find(ast, 'type', 'headline-2');

export default {
  name: 'headline-3',
  Icon,
  styles,
  Component: props => (
    <layoutConstraint.Component attributes={{}}>
      <h3 className="h3" {...props.attributes}>
        <style jsx>{styles}</style>
        {props.children}
      </h3>
    </layoutConstraint.Component>
  ),
  disabled(ast) {
    // only enable h3, if a h2 was already used
    return !containsHeadline2(ast);
  }
};
