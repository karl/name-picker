import React, { Component } from 'react';
import createBrowserHistory from 'history/createBrowserHistory';
import md5 from 'md5';
import queryString from 'query-string';
import NameInput from './NameInput';

import './App.css';

const divider = '•';

const history = createBrowserHistory();
const params = queryString.parse(window.location.search);
const namesParam = params.names;
const initialTitle = params.title !== undefined ? params.title : '';
const initialNames = namesParam !== undefined ? namesParam.split(divider) : [];

const initialState = {
  title: initialTitle,
  names: initialNames,
  selectedIndex: null,
  revolutions: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TITLE':
      return {
        ...state,
        title: action.payload,
      };
    case 'SET_NAMES':
      return {
        ...state,
        names: action.payload,
        selectedIndex: null,
        revolutions: 0,
      };

    case 'SHUFFLE':
      const index = Math.floor(Math.random() * state.names.length);
      return {
        ...state,
        selectedIndex: index,
        revolutions: state.revolutions + 1,
      };

    default:
      return state;
  }
};

const INIT_ACTION = { type: '@@INIT' };

const setTitle = title => {
  return { type: 'SET_TITLE', payload: title };
};

const setNames = names => {
  return { type: 'SET_NAMES', payload: names };
};

const shuffle = () => {
  return { type: 'SHUFFLE' };
};

// ---

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

const calcPerspective = x => {
  const a = 52520.53272813499;
  const b = -8606.491632508269;
  const c = 574.6342225406787;
  const d = -19.2031863451813;
  const e = 0.3196385333456;
  const f = -0.0021159573962;
  return Math.round(
    a +
      b * x +
      c * Math.pow(x, 2) +
      d * Math.pow(x, 3) +
      e * Math.pow(x, 4) +
      f * Math.pow(x, 5),
  );
};

const Carousel = ({ selectedIndex, revolutions, children }) => {
  const total = React.Children.count(children);
  const deg = 720 * revolutions + 360 / total * selectedIndex;
  const tz = -Math.round((240 + 10) / 2 / Math.tan(Math.PI / total));
  return (
    <div className="Carousel" style={{ perspective: calcPerspective(total) }}>
      <div
        className="CarouselInner"
        style={{ transform: `translateZ(${tz}px) rotateY(${-deg}deg)` }}
      >
        {React.Children.map(children, (child, i) => (
          <CarouselItem key={i} index={i} total={total}>
            {child}
          </CarouselItem>
        ))}
      </div>
    </div>
  );
};

const CarouselItem = ({ index, total, children }) => {
  const deg = 360 / total * index;
  const tz = Math.round((240 + 10) / 2 / Math.tan(Math.PI / total));
  return (
    <div
      className="CarouselItem"
      style={{ transform: `rotateY(${deg}deg) translateZ(${tz}px)` }}
    >
      {children}
    </div>
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
