import React, { Component } from 'react';
import md5 from 'md5';
import queryString from 'query-string';
import createBrowserHistory from 'history/createBrowserHistory';
import {
  divider,
  reducer,
  INIT_ACTION,
  setTitle,
  setNames,
  shuffle,
} from '../data';
import NameInput from './NameInput';
import Carousel from './Carousel';

import './App.css';

const history = createBrowserHistory();

const TitleInput = ({ value, onChange }) => {
  return (
    <input
      className="TitleInput"
      placeholder="Title (optional)"
      value={value}
      onChange={event => onChange(event.target.value)}
    />
  );
};

const Name = ({ name, isSelected }) => {
  const hash = md5(name);
  return (
    <div className={`Name ${isSelected ? 'Selected' : ''}`}>
      <img src={`https://robohash.org/${hash}.png?set=set1`} alt="" />
      <div className="NameText">{name}</div>
    </div>
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = reducer(undefined, INIT_ACTION);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state === prevState) {
      return;
    }

    const { title, names } = this.state;
    const params = {
      title,
      names: names.join(divider),
    };
    history.push('?' + queryString.stringify(params));
  }

  dispatch(action) {
    this.setState(state => reducer(state, action));
  }

  render() {
    const { title, names, selectedIndex, revolutions } = this.state;
    return (
      <div className="App">
        <div className="Picker">
          <div className="Title">{title}</div>
          <div className="Names">

            {names.length === 0 &&
              <div className="NoNames">
                No names
                <div className="Hint">Scroll down and enter names</div>
              </div>}

            <div style={{ opacity: selectedIndex === null ? 0.1 : 1 }}>
              <Carousel selectedIndex={selectedIndex} revolutions={revolutions}>
                {names.map((name, i) => (
                  <Name
                    key={i}
                    name={name}
                    isSelected={selectedIndex === name}
                  />
                ))}
              </Carousel>
            </div>
          </div>
          <button
            className="Shuffle"
            disabled={names.length === 0}
            onClick={() => {
              this.dispatch(shuffle());
            }}
          >
            ↺
          </button>
        </div>
        <div className="Editor">
          <TitleInput
            value={title}
            onChange={newTitle => this.dispatch(setTitle(newTitle))}
          />
          <NameInput
            value={names}
            onChange={newNames => {
              this.dispatch(setNames(newNames));
            }}
          />
          <div className="Hint">
            {names.length} names.
          </div>
          <div className="Hint">
            After entering your names, save this page to your browser bookmarks
            for quick access to this list.
          </div>
        </div>
      </div>
    );
  }
}

export default App;
