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

export default function CustomLoader({ isLoading }) {
  return (
    <div>
      <Dialog
        open={isLoading}
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
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <p className="text-white text-[24px] font-raleway mr-4 text-center">
            Summoning Gandalf to guide us back to your precious queries. You
            shall not pass... without answers!
          </p>
          <SyncLoader
            className="mt-4"
            color={"#fff"}
            loading={true}
            size={10}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </Box>
      </Dialog>
    </div>
  );
}
