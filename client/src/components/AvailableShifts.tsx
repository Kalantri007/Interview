import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Typography, Button, CircularProgress, Box } from "@mui/material";
import { CURRENT_WORKER_ID } from "../App";
import ShiftCard from "./ShiftCard";
import { PaginatedResponse, Shift } from "../types";
import axios from "axios";

const AvailableShifts: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["available-shifts"],
    queryFn: () => {
      return axios.get<PaginatedResponse<Shift>>(`/api/shifts`);
    },
  });

  const claimMutation = useMutation({
    mutationFn: (shiftId: number) => {
      return axios.post<Shift>(`/api/shifts/${shiftId}/claim`, {
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

  const availableShifts = data?.data.data.filter((shift) => !shift.workerId) ?? [];

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Available Shifts
      </Typography>

      {availableShifts.length === 0 ? (
        <Typography color="textSecondary">No available shifts</Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {availableShifts.map((shift) => (
            <ShiftCard
              key={shift.id}
              shift={shift}
              actionButton={
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => claimMutation.mutate(shift.id)}
                  disabled={claimMutation.isPending}
                >
                  Claim Shift
                </Button>
              }
            />
          ))}
        </Box>
      )}
    </div>
  );
};

export default AvailableShifts;
