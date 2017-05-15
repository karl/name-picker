import React from 'react';

class NameInput extends React.Component {
  constructor(props) {
    super(props);
    const { value } = this.props;

    // Because we only set text on creation
    // this acts like an uncontrolled input.
    this.state = {
      text: value.join('\n'),
    };
  }

  parseText(text) {
    let names = [];
    text.split('\n').forEach(name => {
      const trimmed = name.trim();
      if (trimmed === '') {
        return;
      }
      names.push(trimmed);
    });
    return names;
  }

  render() {
    const { onChange } = this.props;
    const { text } = this.state;
    return (
      <textarea
        className="TextArea"
        placeholder="Enter names, one on each line"
        value={text}
        onChange={event => {
          const text = event.target.value;
          const names = this.parseText(text);
          this.setState({ text });
          onChange(names);
        }}
      />
    );
  }
}

export default NameInput;
