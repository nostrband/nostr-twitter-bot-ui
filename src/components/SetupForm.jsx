import React, { useState } from "react";
import Modal from "./Modal";
import {
  Button,
  styled,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CreatableSelect from "react-select/creatable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
import { useFormik } from "formik";
import { validationSchemaForRelays } from "../helpers/validations";
import { API_ENDPOINT } from "../helpers/constants";
import { nip19 } from "nostr-tools";
import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { setHistories } from "../redux/historiesSlice";
import { getAuth } from "../helpers/auth";
import { sendPostAuthd } from "../helpers/nip98";

const customStyles = (error) => ({
  control: (provided) => ({
    ...provided,
    borderColor: error ? "red" : provided.borderColor,
    boxShadow: error ? "0 0 0 1px red" : provided.boxShadow,
    "&:hover": {
      borderColor: error ? "red" : provided.borderColor,
    },
  }),
});

function SetupForm({ openModal, setOpenModal, username, resetUsername }) {
  const [broadcastType, setBroadcastType] = useState("public");
  const [verify, setVerify] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth();

  const formik = useFormik({
    initialValues: { selectedRelays: [], bunkerUrl: "", verifyTweetLink: "" },
    validationSchema:
      broadcastType !== "public" ? validationSchemaForRelays : null,
    onSubmit: async (values) => {
      try {
        console.log({ values });

        const { data: pubkey } = nip19.decode(auth.npub);
        const bunkerUrl = `bunker://${pubkey}?relay=${auth.relays[0]}`;
        await sendPostAuthd({
          url: `${API_ENDPOINT}/add`,
          method: "POST",
          body: JSON.stringify({
            username,
            relays: values.selectedRelays.map((item) => item.value),
            bunkerUrl: bunkerUrl,
            bunkerNsec: auth.localNsec,
            verifyTweetId: values.verifyTweetLink,
          }),
        });
        // await axios.post(`${API_ENDPOINT}/add`, {
        //   username,
        //   relays: values.selectedRelays.map((item) => item.value),
        //   bunkerUrl: values.bunkerUrl,
        //   verifyTweetId: values.verifyTweetLink,
        // });
        toast.success("Success!");
        navigate(`/${username}`);
        // reset stuff
        setVerify(false);
        resetUsername();
        // getTweetsFromHistory(username);

        setOpenModal(false);
      } catch (error) {
        switch (error.cause?.status) {
          case 401:
            setVerify(true);
            break;
          case 400:
          case 403:
          case 405:
          case 500:
            toast.error("Error: " + error.cause?.body);
            break;
          default:
            toast.error("Error: " + error.message);
        }
        console.log({ error });
      }
    },
  });

  const handleBroadcastTypeChange = (event) => {
    setBroadcastType(event.target.value);
    if (event.target.value === "public") {
      formik.setFieldValue("selectedRelays", []);
    }
  };

  const handleClose = () => {
    setVerify(false);
    setOpenModal(false);
  };

  let verifyText = "";
  if (auth) {
    try {
      verifyText = encodeURIComponent(
        `Verifying my account on nostr\n\nMy Public key: "${auth.npub}"`
      );
    } catch (e) {}
  }

  return (
    <div>
      <ToastContainer />
      <Modal open={openModal} onClose={handleClose}>
        <FormStyled onSubmit={formik.handleSubmit}>
          {/* <input type="hidden" {...formik.getFieldProps("username")} /> */}

          <label>Publishing:</label>
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
              label="To default public relays"
            />
            <FormControlLabel
              value="specific"
              control={<Radio />}
              label="To specific relays"
            />
          </RadioGroup>

          {/* <label>Relays:</label> */}
          <CreatableSelect
            isMulti
            isDisabled={broadcastType === "public"}
            name="selectedRelays"
            classNamePrefix="select"
            placeholder="Enter relay urls"
            onChange={(value) => formik.setFieldValue("selectedRelays", value)}
            value={formik.values.selectedRelays}
            styles={customStyles(
              formik.errors.selectedRelays &&
                formik.touched.selectedRelays &&
                broadcastType !== "public"
            )}
            options={[
              {
                value: "wss://testrelay.nostrapps.org",
                label: "wss://testrelay.nostrapps.org",
              },
              { value: "wss://nos.lol", label: "wss://nos.lol" },
              { value: "wss://relay.exit.pub", label: "wss://relay.exit.pub" },
              {
                value: "wss://nostr.mutinywallet.com",
                label: "wss://nostr.mutinywallet.com",
              },
              { value: "wss://relay.damus.io", label: "wss://relay.damus.io" },
              {
                value: "wss://relay.nostr.band",
                label: "wss://relay.nostr.band",
              },
              {
                value: "wss://nostr.mom",
                label: "wss://nostr.mom",
              },
            ]}
          />

          {/* <label>Connect to your keys:</label>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            name="bunkerUrl"
            value={formik.values.bunkerUrl}
            onChange={(value) =>
              formik.setFieldValue('bunkerUrl', value.target.value)
            }
            placeholder="Bunker url"
          />
          <span className="description-bunkerUrl">
            Leave blank to keep the existing connection. 
            Try <Link to='https://nsec.app' target="_blank">nsec.app</Link> to provide safe access to your keys.
          </span> */}

          {/* {verify && !verifyText && <label>Provide a valid bunkerUrl!</label>} */}

          {verify && (
            <>
              <label style={{ marginTop: "0.5em" }}>
                Verify your Twitter account:
              </label>
              <span className="description-bunkerUrl">
                You must verify that you own the <b>@{username}</b> account.
                Click to{" "}
                <Link
                  to={`https://twitter.com/intent/tweet?text=${verifyText}`}
                  target="_blank"
                >
                  publish verification tweet
                </Link>
                , then paste the tweet link below.
              </span>

              <label>Verification tweet link:</label>
              <TextField
                // fullWidth
                size="small"
                variant="outlined"
                name="verifyTweetLink"
                value={formik.values.verifyTweetLink}
                onChange={(value) =>
                  formik.setFieldValue("verifyTweetLink", value.target.value)
                }
                placeholder={`https://twitter.com/${username}/status/123......789`}
              />
              <span className="description-bunkerUrl">
                Paste the tweet link after you post a verification tweet.
              </span>
            </>
          )}

          <StyledButton
            disabled={formik.isSubmitting}
            size="small"
            type="submit"
            variant="outlined"
          >
            Save
          </StyledButton>

          {formik.isSubmitting && (
            <span className="description-bunkerUrl">
              Connecting to your keys...
              <br />
              Please confirm key access in your key storage app!
            </span>
          )}
        </FormStyled>
      </Modal>
    </div>
  );
}

export default SetupForm;

const FormStyled = styled("form")`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: "Open Sans", sans-serif;
  padding: 15px 5px 15px 5px;
  .MuiInputBase-input {
    font-family: "Open Sans", sans-serif;
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
    font-family: "Open Sans", sans-serif;
  }
`;

const StyledButton = styled(Button)`
  width: 100px;
`;
