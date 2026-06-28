import type { Locale } from '../i18n';
import { useActiveSection } from '../hooks/useActiveSection';
import { PageFrame } from '../components/PageFrame';
import { Home, HOME_SECTION_IDS } from '../views/Home';
import { BlogList } from '../views/BlogList';
import { BlogPost } from '../views/BlogPost';
import { Challenges } from '../views/Challenges';
import { ChallengeDetail } from '../views/ChallengeDetail';
import { ChallengeEntry } from '../views/ChallengeEntry';
import { Travel } from '../views/Travel';
import { TravelDetail } from '../views/TravelDetail';
import { NotableContributions } from '../views/NotableContributions';
import { NotFoundView } from '../views/NotFound';
import { WikiShell } from '../views/WikiShell';
import { WikiHome } from '../views/WikiHome';
import { WikiPage } from '../views/WikiPage';
import '../views/NotFound.css';

export function HomeIsland({ locale }: { locale: Locale }) {
  const activeSection = useActiveSection(HOME_SECTION_IDS);
  return (
    <PageFrame locale={locale} currentPath="/" activeSection={activeSection}>
      <Home />
    </PageFrame>
  );
}

export function BlogListIsland({ locale }: { locale: Locale }) {
  return (
    <PageFrame locale={locale} currentPath="/blog">
      <BlogList />
    </PageFrame>
  );
}

export function BlogPostIsland({ slug, locale }: { slug: string; locale: Locale }) {
  return (
    <PageFrame locale={locale} currentPath={`/blog/${slug}`}>
      <BlogPost slug={slug} />
    </PageFrame>
  );
}

export function ChallengesIsland({ locale }: { locale: Locale }) {
  return (
    <PageFrame locale={locale} currentPath="/challenges">
      <Challenges />
    </PageFrame>
  );
}

export function ChallengeDetailIsland({ slug, locale }: { slug: string; locale: Locale }) {
  return (
    <PageFrame locale={locale} currentPath={`/challenges/${slug}`}>
      <ChallengeDetail slug={slug} />
    </PageFrame>
  );
}

export function ChallengeEntryIsland({
  slug,
  date,
  locale,
}: {
  slug: string;
  date: string;
  locale: Locale;
}) {
  return (
    <PageFrame locale={locale} currentPath={`/challenges/${slug}/${date}`}>
      <ChallengeEntry slug={slug} date={date} />
    </PageFrame>
  );
}

export function TravelIsland({ locale }: { locale: Locale }) {
  return (
    <PageFrame locale={locale} currentPath="/travel">
      <Travel />
    </PageFrame>
  );
}

export function TravelDetailIsland({ slug, locale }: { slug: string; locale: Locale }) {
  return (
    <PageFrame locale={locale} currentPath={`/travel/${slug}`}>
      <TravelDetail slug={slug} />
    </PageFrame>
  );
}

export function NotableContributionsIsland({ locale }: { locale: Locale }) {
  return (
    <PageFrame locale={locale} currentPath="/notable-contributions">
      <NotableContributions />
    </PageFrame>
  );
}

export function NotFoundIsland({ locale }: { locale: Locale }) {
  return (
    <PageFrame locale={locale} currentPath="/404">
      <NotFoundView />
    </PageFrame>
  );
}

export function WikiHomeIsland({ locale }: { locale: Locale }) {
  return (
    <PageFrame locale={locale} currentPath="/wiki">
      <WikiShell>
        <WikiHome />
      </WikiShell>
    </PageFrame>
  );
}

export function WikiPageIsland({ slug, locale }: { slug: string; locale: Locale }) {
  return (
    <PageFrame locale={locale} currentPath={`/wiki/${slug}`}>
      <WikiShell activeSlug={slug}>
        <WikiPage slug={slug} />
      </WikiShell>
    </PageFrame>
  );
}
