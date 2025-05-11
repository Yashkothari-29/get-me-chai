import PaymentPage from "@/components/PaymentPage";
import notFound from "next/navigation";

const UsernamePage = async ({ params }) => {
  // ✅ Ensure params is awaited before using it
  const { username } = await params;

  if (!username) {
    return <div>Error: Username not found</div>;
  }

  return <PaymentPage username={username} />;
};

export default UsernamePage;
