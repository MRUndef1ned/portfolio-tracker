import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { apiDelete, apiGet, apiPost } from "../api/client";

interface Asset {
  id: number;
  ticker: string;
  displayName: string;
  market: string;
  assetType: string;
  currency: string;
}

export function AssetsPage() {
  const queryClient = useQueryClient();
  const [ticker, setTicker] = useState("THYAO");
  const [displayName, setDisplayName] = useState("Turkish Airlines");

  const { data, isLoading, error } = useQuery({
    queryKey: ["assets"],
    queryFn: () => apiGet<Asset[]>("/assets?page=1&pageSize=100")
  });

  const createMutation = useMutation({
    mutationFn: () =>
      apiPost<Asset>("/assets", {
        ticker,
        displayName,
        market: "BIST",
        assetType: "STOCK",
        currency: "TRY",
        provider: "mock",
        isin: null,
        status: "active"
      }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["assets"] })
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiDelete(`/assets/${id}`),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["assets"] })
  });

  if (isLoading) return <Typography>Loading assets...</Typography>;
  if (error) return <Typography color="error">Failed to load assets</Typography>;

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" spacing={2}>
          <TextField label="Ticker" value={ticker} onChange={(e) => setTicker(e.target.value)} />
          <TextField
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Button variant="contained" onClick={() => createMutation.mutate()}>
            Add Asset
          </Button>
        </Stack>
      </Paper>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Ticker</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Market</TableCell>
              <TableCell>Type</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {(data ?? []).map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>{asset.id}</TableCell>
                <TableCell>{asset.ticker}</TableCell>
                <TableCell>{asset.displayName}</TableCell>
                <TableCell>{asset.market}</TableCell>
                <TableCell>{asset.assetType}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => deleteMutation.mutate(asset.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}
