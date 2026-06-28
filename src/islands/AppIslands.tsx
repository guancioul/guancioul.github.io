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

export function HomeIsland() {
  const activeSection = useActiveSection(HOME_SECTION_IDS);
  return (
    <PageFrame currentPath="/" activeSection={activeSection}>
      <Home />
    </PageFrame>
  );
}

export function BlogListIsland() {
  return (
    <PageFrame currentPath="/blog">
      <BlogList />
    </PageFrame>
  );
}

export function BlogPostIsland({ slug }: { slug: string }) {
  return (
    <PageFrame currentPath={`/blog/${slug}`}>
      <BlogPost slug={slug} />
    </PageFrame>
  );
}

export function ChallengesIsland() {
  return (
    <PageFrame currentPath="/challenges">
      <Challenges />
    </PageFrame>
  );
}

export function ChallengeDetailIsland({ slug }: { slug: string }) {
  return (
    <PageFrame currentPath={`/challenges/${slug}`}>
      <ChallengeDetail slug={slug} />
    </PageFrame>
  );
}

export function ChallengeEntryIsland({ slug, date }: { slug: string; date: string }) {
  return (
    <PageFrame currentPath={`/challenges/${slug}/${date}`}>
      <ChallengeEntry slug={slug} date={date} />
    </PageFrame>
  );
}

export function TravelIsland() {
  return (
    <PageFrame currentPath="/travel">
      <Travel />
    </PageFrame>
  );
}

export function TravelDetailIsland({ slug }: { slug: string }) {
  return (
    <PageFrame currentPath={`/travel/${slug}`}>
      <TravelDetail slug={slug} />
    </PageFrame>
  );
}

export function NotableContributionsIsland() {
  return (
    <PageFrame currentPath="/notable-contributions">
      <NotableContributions />
    </PageFrame>
  );
}

export function NotFoundIsland() {
  return (
    <PageFrame currentPath="/404">
      <NotFoundView />
    </PageFrame>
  );
}

export function WikiHomeIsland() {
  return (
    <PageFrame currentPath="/wiki">
      <WikiShell>
        <WikiHome />
      </WikiShell>
    </PageFrame>
  );
}

export function WikiPageIsland({ slug }: { slug: string }) {
  return (
    <PageFrame currentPath={`/wiki/${slug}`}>
      <WikiShell activeSlug={slug}>
        <WikiPage slug={slug} />
      </WikiShell>
    </PageFrame>
  );
}
