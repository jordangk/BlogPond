import { redirect } from "next/navigation";
import { getPublishedPage } from "@/lib/pages";
import { MDX } from "@/lib/mdx";
import { theme } from "@/theme.config";

export default async function Home() {
  const home = await getPublishedPage("home");
  if (!home) redirect("/blog");

  const isLanding = home.template === "landing";
  const wrapperClass = isLanding
    ? ""
    : `mx-auto ${theme.layout.maxWidthClass} px-6 py-12`;

  return (
    <>
      {home.template !== "landing" && (
        <header
          className={`mx-auto ${theme.layout.contentMaxWidthClass} px-6 pt-12`}
        >
          <h1 className="text-4xl sm:text-5xl">{home.title}</h1>
          {home.description && (
            <p className="mt-3 text-lg text-muted">{home.description}</p>
          )}
        </header>
      )}
      <div className={wrapperClass}>
        <MDX source={home.content} />
      </div>
    </>
  );
}
