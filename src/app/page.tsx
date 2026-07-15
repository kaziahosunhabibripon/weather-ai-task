import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StoreProvider } from "@/store/provider";

export default function Home() {
  return (
    <StoreProvider>
      <DashboardShell />
    </StoreProvider>
  );
}
