import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import Movetext from 'common/Movetext.js';
import * as board from 'features/board/boardSlice';
import * as panel from 'features/panel/panelSlice';
import styles from 'styles/panel';
import Ws from 'features/ws/Ws';

const MovesTable = () => {
  const state = useSelector(state => state);

  const dispatch = useDispatch();

  useEffect(() => {
    if (state.board.lan && !state.board.pieceGrabbed) {
      const from = state.board.lan?.charAt(1);
      const to = state.board.lan?.charAt(3);
      if (
        from === '7' && to === '8' &&
        state.board.piecePlaced?.ascii === ' P '
      ) {
        dispatch(board.promotionDialog({ open: true }));
      } else if (
        from === '2' && to === '1' &&
        state.board.piecePlaced?.ascii === ' p '
      ) {
        dispatch(board.promotionDialog({ open: true }));
      } else {
        Ws.playLan();
      }
    }
  }, [
    state.board.pieceGrabbed,
    state.board.lan,
    state.board.piecePlaced?.ascii,
    dispatch
  ]);

  const currentMove = (fen) => {
    if (state.board.fen.length - 1 + state.panel.history.back === fen ) {
      return styles.panel.movesTable.tableCell.currentMove;
    }

    return {};
  };

  const moves = () => {
    let j = 1;
    let rows = Movetext.toRows(
      state.board.movetext?.replace(/\s?\{[^}]+\}/g, '')
        .replace(/\s?\$[1-9][0-9]*/g, '')
        .trim()
    );
    rows.forEach((row, i) => {
      if (row.w !== '...') {
        row.wFen = j;
        j += 1;
      }
      if (row.b) {
        row.bFen = j;
        j += 1;
      }
    });

    return rows.map((row, i) => {
      return <TableRow key={i} sx={styles.panel.movesTable.tableRow}>
        <TableCell sx={styles.panel.movesTable.tableCell.nMove}>{row.n}</TableCell>
        <TableCell
          sx={[styles.panel.movesTable.tableCell, currentMove(row.wFen)]}
          onClick={() => {
            if (row.w !== '...') {
              dispatch(panel.goTo({ back: state.board.fen.length - 1 - row.wFen }));
            }
          }}
        >
          {row.w}
        </TableCell>
        <TableCell
          sx={[styles.panel.movesTable.tableCell, currentMove(row.bFen)]}
          onClick={() => {
            if (row.b) {
              dispatch(panel.goTo({ back: state.board.fen.length - 1 - row.bFen }));
            }
          }}
        >
          {row.b}
        </TableCell>
      </TableRow>
    });
  };

  if (!state.ravMode.active) {
    return (
      <TableContainer sx={styles.panel.movesTable.tableContainer} className="noTextSelection">
        <Table stickyHeader size="small" aria-label="Movetext">
          <TableBody>
            {moves()}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return null;
}

export default MovesTable;
