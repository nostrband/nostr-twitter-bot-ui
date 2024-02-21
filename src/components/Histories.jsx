import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import styled from "@emotion/styled";
import BackIcon from "../assets/icons/BackIcon";
import { Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { nip19 } from "nostr-tools";
import { API_ENDPOINT } from "../helpers/constants";

const Histories = () => {
  // const { data, username } = useSelector((state) => state.histories.histories);
  const navigate = useNavigate();
  const { username } = useParams();
  const [data, setData] = useState([])

  const getTweetsFromHistory = async (username) => {
    try {
      const r = await fetch(
        `${API_ENDPOINT}/history?username=${username}`
      );
      const data = await r.json();

      // const ids = data?.map(e => e.eventId)
      // const events = await ndk.fetchEvents({
      //   ids
      // })
      // console.log({ data, ids, events });
      
      setData(data);
    } catch (error) {
      return console.log(error, "ERROR");
    }
  };

  useEffect(() => {
    getTweetsFromHistory(username);
  }, [username]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Container>
      <Button onClick={() => navigate("/")} variant="contained" type="submit">
        <span className="go-back"> Go back</span> <BackIcon />
      </Button>
      <h2>Tweets of @{username}:</h2>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Tweets</StyledTableCell>
              {/* <StyledTableCell>Event ID</StyledTableCell>
              <StyledTableCell>Timestamp</StyledTableCell> */}
              {/* <StyledTableCell align="center">Open</StyledTableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length > 0 ? (
              data.map((history) => (
                <TableRow
                  key={history.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <StyledTableCell component="th" scope="row">
                    <a
                      className="link"
                      href={`https://twitter.com/${username}/status/${history.tweetId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {history.tweetId}
                    </a>
                    <a
                      className="link"
                      href={`https://nostrapp.link/${nip19.noteEncode(
                        history.eventId
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {nip19.noteEncode(history.eventId).substring(0, 17) + "..."}
                    </a>
                    <small>{formatDate(history.timestamp)}</small>
                  </StyledTableCell>
                  {/* <StyledTableCell component="th" scope="row">
                    <a
                      className="link"
                      href={`https://nostrapp.link/${nip19.noteEncode(
                        history.eventId
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {history.eventId.substring(0, 10) + "..."}
                    </a>
                  </StyledTableCell> */}
                  {/* <StyledTableCell>
                    {formatDate(history.timestamp)}
                  </StyledTableCell> */}
                  {/* <StyledTableCell align="center">
                    <a
                      className="link"
                      href={`https://nostrapp.link/${nip19.noteEncode(
                        history.eventId
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <OpenIcon />
                    </a>
                  </StyledTableCell> */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <StyledTableCell colSpan={4} style={{ textAlign: "center" }}>
                  Nothing yet
                </StyledTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Histories;

const Container = styled("div")`
  padding: 40px;
  .go-back {
    margin: 0 10px 0 0;
  }
  .link {
    display: flex;
    justify-content: start;
    align-items: center;
    cursor: pointer;
  }
  .nothing-text {
    text-align: center;
    border: 1px solid red;
  }
`;

const StyledTableCell = styled(TableCell)`
  font-family: "Open Sans", sans-serif;
  display: flex;
  flex-direction: column;
  padding: 6px;
`;
