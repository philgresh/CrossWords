/* eslint-disable consistent-return */

const Word = require('../../../../models/Word');

const PREFERRED_OVERLAP = 3;

// shuffle function
function shuffle(a) {
  let j;
  let x;
  const newArr = [...a];

  for (let i = a.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    newArr[i] = a[j];
    newArr[j] = x;
  }
  return newArr;
}

// gets difficulty

const getDifficulty = (guessed) => {
  let difficulty = 1;
  if (guessed.length > 5) {
    difficulty = 2;
  } else if (guessed.length > 10) {
    difficulty = 3;
  }
  return difficulty;
};

/**
 * Get the overlap between two words and a vector from the beginning or end of A.
 * @param {String} a "Old word" against which we test the
 * @param {String} b "New word"
 * @param {[Boolean]} oneTimeOnly Allows one recursive call to check the reverse situation.
 * @returns {Integer} - Positive values indicate that word A lines up with the
 *                      first X characters of word B.
 *                      Negative values indicate that word B lines up
 *                      with the last X characters of A
 * @example getOverlap("PIZZA", "ZAP") === -2
 * @example getOverlap("ZAP", "PIZZA") === -1
 * @example getOverlap("BLAH", "AHA") === -2
 * @example getOverlap("BLAH", "CABLA") === 3
 */
const getOverlap = (a, b, oneTimeOnly = false) => {
  if (a.length === 0 || b.length === 0) return 0;

  let i = 0;
  const firstWordSuffix = a.slice(a.length - PREFERRED_OVERLAP);
  while (i < PREFERRED_OVERLAP) {
    const suffixSlice = firstWordSuffix.slice(i);
    const secondWordSlice = b.slice(0, PREFERRED_OVERLAP - i);
    if (suffixSlice === secondWordSlice) {
      const modifier = oneTimeOnly ? 1 : -1;
      return modifier * (PREFERRED_OVERLAP - i);
    }
    i++;
  }
  if (oneTimeOnly) return 0;
  return getOverlap(b, a, true);
};

// get word sub. If dir = false, board moving from left to right,
// suffix of last word == prefix of next word
// If true, moving from right to left, prefix of
// last word == suffix of next word

const getWordSub = (prevWord, dir) => {
  if (dir) {
    return prevWord.slice(0, 3);
  }
  return prevWord.slice(prevWord.length - 3);
};

// Get array of subs of word sub.
// word is JAMES
// If dir is false, MES becomes [MES, ES, S]; left to right
// if dir is true, JAM becomes [JAM, JA, J]; right to left

const genWordSubArray = (guessed, dir) => {
  if (guessed.length === 0) {
    const randLetter = Math.floor(Math.random() * 26);
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[randLetter];
  }

  const prevWord = guessed[guessed.length - 1];
  const wordSub = getWordSub(prevWord, dir);
  console.log(wordSub);
  if (dir) {
    return wordSub
      .split('')
      .map((_ele, i) => wordSub.slice(0, i + 1)) // slices beginning of word. 0,1 - 0,2 - 0,3
      .reverse();
  }

  // this was the broken one - fixed it
  return wordSub
    .split('')
    .map((_ele, i) => wordSub.slice(2 - i))
    .reverse(); // slices end of word. 2,3 - 1,3 - 0,3
};

// queries database for possible next words list of 10 words

/**
 * Generates an array to pass into a MongoDB query
 * @param {String} wordSub - Substring to match a new word up to
 * @param {Boolean} suffix - True if we're trying to match a new word
 * to the suffix of the last word
 * @returns {Model{Word}}
 */

const shouldSwapDir = (dir) => {
  let dirWordCount = 0;
  dirWordCount += 1;
  const randomNum = Math.random();
  switch (dirWordCount % 5) {
    case 1:
      if (randomNum < 0.15) {
        return !dir;
      }
      return dir;
    case 2:
      if (randomNum < 0.3) {
        return !dir;
      }
      return dir;
    case 3:
      if (randomNum < 0.6) {
        return !dir;
      }
      return dir;
    case 4:
      if (randomNum < 0.85) {
        return !dir;
      }
      return dir;
    default:
      return !dir;
  }
};

const getMaxLength = (guessed) => {
  if (guessed.length < 5) {
    return 5;
  } else if (guessed.length < 10) {
    return 7;
  } else if (guessed.length < 15) {
    return 10;
  }

  return 20;
};

/**
 * Queries DB for a word with given characteristics
 * @param {Array} guessed
 * @param {Integer} difficulty
 * @param {Integer} maxLength
 * @param {Boolean} dir
 */
const possibleNextWords = (guessed, dir, maxLength, answersSent) => {
  const wordSubArray = genWordSubArray(guessed, dir);
  const difficulty = getDifficulty(guessed);
  let direction = 'prefixes';
  if (dir) direction = 'suffixes';

  maxLength = Number(maxLength);
  maxLength = getMaxLength(guessed);

  const options = {
    length: { $lte: maxLength },
    difficulty: { $lte: difficulty },
    [direction]: { $in: wordSubArray },
    answer: { $nin: guessed },
    _id: { $nin: answersSent },
  };

  return Word.find(options)
    .sort({
      [direction]: -1,
      // length: -1,
    })
    .limit(40)
    .exec()
    .catch((err) => console.log(err));
};

const getOneWord = (params) => {
  return possibleNextWords(...params)
    .then((res) => {
      return shuffle(res)[0];
    })
    .catch((err) => console.error(err));
};

async function getNextWord(guessed, answersSent, maxLength = 12) {
  let dir = false;
  const guessedWord = guessed[guessed.length - 1];
  dir = shouldSwapDir(dir);
  let word = await getOneWord(guessed, dir, maxLength, answersSent);

  if (!word) {
    word = await getOneWord(guessed, !dir, maxLength, answersSent);
  }
  const overlap = getOverlap(guessedWord, word.answer, dir);
  return [word, overlap, dir];
}

module.exports = getNextWord;
