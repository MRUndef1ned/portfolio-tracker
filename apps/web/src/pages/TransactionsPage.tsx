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

interface Transaction {
  id: number;
  assetId: number;
  transactionType: string;
  quantity: number;
  unitPrice: number;
  tradeDate: string;
  currency: string;
}

export function TransactionsPage() {
  const queryClient = useQueryClient();
  const [assetId, setAssetId] = useState("1");
  const [quantity, setQuantity] = useState("10");
  const [unitPrice, setUnitPrice] = useState("100");

  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => apiGet<Transaction[]>("/transactions?page=1&pageSize=100")
  });

  const createMutation = useMutation({
    mutationFn: () =>
      apiPost<Transaction>("/transactions", {
        assetId: Number(assetId),
        transactionType: "BUY",
        quantity: Number(quantity),
        unitPrice: Number(unitPrice),
        commission: 0,
        tax: 0,
        currency: "TRY",
        exchangeRate: 1,
        tradeDate: new Date().toISOString().slice(0, 10)
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["transactions"] });
      void queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiDelete(`/transactions/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["transactions"] });
      void queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    }
  });

  if (isLoading) return <Typography>Loading transactions...</Typography>;
  if (error) return <Typography color="error">Failed to load transactions</Typography>;

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" spacing={2}>
          <TextField label="Asset ID" value={assetId} onChange={(e) => setAssetId(e.target.value)} />
          <TextField label="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <TextField label="Unit Price" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
          <Button variant="contained" onClick={() => createMutation.mutate()}>
            Add BUY
          </Button>
        </Stack>
      </Paper>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Date</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {(data ?? []).map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.id}</TableCell>
                <TableCell>{tx.assetId}</TableCell>
                <TableCell>{tx.transactionType}</TableCell>
                <TableCell>{tx.quantity}</TableCell>
                <TableCell>{tx.unitPrice}</TableCell>
                <TableCell>{tx.tradeDate}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => deleteMutation.mutate(tx.id)}>
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
