import { useUser } from "@clerk/clerk-react";

export default function Profile() {
  const { user } = useUser();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Profile</h1>
      <p><strong>Full Name:</strong> {user?.fullName}</p>
      <p><strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress}</p>
    </div>
  );
}