import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProjectGallery from "@/components/ProjectGallery";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : 'https://judgeup.app/';
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SummerUp Community Vote",
    url: canonicalUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${canonicalUrl}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  } as const;
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>SummerUp 2025 — Community Project Voting</title>
        <meta name="description" content="Cast your vote for the SummerUp 2025 Community Choice Award. Browse projects and pick your favorites." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="SummerUp 2025 — Community Project Voting" />
        <meta property="og:description" content="Cast your vote for the SummerUp 2025 Community Choice Award. Browse projects and pick your favorites." />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Header />
      <HeroSection />
      <ProjectGallery />
    </div>
  );
};

export default Index;
