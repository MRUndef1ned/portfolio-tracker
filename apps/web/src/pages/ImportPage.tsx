import { Alert, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { apiPost } from "../api/client";

export function ImportPage() {
  const [csv, setCsv] = useState("assetId,transactionType,quantity,unitPrice,commission,tax,currency,exchangeRate,tradeDate,settlementDate,broker,account,notes\n1,BUY,5,100,0,0,TRY,1,2026-01-01,,,,\"");

  const importMutation = useMutation({
    mutationFn: () => apiPost<{ imported: number; skipped: number }>("/transactions/import", { csv })
  });

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h6">CSV Import</Typography>
          <TextField multiline minRows={12} value={csv} onChange={(e) => setCsv(e.target.value)} />
          <Button variant="contained" onClick={() => importMutation.mutate()}>
            Import Transactions
          </Button>
          {importMutation.data ? (
            <Alert severity="success">
              Imported: {importMutation.data.imported} | Skipped: {importMutation.data.skipped}
            </Alert>
          ) : null}
          {importMutation.error ? <Alert severity="error">{importMutation.error.message}</Alert> : null}
        </Stack>
      </Paper>
    </Stack>
  );
}
