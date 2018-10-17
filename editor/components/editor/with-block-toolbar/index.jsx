import classnames from 'classnames';
import React from 'react';

import editBlockStyles from './styles-edit-block';
import TrashIcon from './trash.svg';

const removeBlock = (editor, key) =>
  editor.change(change => change.removeNodeByKey(key));

export default (block, props) => {
  const { isFocused, attributes, node, editor } = props;
  const { canEdit = true, Component } = block;

  return (
    <div
      className={classnames('block', {
        'block--is-focused': canEdit && isFocused
      })}
      {...attributes}
    >
      <style jsx>{editBlockStyles}</style>
      <div
        readOnly
        className={classnames('toolbar', {
          'toolbar--is-visible': canEdit && isFocused
        })}
      >
        <span className="title">Actions</span>
        {canEdit &&
          isFocused && (
            <button
              className="button"
              type="button"
              onClick={event => {
                event.stopPropagation();
                removeBlock(editor, node.key);
              }}
            >
              <TrashIcon />
              <span>Delete</span>
            </button>
          )}
      </div>

      <Component {...props} />
    </div>
  );
};