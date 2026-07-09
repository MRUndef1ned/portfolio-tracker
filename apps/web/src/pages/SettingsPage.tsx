import { Alert, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { apiGet, apiPost, apiPut } from "../api/client";

export function SettingsPage() {
  const queryClient = useQueryClient();
  const [baseCurrency, setBaseCurrency] = useState("TRY");
  const [themeMode, setThemeMode] = useState("dark");

  const { data, isLoading, error } = useQuery({
    queryKey: ["settings"],
    queryFn: () => apiGet<Record<string, string>>("/settings")
  });

  const saveMutation = useMutation({
    mutationFn: () => apiPut<Record<string, string>>("/settings", { baseCurrency, themeMode }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["settings"] })
  });

  const backupMutation = useMutation({
    mutationFn: () => apiPost("/backup", {}),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["backups"] })
  });

  const { data: backups } = useQuery({
    queryKey: ["backups"],
    queryFn: () => apiGet<Array<{ backup_name: string; backup_date: string }>>("/backup/list")
  });

  if (isLoading) return <Typography>Loading settings...</Typography>;
  if (error) return <Alert severity="error">Failed to load settings</Alert>;

  return (
    <Stack spacing={2} sx={{ maxWidth: 640 }}>
      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Settings</Typography>
          <TextField label="Base Currency" value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)} />
          <TextField label="Theme Mode" value={themeMode} onChange={(e) => setThemeMode(e.target.value)} />
          <Typography variant="body2" color="text.secondary">
            Current base currency: {data?.baseCurrency ?? "TRY"}
          </Typography>
          <Button variant="contained" onClick={() => saveMutation.mutate()}>
            Save Settings
          </Button>
          {saveMutation.error ? <Alert severity="error">{saveMutation.error.message}</Alert> : null}
        </Stack>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Backup</Typography>
          <Button variant="outlined" onClick={() => backupMutation.mutate()}>
            Create Backup
          </Button>
          {backupMutation.isSuccess ? <Alert severity="success">Backup created successfully.</Alert> : null}
          <Typography variant="subtitle2">Available backups</Typography>
          {(backups ?? []).length === 0 ? (
            <Alert severity="info">No backups created yet.</Alert>
          ) : (
            backups?.map((backup) => (
              <Typography key={backup.backup_name} variant="body2">
                {backup.backup_name} — {backup.backup_date}
              </Typography>
            ))
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
