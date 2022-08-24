import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField
} from '@mui/material';
import * as mainButtons from '../../features/mainButtonsSlice';
import * as mode from '../../features/modeSlice';
import * as enterInviteCodeDialog from '../../features/dialog/enterInviteCodeDialogSlice';
import WsAction from '../../ws/WsAction';

const EnterInviteCodeDialog = () => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const [dialogData, setDialogData] = React.useState({
    hash: ''
  });

  const handleHashChange = (event: Event) => {
    setDialogData({
      hash: event.target.value
    });
  };

  const handlePlay = () => {
    dispatch(mainButtons.setPlayAFriend());
    dispatch(mode.startAnalysis());
    dispatch(enterInviteCodeDialog.close());
    WsAction.accept(state, dialogData.hash);
  };

  return (
    <Dialog open={state.enterInviteCodeDialog.open} maxWidth="xs" fullWidth={true}>
      <DialogTitle>
        <Grid container>
          <Grid item xs={11}>
            Play a friend
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={() => dispatch(enterInviteCodeDialog.close())}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          required
          name="hash"
          label="Invite code"
          margin="normal"
          onChange={handleHashChange}
        />
        <Button
          fullWidth
          variant="outlined"
          onClick={() => handlePlay()}
        >
          Play
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EnterInviteCodeDialog;
