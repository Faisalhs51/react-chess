import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import boardActionTypes from '../constants/boardActionTypes';
import modeActionTypes from '../constants/modeActionTypes';
import { startBoard } from '../actions/boardActions';
import { wsConnect, wsMssgStartAnalysis, wsMssgPiece } from '../actions/serverActions';
import Ascii from '../utils/Ascii';
import Pgn from '../utils/Pgn';
import Piece from '../utils/Piece';

const Board = ({props}) => {
  const state = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(wsConnect(state, props)).then((ws) => {
      wsMssgStartAnalysis(ws).then(() => {
        dispatch({ type: modeActionTypes.RESET });
        dispatch(startBoard({ back: state.board.history.length - 1 }));
      });
    });
  }, [dispatch]);

  const board = () => {
    let rows = [];
    let color;
    let k = 0;
    Ascii.flip(
      state.board.flip,
      state.board.history[state.board.history.length - 1 + state.history.back]
    ).forEach((rank, i) => {
      let row = [];
      rank.forEach((piece, j) => {
          let payload = { piece: piece };
          (i + k) % 2 !== 0
            ? color = Pgn.symbol.BLACK
            : color = Pgn.symbol.WHITE;
          state.board.flip === Pgn.symbol.WHITE
            ? payload = {...payload, i: i, j: j, algebraic: Ascii.toAlgebraic(i, j)}
            : payload = {...payload, i: 7 - i, j: 7 - j, algebraic: Ascii.toAlgebraic(7 - i, 7 - j)};
          row.push(<div
              key={k}
              className={['square', color].join(' ')}
              onClick={() => {
                if (state.board.picked) {
                  dispatch({
                    type: boardActionTypes.LEAVE_PIECE,
                    payload: payload
                  });
                } else {
                  dispatch({
                    type: boardActionTypes.PICK_PIECE,
                    payload: payload
                  });
                  wsMssgPiece(state, payload.algebraic);
                }
              }}>
              <span tabindex={k}>
                {Piece.unicode[piece].char}
              </span>
            </div>
          );
          k++;
      });
      rows.push(<div key={i} className="board-row">{row}</div>);
    });

    return rows;
  }

  return (
    <div className={['board', state.history.back !== 0 ? 'past' : 'present'].join(' ')}>
      {board()}
    </div>
  );
}

export default Board;
