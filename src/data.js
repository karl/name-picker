import queryString from 'query-string';

const divider = '•';

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

export { divider, reducer, INIT_ACTION, setTitle, setNames, shuffle };
