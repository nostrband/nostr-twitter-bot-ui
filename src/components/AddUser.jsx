import { useFormik } from "formik";
import { validationShemaForUsername } from "../helpers/validations";
import { useState } from "react";
import { Button, TextField, styled } from "@mui/material";
import SetupForm from "../components/SetupForm";
import twitterLogo from "../assets/images/twitterLogo.png";
import nostrLogo from "../assets/images/nostrLogo.png";

function AddUser() {
  const [openModal, setOpenModal] = useState(false);

  const formik = useFormik({
    initialValues: { username: "" },
    validationSchema: validationShemaForUsername,
    onSubmit: () => {
      setOpenModal(true);
    },
  });

  const resetUsername = () => {
    formik.setFieldValue("username", "", false);
  };

  return (
    <Container>
      <ContainerLogo className="container-logo">
        <img alt='Twitter' className="twitter-logo" src={twitterLogo} />
        <strong>to</strong>
        <img alt='Nostr' className="nostr-logo" src={nostrLogo} />
      </ContainerLogo>

      <ContainerHeader>
        Cross-post your tweets to Nostr
      </ContainerHeader>

      <ContainerForm>
        <FormStyled onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Your Twitter username"
            {...formik.getFieldProps("username")}
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
      </ContainerForm>

      <ContainerFooter>
        <a href="https://github.com/nostrband/nostr-twitter-bot-ui">
          Open-source
        </a>{" "}
        service by <a href="https://nostr.band">Nostr.Band</a>.
      </ContainerFooter>
    </Container>
  );
}

export default AddUser;

const FormStyled = styled("form")`
  width: 300px;
  display: flex;
  gap: 10px;
`;

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0 0 0;
  font-family: "Open Sans", sans-serif;
`;

const ContainerHeader = styled("div")`
  justify-content: center;
  padding: 30px 0 0 0;
  font-size: larger;
`;

const ContainerForm = styled("div")`
  display: flex;
  justify-content: center;
  padding: 30px 0 0 0;
`;

const ContainerFooter = styled("div")`
  justify-content: center;
  padding: 50px 0 0 0;
  font-size: smaller;
  color: grey;
`;

const ContainerLogo = styled("div")`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 1.3rem;
  .twitter-logo {
    width: 80px;
    height: 80px;
    border-radius: 15px;
    border-radius: 25px;
  }
  .nostr-logo {
    width: 80px;
    height: 80px;
    border-radius: 25px;
  }
`;
