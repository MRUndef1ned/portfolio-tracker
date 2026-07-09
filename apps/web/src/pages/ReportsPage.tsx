import { Alert, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../api/client";

interface ReportSummary {
  generatedAt: string;
  summary: {
    portfolioValue: number;
    totalProfit: number;
    totalReturnPct: number;
  };
  totalsByTicker: Array<{ ticker: string; marketValue: number; allocation: number }>;
}

export function ReportsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["portfolio-report"],
    queryFn: () => apiGet<ReportSummary>("/reports/portfolio")
  });

  if (isLoading) return <Typography>Loading reports...</Typography>;
  if (error) return <Alert severity="error">Failed to load report</Alert>;
  if (!data) return null;

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Portfolio Report</Typography>
        <Typography variant="body2">Generated: {data.generatedAt}</Typography>
        <Typography variant="body2">Portfolio Value: {data.summary.portfolioValue.toFixed(2)}</Typography>
        <Typography variant="body2">Total Profit: {data.summary.totalProfit.toFixed(2)}</Typography>
        <Typography variant="body2">Return: {data.summary.totalReturnPct.toFixed(2)}%</Typography>
      </Paper>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticker</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell align="right">Allocation %</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.totalsByTicker.map((row) => (
              <TableRow key={row.ticker}>
                <TableCell>{row.ticker}</TableCell>
                <TableCell align="right">{row.marketValue.toFixed(2)}</TableCell>
                <TableCell align="right">{row.allocation.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}
