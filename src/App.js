import { useFormik } from 'formik';
import { validationShemaForUsername } from './helpers/validations';
import { useState } from 'react';
import { Button, TextField, styled } from '@mui/material';
import SetupForm from './components/SetupForm';

function App() {
  const [openModal, setOpenModal] = useState(false);

  const formik = useFormik({
    initialValues: { username: '' },
    validationSchema: validationShemaForUsername,
    onSubmit: () => {
      setOpenModal(true);
    },
  });

  const resetUsername = () => {
    formik.setFieldValue('username', '', false);
  };

  return (
    <Container className="App">
      <FormStyled onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Username"
          {...formik.getFieldProps('username')}
          error={formik.touched.username && Boolean(formik.errors.username)}
        />
        <Button variant="contained" type="submit">
          Next
        </Button>
      </FormStyled>
      <SetupForm
        resetUsername={resetUsername}
        openModal={openModal}
        setOpenModal={setOpenModal}
        username={formik.values.username}
      />
    </Container>
  );
}

export default App;

const FormStyled = styled('form')`
  width: 400px;
  display: flex;
  gap: 10px;
`;

const Container = styled('div')`
  display: flex;
  justify-content: center;
  padding: 50px 0 0 0;
  font-family: 'Raleway', sans-serif;
`;
