import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ProfileContent from "./ProfileContent";

export const metadata: Metadata = {
  title: "User Profile",
  description: "View user profile and listings",
};

export default function ProfilePage({
  params,
}: {
  params: { nickname: string };
}) {
  return (
    <>
      <Navbar />
      <ProfileContent nickname={params.nickname} />
    </>
  );
}
