import { redirect } from "next/navigation";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const queryString = new URLSearchParams(
    Object.entries(params || {}).reduce((acc, [key, val]) => {
      if (typeof val === "string") acc[key] = val;
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  redirect(queryString ? `/search?${queryString}` : "/search");
}

