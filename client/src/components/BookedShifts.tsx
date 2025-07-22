import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Typography, Button, CircularProgress, Box } from "@mui/material";
import { CURRENT_WORKER_ID } from "../App";
import ShiftCard from "./ShiftCard";
import { PaginatedResponse, Shift } from "../types";
import axios from "axios";

const BookedShifts: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["booked-shifts"],
    queryFn: () => axios.get<PaginatedResponse<Shift>>(`/api/shifts`),
  });

  const cancelMutation = useMutation({
    mutationFn: (shiftId: number) => {
      return axios.post<Shift>(`/api/shifts/${shiftId}/cancel`, {
        workerId: CURRENT_WORKER_ID,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["available-shifts"] });
      queryClient.invalidateQueries({ queryKey: ["booked-shifts"] });
    },
    onError: () => {},
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Typography color="error">Error loading shifts</Typography>;
  }

  const bookedShifts = data?.data.data.filter((shift) => shift.workerId) ?? [];

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        My Booked Shifts
      </Typography>

      {bookedShifts.length === 0 ? (
        <Typography color="textSecondary">No booked shifts</Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {bookedShifts.map((shift) => (
            <ShiftCard
              key={shift.id}
              shift={shift}
              actionButton={
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => cancelMutation.mutate(shift.id)}
                  disabled={cancelMutation.isPending}
                >
                  Cancel Shift
                </Button>
              }
            />
          ))}
        </Box>
      )}
    </div>
  );
};

export default BookedShifts;
