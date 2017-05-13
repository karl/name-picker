import React, { Component } from 'react';
import createBrowserHistory from 'history/createBrowserHistory';
import md5 from 'md5';
import './App.css';

const divider = '|';

const history = createBrowserHistory();
const namesParam = window.location.search.substring('?names='.length);
const initialNames = namesParam.split(divider);

const initialState = {
  names: initialNames,
  selectedName: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NAMES':
      return {
        ...state,
        names: action.payload,
        selectedName: null,
      };

    case 'SHUFFLE':
      const index = Math.floor(Math.random() * state.names.length);
      const name = state.names[index];
      return {
        ...state,
        selectedName: name,
      };

    default:
      return state;
  }
};

const INIT_ACTION = { type: '@@INIT' };

const shuffle = () => {
  return { type: 'SHUFFLE' };
};

const setNames = names => {
  const path = `?names=${names.join(divider)}`;
  history.push(path);
  return { type: 'SET_NAMES', payload: names };
};

// ---

const NameInput = ({ value, onChange }) => {
  return (
    <textarea
      className="TextArea"
      placeholder="Enter names, one on each line"
      value={value.join('\n')}
      onChange={event => {
        onChange(event.target.value.split('\n'));
      }}
    />
  );
};

const Name = ({ name, isSelected }) => {
  const hash = md5(name);
  return (
    <div className={`Name ${isSelected ? 'Selected' : ''}`}>
      <img src={`//robohash.org/${hash}.png?set=set1`} alt="" />
      {name}
    </div>
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = reducer(undefined, INIT_ACTION);
  }

  dispatch(action) {
    this.setState(state => reducer(state, action));
  }

  render() {
    const { names, selectedName } = this.state;
    return (
      <div className="App">
        <div className="Picker">
          <div className="Names">
            {names.length === 0 &&
              <div className="NoNames">
                No names
                <div className="Hint">Scroll down and enter names</div>
              </div>}
            {names.length > 0 &&
              selectedName === null &&
              <div>
                <div className="Hint">Click Shuffle to pick a name</div>
              </div>}
            {names.length > 0 &&
              names.map((name, i) => (
                <Name key={i} name={name} isSelected={selectedName === name} />
              ))}
          </div>
          <button
            className="Shuffle"
            onClick={() => {
              this.dispatch(shuffle());
            }}
          >
            Shuffle
          </button>
        </div>
        <div className="Editor">
          <NameInput
            value={names}
            onChange={newNames => {
              this.dispatch(setNames(newNames));
            }}
          />
        </div>
      </div>
    );
  }
}

export default App;
