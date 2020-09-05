import { gridReducer } from './grid_reducer';
import { secondReducer } from './second_reducer';
import { guessReducer } from './guess_reducer';
import { secondsElapsedReducer } from './seconds_elapsed_reducer';

const grid = {};
const seconds = {};
const secondsElapsed = {};
for (let i = 0; i < 20; i++) grid[i + 1] = {};
export const initialState = { grid, seconds, secondsElapsed };

export const mainReducer = ({ grid, seconds, secondsElapsed, guess }, action) => ({
    grid: gridReducer(grid, action),
    seconds: secondReducer(seconds, action),
    guess: guessReducer(guess, action),
    secondsElapsed: secondsElapsedReducer(secondsElapsed, action),
});