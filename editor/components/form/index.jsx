import React, { Component, Fragment } from 'react';

import Group from './group';
import styles from './styles';

const fileToDataURL = file =>
  new Promise(resolve => {
    const reader = new window.FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      resolve(reader.result);
    };
  });

class Form extends Component {
  onSubmit = target => {
    const formData = new FormData(target);
    const filePromises = [...formData.entries()]
      .map(([index, value]) => {
        if (value instanceof File) {
          return (
            fileToDataURL(value)
              .then(dataURL => {
                // we can't keep the original object, because after a re-import of
                // the json this data wouldn't be available
                formData.delete(index);

                formData.set(index, dataURL);
                formData.set(`${index}_name`, value.name);
              })

              // store the image width and height
              .then(
                () =>
                  new Promise(resolve => {
                    try {
                      const image = new Image();
                      image.src = formData.get(index);

                      image.onload = () => {
                        formData.set(`${index}_height`, image.height);
                        formData.set(`${index}_width`, image.width);

                        resolve();
                      };
                    } catch (err) {
                      resolve();
                    }
                  })
              )
          );
        }

        return null;
      })
      .filter(Boolean);

    Promise.all(filePromises).then(() => {
      this.props.onSubmit(formData);
    });
  };

  render() {
    const { enctype, buttons = [], fields } = this.props;

    return (
      <form
        encType={enctype}
        onSubmit={event => {
          event.preventDefault();
          this.onSubmit(event.target);
        }}
      >
        <style jsx>{styles}</style>

        {fields.map(_ => (
          <Group key={_.props.name}>{_}</Group>
        ))}

        <Group>
          {buttons.map(Button => (
            <Fragment key={Button.props.name}>{Button}</Fragment>
          ))}
        </Group>
      </form>
    );
  }
}

Form.defaultProps = {
  enctype: null,
  fields: [],
  button: [],
  onSubmit() {}
};

export default Form;
