import React from 'react';
import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import ProblemCard from '../common/ProblemCard';
import { PROBLEMS_DATA } from '../../config/navigation';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import { SearchIcon, CheckSquareIcon, BookOpenIcon } from '../common/Icons';

export const ProblemsSection: React.FC = () => {
  const scrollToSection = useSmoothScroll();

  const getProblemIcon = (id: string) => {
    switch (id) {
      case 'problem-1':
        return <SearchIcon size={20} />;
      case 'problem-2':
        return <CheckSquareIcon size={20} />;
      case 'problem-3':
        return <BookOpenIcon size={20} />;
      default:
        return undefined;
    }
  };

  return (
    <section id="problems" className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Container>
        <SectionHeading
          eyebrow="HACKATHON CHALLENGES"
          badgeVariant="indigo"
          title="Practical Engineering Problems"
          description="Select a problem challenge to view the technical specification and architectural overview."
          align="center"
        />

        <div className="grid-3">
          {PROBLEMS_DATA.map((prob) => (
            <ProblemCard
              key={prob.id}
              number={prob.number}
              title={prob.title}
              description={prob.description}
              tags={prob.tags}
              icon={getProblemIcon(prob.id)}
              targetSection={prob.targetSection}
              onAction={(targetId) => scrollToSection(targetId)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ProblemsSection;
