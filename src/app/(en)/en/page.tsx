import { HomePage } from "@/components/home-page";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata("en");

export default function Page() {
  return <HomePage locale="en" />;
}
