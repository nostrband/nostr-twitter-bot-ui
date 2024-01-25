import React, { useState } from 'react';
import Modal from './Modal';
import {
  Button,
  styled,
  FormControl,
  TextField,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import CreatableSelect from 'react-select/creatable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useFormik } from 'formik';
import { validationSchemaForRelays } from '../helpers/validations';
import { API_ENDPOINT } from '../helpers/constants';

const customStyles = (error) => ({
  control: (provided) => ({
    ...provided,
    borderColor: error ? 'red' : provided.borderColor,
    boxShadow: error ? '0 0 0 1px red' : provided.boxShadow,
    '&:hover': {
      borderColor: error ? 'red' : provided.borderColor,
    },
  }),
});

const getTweetsFromHistory = async (username) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINT}/history?username=${username}`
    );
    return console.log(response, 'RESPONSE');
  } catch (error) {
    return console.log(error, 'ERROR');
  }
};

function SetupForm({ openModal, setOpenModal, username, resetUsername }) {
  const [broadcastType, setBroadcastType] = useState('public');
  const formik = useFormik({
    initialValues: { selectedRelays: [] },
    validationSchema:
      broadcastType !== 'public' ? validationSchemaForRelays : null,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${API_ENDPOINT}/add`, {
          username,
          relays: values.selectedRelays.map((item) => item.value),
        });
        toast.success('Success!');
        resetUsername();
        getTweetsFromHistory(username);
        setOpenModal(false);
      } catch (error) {
        toast.error('Error: ' + error.message);
      }
    },
  });

  const handleBroadcastTypeChange = (event) => {
    setBroadcastType(event.target.value);
    if (event.target.value === 'public') {
      formik.setFieldValue('selectedRelays', []);
    }
  };

  return (
    <div>
      <ToastContainer />
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <FormStyled onSubmit={formik.handleSubmit}>
          <label>Broadcast Type</label>
          <RadioGroup
            row
            className="radio-group-block"
            value={broadcastType}
            onChange={handleBroadcastTypeChange}
            name="broadcastType"
          >
            <FormControlLabel
              value="public"
              control={<Radio />}
              label="Broadcast to public relays"
            />
            <FormControlLabel
              value="specific"
              control={<Radio />}
              label="Broadcast to specific relays"
            />
          </RadioGroup>

          <label>Bunker url</label>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            value={formik.values.bunkerUrl}
            {...formik.getFieldProps('username')}
            placeholder="Bunker url"
          />
          <span className="description-bunkerUrl">
            Paste URL from your nsecbunker
          </span>
          <label>Relays</label>
          <CreatableSelect
            isMulti
            isDisabled={broadcastType === 'public'}
            name="selectedRelays"
            classNamePrefix="select"
            placeholder="Relays"
            onChange={(value) => formik.setFieldValue('selectedRelays', value)}
            value={formik.values.selectedRelays}
            styles={customStyles(
              formik.errors.selectedRelays &&
                formik.touched.selectedRelays &&
                broadcastType !== 'public'
            )}
            options={[
              { value: 'wss://nos.lol', label: 'wss://nos.lol' },
              { value: 'wss://relay.exit.pub', label: 'wss://relay.exit.pub' },
              {
                value: 'wss://nostr.mutinywallet.com',
                label: 'wss://nostr.mutinywallet.com',
              },
              { value: 'wss://relay.damus.io', label: 'wss://relay.damus.io' },
              {
                value: 'wss://relay.nostr.band',
                label: 'wss://relay.nostr.band',
              },
              {
                value: 'wss://nostr.mom',
                label: 'wss://nostr.mom',
              },
            ]}
          />

          <StyledButton size="small" type="submit" variant="contained">
            OK
          </StyledButton>
        </FormStyled>
      </Modal>
    </div>
  );
}

export default SetupForm;

const FormStyled = styled('form')`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: 'Raleway', sans-serif;
  padding: 15px 5px 15px 5px;
  .MuiInputBase-input {
    font-family: 'Raleway', sans-serif;
    padding-left: 10px;
    &::placeholder {
      color: #808080;
      opacity: 1;
    }
  }
  .description-bunkerUrl {
    font-size: 0.9rem;
    color: #616060;
  }
  .MuiFormControlLabel-root {
    height: 30px;
  }
  .MuiTypography-root {
    font-family: 'Raleway', sans-serif;
  }
`;

const StyledButton = styled(Button)`
  width: 100px;
`;
