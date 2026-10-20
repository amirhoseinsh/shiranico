import { notFound } from "next/navigation";
import { PortfolioPage } from "@/components/portfolio-page";
import { createMetadata } from "@/lib/metadata";
import { getPortfolioCompany, isPortfolioId, portfolioIds } from "@/lib/portfolio";

type Props = { params: Promise<{ company: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return portfolioIds.map(company => ({ company })); }

export async function generateMetadata({ params }: Props) {
  const { company } = await params;
  if (!isPortfolioId(company)) notFound();
  const business = getPortfolioCompany("en", company);
  return createMetadata("en", { title: `${business.name} | SHIRANI Portfolio`, description: business.description, path: `/portfolio/${company}` });
}

export default async function Page({ params }: Props) {
  const { company } = await params;
  if (!isPortfolioId(company)) notFound();
  return <PortfolioPage locale="en" id={company} />;
}
