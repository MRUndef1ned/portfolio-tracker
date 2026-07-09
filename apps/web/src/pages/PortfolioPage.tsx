import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../api/client";

interface Position {
  ticker: string;
  displayName: string;
  quantity: number;
  averageCost: number;
  marketPrice: number;
  marketValue: number;
  unrealizedProfit: number;
  allocation: number;
}

export function PortfolioPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["portfolio-positions"],
    queryFn: () => apiGet<Position[]>("/portfolio/positions")
  });

  if (isLoading) return <Typography>Loading portfolio...</Typography>;
  if (error) return <Typography color="error">Failed to load portfolio</Typography>;

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ticker</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell align="right">Avg Cost</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell align="right">P/L</TableCell>
            <TableCell align="right">Alloc %</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(data ?? []).map((row) => (
            <TableRow key={row.ticker}>
              <TableCell>{row.ticker}</TableCell>
              <TableCell>{row.displayName}</TableCell>
              <TableCell align="right">{row.quantity}</TableCell>
              <TableCell align="right">{row.averageCost.toFixed(2)}</TableCell>
              <TableCell align="right">{row.marketPrice.toFixed(2)}</TableCell>
              <TableCell align="right">{row.marketValue.toFixed(2)}</TableCell>
              <TableCell align="right">{row.unrealizedProfit.toFixed(2)}</TableCell>
              <TableCell align="right">{row.allocation.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
