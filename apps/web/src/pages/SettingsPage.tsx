import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { apiGet } from "../api/client";

export function SettingsPage() {
  const queryClient = useQueryClient();
  const [baseCurrency, setBaseCurrency] = useState("TRY");

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => apiGet<Record<string, string>>("/settings")
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/v1/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseCurrency })
      });
      const json = await response.json();
      if (!json.success) throw new Error(json.errors?.message ?? "Save failed");
      return json.data;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["settings"] })
  });

  if (isLoading) return <Typography>Loading settings...</Typography>;

  return (
    <Paper sx={{ p: 2, maxWidth: 480 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Settings</Typography>
        <TextField
          label="Base Currency"
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value)}
        />
        <Typography variant="body2" color="text.secondary">
          Current: {data?.baseCurrency ?? "TRY"}
        </Typography>
        <Button variant="contained" onClick={() => saveMutation.mutate()}>
          Save
        </Button>
      </Stack>
    </Paper>
  );
}
