import React, { useEffect } from 'react';
import { useStateValue } from '../custom_hooks/useState';
import GridContainerCLASS from '../grid/grid_container';
import { TimeScoreClue } from '../time_score_clue/time_score_clue';
import { updateGameDetails } from '../../actions/game_actions';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import background from '../../images/textured_paper/textured_paper_@2X.png';
const MainContainer = styled.div`
  display: flex;
  padding-top: 5rem;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  overflow-x: scroll;
  overflow-y: scroll;
  background-image: url(${background});
`;

export default (props) => {
  const [state] = useStateValue();
  const dispatch = useDispatch();
  let guess = state['guess'];

  const updateGame = ({ gameId, timeRemaining, timeElapsed, guess }) => {
    console.log('here');
    return dispatch(
      updateGameDetails({ gameId, timeRemaining, timeElapsed, guess }),
    );
  };

  useEffect(() => {
    if (guess) {
      updateGame({
        gameId: props.gameId,
        timeRemaining: props.seconds,
        timeElapsed: props.secondsElapsed,
        guess,
      });
    }
  }, [guess]);

  return (
    <MainContainer>
      <TimeScoreClue
        newGame={props.newGame}
        game={props.gameObj}
        clue={props.clue}
        score={props.score}
        handleSeconds={props.handleSeconds}
        endGame={props.endGame}
        timeRemaining={props.timeRemaining}
      />
      <GridContainerCLASS game={props.gameObj} />
    </MainContainer>
  );
};
