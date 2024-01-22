import React from 'react';
import Modal from './Modal';
import { Button, styled, FormControl } from '@mui/material';
import CreatableSelect from 'react-select/creatable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useFormik } from 'formik';
import { validationSchemaForRelays } from '../helpers/validations';

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

function SetupForm({ openModal, setOpenModal, username, resetUsername }) {
  const formik = useFormik({
    initialValues: { selectedRelays: [] },
    validationSchema: validationSchemaForRelays,
    onSubmit: async (values) => {
      try {
        const response = await axios.post('/our-endpoint', {
          username,
          relays: values.selectedRelays.map((item) => item.value),
        });
        toast.success('Success!');
        resetUsername();
        setOpenModal(false);
      } catch (error) {
        toast.error('Error: ' + error.message);
      }
    },
  });

  return (
    <div>
      <ToastContainer />
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <FormStyled onSubmit={formik.handleSubmit}>
          <label>Relays</label>
          <CreatableSelect
            isMulti
            name="selectedRelays"
            classNamePrefix="select"
            onChange={(value) => formik.setFieldValue('selectedRelays', value)}
            value={formik.values.selectedRelays}
            styles={customStyles(
              formik.errors.selectedRelays && formik.touched.selectedRelays
            )}
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
`;

const StyledButton = styled(Button)`
  width: 100px;
`;
