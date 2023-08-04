import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import * as playerAutocomplete from 'features/autocomplete/playerAutocompleteSlice';
import * as warningAlert from 'features/alert/warningAlertSlice';

const filterOptions = createFilterOptions({
  matchFrom: 'any',
  limit: 25,
});

const BlackPlayerAutocomplete = ({props}) => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <Autocomplete
      loading
      id="Black"
      options={state.playerAutocomplete.data}
      filterOptions={filterOptions}
      renderInput={(params) =>
        <TextField {...params}
          label="Black"
          variant="filled"
          name="Black"
          onClick={() => {
            if (state.playerAutocomplete.data.length === 0) {
              fetch(`${props.api.prot}://${props.api.host}:${props.api.port}/api/autocomplete/player`)
                .then(res => {
                  if (res.status === 200) {
                    res.json().then(data => {
                      dispatch(playerAutocomplete.set(data));
                    });
                  } else {
                    dispatch(warningAlert.show({ mssg: 'Whoops! Something went wrong, please try again.' }));
                  }
                });
            }
          }}
        />}
    />
  );
};

export default BlackPlayerAutocomplete;
