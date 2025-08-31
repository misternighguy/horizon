'use client';

import { Article, ReadingLevel } from '@/types';

interface ArticleContentProps {
  article: Article;
  readingStyle: ReadingLevel;
}

export default function ArticleContent({ article, readingStyle }: ArticleContentProps) {
  // Get the content for the current reading level
  const currentContent = article.content?.[readingStyle]?.sections || [];
  
  // If dynamic content exists for this reading level, render it
  if (currentContent.length > 0) {
    return (
      <div className="lg:col-span-3 space-y-4 sm:space-y-8 md:space-y-12 lg:space-y-16">
        {currentContent
          .sort((a, b) => a.order - b.order)
          .map((section, index) => (
            <section key={`section-${section.order}`} id={`section-${section.order}`}>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4 sm:mb-6">{section.title}</h2>
              <div className="space-y-3 sm:space-y-4">
                <div 
                  className="text-white/80 text-base sm:text-lg lg:text-xl leading-relaxed max-w-none lg:max-w-[65ch]"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            </section>
          ))}
      </div>
    );
  }
  
  // Fall back to static content if no dynamic content exists
  return (
    <div className="lg:col-span-3 space-y-4 sm:space-y-8 md:space-y-12 lg:space-y-16">
      {/* Abstract */}
      <section id="abstract">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4 sm:mb-6">Abstract</h2>
        <div className="space-y-3 sm:space-y-4">
          {article.abstract.map((paragraph, index) => (
            <p key={index} className="text-white/80 text-base sm:text-lg lg:text-xl leading-relaxed max-w-none lg:max-w-[65ch]">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Product Architecture */}
      <section id="architecture">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4 sm:mb-6">Product Architecture</h2>
        <div className="space-y-3 sm:space-y-4">
          <ul className="space-y-2">
            {article.productArchitecture.sections.map((section, index) => (
              <li key={index} className="text-white/80 text-base sm:text-lg lg:text-xl leading-relaxed flex items-start max-w-none lg:max-w-[65ch]">
                <span className="text-[rgb(var(--color-horizon-green))] mr-3 mt-2">•</span>
                {section}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-6">
            {article.productArchitecture.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Mechanics */}
      <section id="mechanics">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4 sm:mb-6">Core Mechanics</h2>
        <div className="space-y-3 sm:space-y-4">
          <ul className="space-y-2">
            {article.mechanics.map((mechanic, index) => (
              <li key={index} className="text-white/80 text-base sm:text-lg lg:text-xl leading-relaxed flex items-start max-w-none lg:max-w-[65ch]">
                <span className="text-[rgb(var(--color-horizon-green))] mr-3 mt-2">•</span>
                {mechanic}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Problem, Users & Value */}
      <section id="problem-users-value">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4 sm:mb-6">Problem, Users & Value</h2>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-white mb-2 sm:mb-3">Problem</h3>
            <p className="text-white/80 text-base sm:text-lg lg:text-xl leading-relaxed max-w-none lg:max-w-[65ch]">{article.problemUsersValue.problem}</p>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-white mb-2 sm:mb-3">Users</h3>
            <ul className="space-y-2">
              {article.problemUsersValue.users.map((user, index) => (
                <li key={index} className="text-white/80 text-base sm:text-lg lg:text-xl leading-relaxed flex items-start max-w-none lg:max-w-[65ch]">
                  <span className="text-[rgb(var(--color-horizon-green))] mr-3 mt-2">•</span>
                  {user}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-white mb-2 sm:mb-3">Approach</h3>
            <p className="text-white/80 text-base sm:text-lg lg:text-xl leading-relaxed max-w-none lg:max-w-[65ch]">{article.problemUsersValue.approach}</p>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-white mb-2 sm:mb-3">Differentiators</h3>
            <ul className="space-y-2">
              {article.problemUsersValue.differentiators.map((diff, index) => (
                <li key={index} className="text-white/80 text-base sm:text-lg lg:text-xl leading-relaxed flex items-start max-w-none lg:max-w-[65ch]">
                  <span className="text-[rgb(var(--color-horizon-green))] mr-3 mt-2">•</span>
                  {diff}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team">
        <h2 className="text-3xl font-light text-white mb-6">Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {article.team.map((member, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <h3 className="text-xl font-medium text-white mb-2">{member.name}</h3>
              <p className="text-white/60 mb-4">{member.role}</p>
              <div className="flex space-x-3">
                {member.twitter && (
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-[rgb(var(--color-horizon-green))] hover:underline">
                    Twitter
                  </a>
                )}
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-[rgb(var(--color-horizon-green))] hover:underline">
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Events */}
      <section id="timeline">
        <h2 className="text-3xl font-light text-white mb-6">Timeline</h2>
        <div className="space-y-4">
          {article.events.map((event, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-[rgb(var(--color-horizon-green))] rounded-full"></div>
              <div>
                <span className="text-white font-medium">{event.event}</span>
                {event.date && <span className="text-white/60 ml-2">({event.date})</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Official Links */}
      <section id="links">
        <h2 className="text-3xl font-light text-white mb-6">Official Links</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium text-white mb-3">Social Media</h3>
            <div className="flex flex-wrap gap-3">
              {article.officialLinks.socials.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  {social.platform}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium text-white mb-3">Technical</h3>
            <div className="flex flex-wrap gap-3">
              {article.officialLinks.technical.map((tech, index) => (
                <a
                  key={index}
                  href={tech.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  {tech.type}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section id="ecosystem">
        <h2 className="text-3xl font-light text-white mb-6">Ecosystem</h2>
        <div className="flex flex-wrap gap-3">
          {article.ecosystem.map((item, index) => (
            <span key={index} className="px-4 py-2 bg-white/10 text-white rounded-lg">
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Credentials */}
      <section id="credentials">
        <h2 className="text-3xl font-light text-white mb-6">Credentials</h2>
        <div className="space-y-3">
          {article.credentials.map((credential, index) => (
            <div key={index} className="flex items-start">
              <span className="text-[rgb(var(--color-horizon-green))] mr-3 mt-2">✓</span>
              <span className="text-white/80 text-lg leading-relaxed">{credential}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
