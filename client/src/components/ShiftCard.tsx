import React from "react";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import { format } from "date-fns";
import { Shift } from "../types";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

interface ShiftCardProps {
  shift: Shift;
  actionButton: React.ReactNode;
}

const ShiftCard: React.FC<ShiftCardProps> = ({ shift, actionButton }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        position: "relative",
        overflow: "visible",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, primary.main, primary.light)",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "primary.main",
          }}
        >
          <PlaceOutlinedIcon />
          {shift.workplaceId}
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
            }}
          >
            <AccessTimeOutlinedIcon />
            {format(new Date(shift.startAt), "PPP")}
          </Typography>
          <Chip
            label={`${format(new Date(shift.startAt), "p")} - ${format(new Date(shift.endAt), "p")}`}
            size="small"
            sx={{
              backgroundColor: "primary.light",
              color: "white",
              fontWeight: 500,
            }}
          />
        </Box>
        {actionButton}
      </CardContent>
    </Card>
  );
};

export default ShiftCard;
