import Navbar from "@/components/Navbar";
import ProfileContent from "./ProfileContent";

type Props = {
  params: {
    nickname: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function ProfilePage({ params }: Props) {
  return (
    <>
      <Navbar />
      <ProfileContent nickname={params.nickname} />
    </>
  );
}
