import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StoreProvider } from "@/store/provider";

export default function DashboardPage() {
  return (
    <StoreProvider>
      <DashboardShell />
    </StoreProvider>
  );
}
