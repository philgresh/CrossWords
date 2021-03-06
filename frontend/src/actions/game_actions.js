import { getNewGame, patchGame } from '../util/game_util';
import * as APIUtil from '../util/session_api_util';
import { setUpToken } from './session_actions';

export const RECEIVE_ACTIVE_GAME = 'RECEIVE_ACTIVE_GAME';
export const RECEIVE_GAME_DETAILS = 'RECEIVE_GAME_DETAILS';
export const RECEIVE_GAME_ERRORS = 'RECEIVE_GAME_ERRORS';
export const CLEAR_GAME_STATE = 'CLEAR_GAME_STATE';

const receiveActiveGame = (game) => ({
  type: RECEIVE_ACTIVE_GAME,
  game,
});

const receiveGameDetails = (gameDetails) => ({
  type: RECEIVE_GAME_DETAILS,
  gameDetails,
});

const receiveGameErrors = (errors) => ({
  type: RECEIVE_GAME_ERRORS,
  errors,
});

const wipeGameState = () => ({
  type: CLEAR_GAME_STATE,
});

export const fetchNewGame = (boardWidth = 20, colStart = 100) => (dispatch) =>
  getNewGame(boardWidth, colStart).then(
    ({ data }) => dispatch(receiveActiveGame(data)),
    (err) => dispatch(receiveGameErrors(err.message)),
  );

// gameUpdates is a POJO of the form: {gameId: String, guess: String, timeRemaining: Number, timeElapsed: Number }
export const updateGameDetails = (gameUpdates, cheated=false) => (dispatch) =>
  patchGame(gameUpdates, cheated).then(
    ({ data }) => {
      if (data.token) setUpToken(data.token, dispatch);
      dispatch(receiveGameDetails(data));
    },
    (err) => dispatch(receiveGameErrors(err.message)),
  );

export const clearGameState = () => (dispatch) => {
  dispatch(wipeGameState());
  return dispatch(fetchNewGame());
};
