import React, { useContext } from "react";
import {
  Dialog,
  Snackbar,
  CircularProgress,
  Box,
  LinearProgress,
} from "@mui/material";
import { BarLoader, SyncLoader } from "react-spinners";
import { UserContext } from "../contexts/UserContext";

export default function Loader() {
  const [loading] = useContext(UserContext);
  return (
    <div>
      <Dialog
        open={loading}
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <SyncLoader
            color={"#fff"}
            loading={true}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </Box>
      </Dialog>
    </div>
  );
}
