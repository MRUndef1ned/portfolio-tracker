import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { AssetsPage } from "./pages/AssetsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TransactionsPage } from "./pages/TransactionsPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
