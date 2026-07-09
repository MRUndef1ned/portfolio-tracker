import { Alert, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { apiGet, apiPost } from "../api/client";

interface BackupInfo {
  backup_name: string;
  backup_date: string;
}

export function BackupPage() {
  const queryClient = useQueryClient();
  const [restoreFile, setRestoreFile] = useState("");
  const { data } = useQuery({ queryKey: ["backups"], queryFn: () => apiGet<BackupInfo[]>("/backup/list") });

  const createBackup = useMutation({
    mutationFn: () => apiPost("/backup", {}),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["backups"] })
  });

  const restoreBackup = useMutation({
    mutationFn: () => apiPost("/backup/restore", { fileName: restoreFile })
  });

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Backup & Restore</Typography>
          <Button variant="contained" onClick={() => createBackup.mutate()}>
            Create Backup
          </Button>
          <TextField label="Backup file name" value={restoreFile} onChange={(e) => setRestoreFile(e.target.value)} />
          <Button variant="outlined" onClick={() => restoreBackup.mutate()}>
            Restore Backup
          </Button>
          {createBackup.isSuccess ? <Alert severity="success">Backup created.</Alert> : null}
          {restoreBackup.isSuccess ? <Alert severity="success">Backup restored.</Alert> : null}
        </Stack>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2">Existing Backups</Typography>
        {(data ?? []).map((backup) => (
          <Typography key={backup.backup_name} variant="body2">
            {backup.backup_name} — {backup.backup_date}
          </Typography>
        ))}
      </Paper>
    </Stack>
  );
}
