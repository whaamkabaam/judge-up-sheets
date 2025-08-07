import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProjectGallery from "@/components/ProjectGallery";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : 'https://judgeup.app/';
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "JudgeUp",
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
        <title>JudgeUp — Hackathon Judging & Community Voting</title>
        <meta name="description" content="JudgeUp makes hackathon judging and community voting simple. Explore projects, invite judges, and track results." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="JudgeUp — Hackathon Judging & Community Voting" />
        <meta property="og:description" content="JudgeUp makes hackathon judging and community voting simple. Explore projects, invite judges, and track results." />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Header />
      <HeroSection />
      <ProjectGallery />
    </div>
  );
};

export default Index;
