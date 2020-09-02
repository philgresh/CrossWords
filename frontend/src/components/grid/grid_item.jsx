import React, { useState } from 'react'; 
import styled from 'styled-components'; 

const Input = styled.input`
  width: 2.3rem; 
  height: 2.3rem; 
  border-radius: 0 0 0 0;
  grid-area: ${(props) => props.rowStart} / ${(props) => props.colStart} /
    ${(props) => props.rowEnd} / ${(props) => props.colEnd};
  caret-color: transparent;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 500;
  padding-bottom: 0rem;
  &:focus {
    outline-style: none;
    background-color: #c8c8c8;
  }
  &:hover {
    cursor: pointer;
    background-color: #c8c8c8;
  }
`;

export const GridItem = ({ rowStart, rowEnd, colStart, colEnd }) => {
    let [char, setChar] = useState(""); 

    const update = () => {
        return e => {
            let input = e.target.value;
            let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; 
            if (!chars.split("").concat("").includes(input[input.length - 1])) {
                return;
            }
            setChar(input[input.length - 1]); 
        }
    }

    const handleKeyDown = (e) => {
        return e => {
            if (e && e.keyCode === 8) {
                setChar("");
            }
        }
    }
    
    return (
        <Input type="text"
            rowStart={rowStart} 
            rowEnd={rowEnd} 
            colStart={colStart} 
            colEnd={colEnd}
            value={char.toUpperCase()}
            onKeyDown={handleKeyDown()}
            onChange={update()}
        />
    )
}