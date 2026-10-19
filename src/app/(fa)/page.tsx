import { HomePage } from "@/components/home-page";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata("fa");

export default function Page() {
  return <HomePage locale="fa" />;
}
