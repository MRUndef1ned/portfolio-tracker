import { Card, CardContent, Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { apiGet } from "../api/client";

interface PortfolioSummary {
  portfolioValue: number;
  cashBalance: number;
  totalProfit: number;
  totalReturnPct: number;
  positions: Array<{ ticker: string; allocation: number; marketValue: number }>;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["portfolio"],
    queryFn: () => apiGet<PortfolioSummary>("/portfolio")
  });

  if (isLoading) return <Typography>Loading dashboard...</Typography>;
  if (error) return <Typography color="error">Failed to load dashboard</Typography>;
  if (!data) return null;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2">Portfolio Value</Typography>
            <Typography variant="h5">{data.portfolioValue.toFixed(2)}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2">Cash Balance</Typography>
            <Typography variant="h5">{data.cashBalance.toFixed(2)}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2">Total Profit</Typography>
            <Typography variant="h5">{data.totalProfit.toFixed(2)}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2">Total Return</Typography>
            <Typography variant="h5">{data.totalReturnPct.toFixed(2)}%</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Allocation
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data.positions} dataKey="marketValue" nameKey="ticker" outerRadius={100}>
                  {data.positions.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
