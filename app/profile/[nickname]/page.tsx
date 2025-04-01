import Navbar from "@/components/Navbar";
import ProfileContent from "./ProfileContent";

interface PageProps {
  params: {
    nickname: string;
  };
}

export default function ProfilePage({ params }: PageProps) {
  return (
    <>
      <Navbar />
      <ProfileContent nickname={params.nickname} />
    </>
  );
}
