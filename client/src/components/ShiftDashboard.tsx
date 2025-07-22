import React from "react";
import { Container, Grid, Typography, Paper } from "@mui/material";
import AvailableShifts from "./AvailableShifts";
import BookedShifts from "./BookedShifts";

const ShiftDashboard: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          textAlign: "left",
          mb: 4,
          fontWeight: 700,
          color: "text.primary",
          textShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        My Shifts Dashboard
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <AvailableShifts />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <BookedShifts />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ShiftDashboard;
