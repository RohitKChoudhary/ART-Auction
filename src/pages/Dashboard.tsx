
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import DashboardWelcome from "@/components/dashboard/DashboardWelcome";
import QuickLinks from "@/components/dashboard/QuickLinks";
import RecentAuctions from "@/components/dashboard/RecentAuctions";
import StatsOverview from "@/components/dashboard/StatsOverview";

const Dashboard: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <DashboardWelcome />
        <StatsOverview />
        <QuickLinks />
        <RecentAuctions />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
