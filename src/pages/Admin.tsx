
import MainLayout from "@/components/layout/MainLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";

const Admin = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage users, auctions, and monitor platform activity.
          </p>
        </div>
        
        <AdminDashboard />
      </div>
    </MainLayout>
  );
};

export default Admin;
