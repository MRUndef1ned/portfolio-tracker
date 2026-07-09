import { Alert, Button, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
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

const transactionTypes = ["BUY", "SELL", "DIVIDEND", "DEPOSIT", "WITHDRAW", "FEE", "TAX"];

export function TransactionsPage() {
  const queryClient = useQueryClient();
  const [assetId, setAssetId] = useState("1");
  const [quantity, setQuantity] = useState("10");
  const [unitPrice, setUnitPrice] = useState("100");
  const [transactionType, setTransactionType] = useState("BUY");

  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => apiGet<Transaction[]>("/transactions?page=1&pageSize=100")
  });

  const createMutation = useMutation({
    mutationFn: () => {
      const parsedAssetId = Number(assetId);
      const parsedQuantity = Number(quantity);
      const parsedUnitPrice = Number(unitPrice);
      if (!Number.isFinite(parsedAssetId) || parsedAssetId <= 0) {
        throw new Error("Asset ID must be a positive number");
      }
      if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
        throw new Error("Quantity must be positive");
      }
      if (!Number.isFinite(parsedUnitPrice) || parsedUnitPrice < 0) {
        throw new Error("Unit price must be zero or greater");
      }

      return apiPost<Transaction>("/transactions", {
        assetId: parsedAssetId,
        transactionType,
        quantity: parsedQuantity,
        unitPrice: parsedUnitPrice,
        commission: 0,
        tax: 0,
        currency: "TRY",
        exchangeRate: 1,
        tradeDate: new Date().toISOString().slice(0, 10)
      });
    },
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
  if (error) return <Alert severity="error">Failed to load transactions</Alert>;

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField label="Asset ID" value={assetId} onChange={(e) => setAssetId(e.target.value)} />
          <TextField select label="Type" value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
            {transactionTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </TextField>
          <TextField label="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <TextField label="Unit Price" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
          <Button variant="contained" onClick={() => createMutation.mutate()}>
            Add Transaction
          </Button>
        </Stack>
        {createMutation.error ? <Alert severity="error" sx={{ mt: 2 }}>{createMutation.error.message}</Alert> : null}
      </Paper>
      {!data?.length ? (
        <Alert severity="info">No transactions yet. Add a deposit or a buy transaction.</Alert>
      ) : (
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
              {data.map((tx) => (
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
      )}
    </Stack>
  );
}
