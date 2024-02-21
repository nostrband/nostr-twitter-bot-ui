import { useFormik } from "formik";
import { validationShemaForUsername } from "../helpers/validations";
import { useEffect, useState } from "react";
import { Avatar, Button, IconButton, TextField, styled } from "@mui/material";
import SetupForm from "../components/SetupForm";
import twitterLogo from "../assets/images/twitterLogo.png";
import nostrLogo from "../assets/images/nostrLogo.png";
import { nip19 } from "nostr-tools";
import { logout as logoutNostrLogin } from "nostr-login";
import { getAuth } from "../helpers/auth";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import { useNavigate } from "react-router-dom";
import { ndk } from "../App";


function AddUser() {
  const auth = getAuth();

  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [npub, setNpub] = useState(auth?.npub || "");
  const [profile, setProfile] = useState(null);

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

  const isAuthed = !!npub;

  useEffect(() => {
    const load = async () => {
      const { data: pubkey } = nip19.decode(npub);
      const profile = await ndk.fetchEvent({
        kinds: [0],
        authors: [pubkey],
      });
      if (profile) {
        try {
          profile.info = JSON.parse(profile.content);
        } catch {}
      }
      setProfile(profile);
    };

    if (isAuthed) load();
  }, [isAuthed, npub]);

  const signin = async () => {
    const pubkey = await window.nostr.getPublicKey();
    console.log("pubkey", pubkey);
    const npub = nip19.npubEncode(pubkey);
    setNpub(npub);
  };

  const logout = async () => {
    logoutNostrLogin();
    window.localStorage?.setItem("auth", "");
    setProfile(null);
    setNpub("");
  };

  const name =
    profile?.info?.name ||
    profile?.info?.display_name ||
    (npub ? npub.substring(0, 10) + "..." : "");
  const avatar = profile?.info?.picture || "";
  const twitter = profile?.tags.find(
    (t) => t.length >= 2 && t[0] === "i" && t[1].startsWith("twitter:")
  );
  const username = twitter ? twitter[1].split("twitter:")[1] : "";

  const openHistory = () => {
    navigate(`/${username}`)
  }

  return (
    <Container>
      <ContainerLogo className="container-logo">
        <img alt="Twitter" className="twitter-logo" src={twitterLogo} />
        <strong>to</strong>
        <img alt="Nostr" className="nostr-logo" src={nostrLogo} />
      </ContainerLogo>

      <ContainerHeader>Cross-post your tweets to Nostr</ContainerHeader>

      {!isAuthed && (
        <Button variant="contained" onClick={signin} style={{ margin: "1em" }}>
          Get started &rarr;
        </Button>
      )}
      {isAuthed && (
        <ContainerBody>
          <ContainerProfile>
            <Avatar src={avatar}>{name}</Avatar>
            <b>{name}</b>
            <IconButton color="primary" onClick={logout}>
              <LogoutOutlinedIcon />
            </IconButton>
          </ContainerProfile>
          <ContainerForm>
            {username && (
              <ContainerProfile>
                <img alt="Twitter" className="twitter-icon" src={twitterLogo} />
                <b>{username}</b>
                <IconButton color="primary" onClick={() => setOpenModal(true)}>
                  <SettingsOutlinedIcon/>
                </IconButton>
                <IconButton color="primary" onClick={openHistory}>
                  <ListAltOutlinedIcon/>
                </IconButton>
              </ContainerProfile>
            )}
            {!username && (
              <FormStyled onSubmit={formik.handleSubmit}>
                <TextField
                  // fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Your Twitter username"
                  {...formik.getFieldProps("username")}
                  error={
                    formik.touched.username && Boolean(formik.errors.username)
                  }
                />
                <Button variant="outlined" type="submit">
                  Next
                </Button>
              </FormStyled>
            )}
            <SetupForm
              resetUsername={resetUsername}
              openModal={openModal}
              setOpenModal={setOpenModal}
              username={username || formik.values.username}
            />
          </ContainerForm>
        </ContainerBody>
      )}

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

const ContainerBody = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const ContainerHeader = styled("div")`
  justify-content: center;
  padding: 30px 0 0 0;
  font-size: larger;
`;

const ContainerProfile = styled("div")`
  justify-content: start;
  padding: 30px 0 0 0;
  font-size: larger;
  display: flex;
  align-items: center;
  gap: 0.5em;
  .twitter-icon {
    width: 40px;
    height: 40px;
    border-radius: 15px;
    border-radius: 25px;
  }
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
