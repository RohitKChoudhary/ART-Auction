
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import DashboardWelcome from "@/components/dashboard/DashboardWelcome";
import QuickLinks from "@/components/dashboard/QuickLinks";
import RecentAuctions from "@/components/dashboard/RecentAuctions";

const Dashboard: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <DashboardWelcome />
        <QuickLinks />
        <RecentAuctions />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
