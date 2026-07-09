import { Alert, Button, Paper, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { apiGet } from "../api/client";

function download(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportPage() {
  const exportMutation = useMutation({
    mutationFn: () => apiGet<string>("/reports/export/csv"),
    onSuccess: (csv) => download(csv, "portfolio-transactions.csv", "text/csv")
  });

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Export</Typography>
          <Button variant="contained" onClick={() => exportMutation.mutate()}>
            Export CSV
          </Button>
          {exportMutation.isSuccess ? <Alert severity="success">CSV downloaded.</Alert> : null}
          {exportMutation.error ? <Alert severity="error">{exportMutation.error.message}</Alert> : null}
        </Stack>
      </Paper>
    </Stack>
  );
}
