import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Facebook, Send, Sparkles, Star, UsersRound, Zap } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { TeamMember, Post } from '../types';
import HeroVisuals from './Hero/HeroVisuals';
import { ArticleDetailModal, MemberDetailModal } from './TeamModals';
import RevealOnScroll from './RevealOnScroll';

const supportedLangs = ['en', 'km', 'fr', 'ja', 'ko', 'de', 'zh-CN', 'es', 'ar'];

const getLanguagePrefix = () => {
  const firstSegment = window.location.pathname.split('/').filter(Boolean)[0];
  return firstSegment && supportedLangs.includes(firstSegment) ? `/${firstSegment}` : '';
};

const TeamPage: React.FC = () => {
  const { team = [], insights = [] } = useData();
  const { t } = useLanguage();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeMemberId, setActiveMemberId] = useState<string | null>(team[0]?.id || null);
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!activeMemberId && team.length) setActiveMemberId(team[0].id);
  }, [activeMemberId, team]);

  useEffect(() => {
    const locked = Boolean(selectedMember || selectedPost);
    document.body.style.overflow = locked ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedMember, selectedPost]);

  const activeMember = useMemo(() => team.find(member => member.id === activeMemberId) || team[0], [activeMemberId, team]);
  const totalSkills = useMemo(() => new Set(team.flatMap(member => member.skills || [])).size, [team]);
  const teamPosts = useMemo(() => (insights || []).filter(post => team.some(member => member.id === post.authorId)), [insights, team]);

  const handleHeroMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursor({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  const navigateToContact = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.history.pushState(null, '', `${getLanguagePrefix()}/contact`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <section
        ref={heroRef}
        onMouseMove={handleHeroMove}
        className="relative min-h-screen overflow-hidden bg-gray-950 pt-32 text-white"
        aria-labelledby="team-page-title"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(99,102,241,0.28),transparent_34%),radial-gradient(circle_at_84%_28%,rgba(236,72,153,0.18),transparent_30%),linear-gradient(135deg,#030712,#0f172a_52%,#111827)]" />
        <div
          className="pointer-events-none absolute h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/14 blur-3xl transition-all duration-500"
          style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:64px_64px] opacity-70" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:px-8">
          <RevealOnScroll variant="slide-right">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-indigo-100 backdrop-blur-xl font-khmer">
                <UsersRound size={15} />
                {t('Team constellation', 'ផែនទីក្រុមការងារ')}
              </div>
              <h1 id="team-page-title" className="font-khmer text-5xl font-black leading-[0.92] tracking-[-0.06em] text-white md:text-7xl lg:text-8xl">
                {t('The minds behind', 'មនុស្សនៅពីក្រោយ')}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-cyan-200">
                  {t('the momentum.', 'កម្លាំងច្នៃប្រឌិត។')}
                </span>
              </h1>
              <p className="mt-7 max-w-2xl font-khmer text-lg font-bold leading-8 text-gray-300 md:text-xl">
                {t('Hover the orbit, pause the signal, and meet the designers, developers, architects, translators, and makers building every Ponloe experience.', 'Hover លើ orbit បញ្ឈប់ signal ហើយស្គាល់អ្នករចនា អ្នកអភិវឌ្ឍន៍ ស្ថាបត្យករ អ្នកបកប្រែ និងអ្នកបង្កើតដែលសាងសង់បទពិសោធន៍ Ponloe។')}
              </p>

              <div className="mt-9 grid grid-cols-3 gap-3">
                {[
                  [team.length || 0, t('Creative minds', 'អ្នកច្នៃប្រឌិត')],
                  [totalSkills || 0, t('Skill signals', 'ជំនាញ')],
                  [teamPosts.length || 0, t('Studio notes', 'កំណត់ចំណាំ')],
                ].map(([value, label]) => (
                  <div key={label.toString()} className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 text-center shadow-2xl shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.1]">
                    <div className="text-3xl font-black text-white">{value}+</div>
                    <div className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-gray-400 font-khmer">{label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a href="/contact" onClick={navigateToContact} className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-khmer text-sm font-black text-gray-950 shadow-2xl shadow-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-100">
                  {t('Build with this team', 'ចាប់ផ្តើមជាមួយក្រុមនេះ')}
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                </a>
                <button onClick={() => activeMember && setSelectedMember(activeMember)} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-4 font-khmer text-sm font-black text-white/80 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:text-white">
                  <Sparkles size={17} />
                  {t('Spotlight member', 'មើលសមាជិកសំខាន់')}
                </button>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll variant="slide-left" delay={120}>
            <div className="relative">
              <div className="absolute -inset-6 rounded-[3rem] bg-indigo-500/10 blur-3xl" />
              <Suspense fallback={<div className="h-[620px]" />}>
                <HeroVisuals team={team} onMemberClick={setSelectedMember} />
              </Suspense>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-20 dark:bg-gray-950 md:py-28" aria-labelledby="team-roster-title">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_30%,rgba(99,102,241,0.12),transparent_34%),radial-gradient(circle_at_86%_76%,rgba(236,72,153,0.10),transparent_34%)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="font-khmer text-xs font-black uppercase tracking-[0.28em] text-indigo-600 dark:text-indigo-300">{t('Interactive roster', 'បញ្ជីក្រុមមានអន្តរកម្ម')}</span>
              <h2 id="team-roster-title" className="mt-3 font-khmer text-4xl font-black leading-none tracking-[-0.05em] text-gray-950 dark:text-white md:text-7xl">
                {t('Hover. Slide. Open.', 'Hover។ Slide។ បើកមើល។')}
              </h2>
            </div>
            <p className="max-w-md font-khmer text-sm font-bold leading-6 text-gray-500 dark:text-gray-400">
              {t('Every card reacts to your mouse and reveals a different creative discipline, so the team feels alive before the first meeting.', 'Card នីមួយៗឆ្លើយតបនឹង mouse ហើយបង្ហាញជំនាញផ្សេងៗ ដើម្បីឲ្យក្រុមមានអារម្មណ៍រស់រវើកមុនពេលជួបគ្នា។')}
            </p>
          </RevealOnScroll>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => {
              const isActive = activeMember?.id === member.id;
              return (
                <RevealOnScroll key={member.id} delay={index * 70} variant={index % 2 ? 'float-in' : 'tilt-in'}>
                  <article
                    onMouseEnter={() => setActiveMemberId(member.id)}
                    onClick={() => setSelectedMember(member)}
                    className={`group relative min-h-[430px] cursor-pointer overflow-hidden rounded-[2.2rem] border bg-gray-950 p-5 text-white shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-indigo-500/20 ${isActive ? 'border-indigo-300/70 shadow-indigo-500/20' : 'border-white/10 shadow-gray-950/10'}`}
                  >
                    <img src={member.coverImage || member.image} alt={member.name} className="absolute inset-0 h-full w-full object-cover opacity-65 transition-all duration-700 group-hover:scale-110 group-hover:opacity-82" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/36 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/25 via-transparent to-fuchsia-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute right-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-gray-950 shadow-2xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:rounded-full">
                      <Zap size={22} />
                    </div>
                    <div className="relative z-10 flex min-h-[390px] flex-col justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-white/12 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-xl">0{index + 1}</span>
                        <span className="rounded-full bg-emerald-400/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200 backdrop-blur-xl">{t('Available', 'ត្រៀមរួច')}</span>
                      </div>

                      <div>
                        <div className="mb-5 flex flex-wrap gap-2">
                          {(member.skills || []).slice(0, 3).map(skill => (
                            <span key={skill} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold text-white/80 backdrop-blur-xl">{skill}</span>
                          ))}
                        </div>
                        <h3 className="font-khmer text-4xl font-black tracking-[-0.05em] text-white md:text-5xl">{member.name}</h3>
                        <p className="mt-2 font-khmer text-sm font-black text-indigo-200">{t(member.role, member.roleKm)}</p>
                        <p className="mt-4 line-clamp-2 font-khmer text-sm font-bold leading-6 text-white/68">{t(member.bio, member.bioKm || member.bio)}</p>

                        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                          <div className="flex items-center gap-1 text-yellow-300">
                            {[1, 2, 3, 4, 5].map(star => <Star key={star} size={13} fill="currentColor" />)}
                          </div>
                          <div className="flex items-center gap-2">
                            {member.socials?.facebook && (
                              <a href={member.socials.facebook} onClick={event => event.stopPropagation()} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-[#1877F2]" aria-label={`${member.name} Facebook`}>
                                <Facebook size={15} />
                              </a>
                            )}
                            {member.socials?.telegram && (
                              <a href={member.socials.telegram} onClick={event => event.stopPropagation()} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-[#229ED9]" aria-label={`${member.name} Telegram`}>
                                <Send size={15} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gray-950 py-20 text-white md:py-28" aria-labelledby="team-method-title">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.20),transparent_34%),radial-gradient(circle_at_76%_82%,rgba(6,182,212,0.14),transparent_34%)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="font-khmer text-xs font-black uppercase tracking-[0.28em] text-cyan-200">{t('How the team moves', 'របៀបដែលក្រុមដំណើរការ')}</span>
              <h2 id="team-method-title" className="mt-4 font-khmer text-4xl font-black leading-tight tracking-[-0.05em] md:text-6xl">
                {t('One studio rhythm, many specialist signals.', 'ចង្វាក់ស្ទូឌីយោតែមួយ ជំនាញច្រើនប្រភេទ។')}
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                [t('Discover', 'ស្វែងយល់'), t('Research client goals, audience, and blockers.', 'ស្រាវជ្រាវគោលដៅ អតិថិជន និងឧបសគ្គ។')],
                [t('Shape', 'បង្កើតទម្រង់'), t('Turn rough ideas into visual systems and prototypes.', 'បំលែងគំនិតទៅជា visual system និង prototype។')],
                [t('Launch', 'ដំណើរការ'), t('Ship polished work with feedback loops and care.', 'បញ្ចេញស្នាដៃមានគុណភាព ជាមួយ feedback loop។')],
              ].map(([title, desc], index) => (
                <div key={title} className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.08]">
                  <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gray-950 transition-all duration-500 group-hover:rotate-6 group-hover:rounded-full">0{index + 1}</div>
                  <h3 className="font-khmer text-2xl font-black">{title}</h3>
                  <p className="mt-3 font-khmer text-sm font-bold leading-6 text-white/50">{desc}</p>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onSelectPost={(post) => {
            setSelectedMember(null);
            setSelectedPost(post);
          }}
        />
      )}
      {selectedPost && <ArticleDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
    </>
  );
};

export default TeamPage;
