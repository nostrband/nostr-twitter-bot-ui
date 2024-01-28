import React from 'react';
import { useSelector } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styled from '@emotion/styled';
import OpenIcon from '../assets/icons/OpenIcon';
import BackIcon from '../assets/icons/BackIcon';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { nip19 } from '@nostrband/nostr-tools';

const Histories = () => {
  const { data, username } = useSelector((state) => state.histories.histories);
  const navigate = useNavigate();

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Container>
      <Button onClick={() => navigate('/')} variant="contained" type="submit">
        <span className="go-back"> Go back</span> <BackIcon />
      </Button>
      <h2>History of imported tweets for {username}:</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Tweet ID</TableCell>
              <TableCell>Event ID</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell align="center">Open</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((history) => (
              <TableRow
                key={history.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {history.tweetId}
                </TableCell>
                <TableCell component="th" scope="row">
                  {history.eventId}
                </TableCell>
                <TableCell>{formatDate(history.timestamp)}</TableCell>
                <TableCell align="center">
                  <a
                    className="link"
                    href={`https://nostrapp.link/${nip19.noteEncode(
                      history.eventId
                    )}`}
                    target="_blank"
                  >
                    <OpenIcon />
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Histories;

const Container = styled('div')`
  padding: 40px;
  .go-back {
    margin: 0 10px 0 0;
  }
  .link {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 10px;
  }
`;
