import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useDispatch, useSelector } from 'react-redux';
import * as fenMode from 'features/mode/fenModeSlice';

export default function LoadImageDialog() {
  const state = useSelector((state) => state);

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(fenMode.loadImageDialog({ open: false }))
  };

  return (
    <div>
      <Dialog
        open={state.fenMode.dialogs.loadImage.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Soon available, please be patient!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
