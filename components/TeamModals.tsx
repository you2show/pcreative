import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Facebook, Send, FileText, User, Code, Briefcase, Calendar, Tag, MessageCircle, Share2, Check, Copy, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { TeamMember, Post, Comment } from '../types';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getSupabaseClient } from '../lib/supabase';
import {
    fetchPostCommentsPublic,
    addPostCommentViaAPI,
    addPostCommentToGitHub,
} from '../lib/github';
import ContentRenderer from './ContentRenderer';
import LocalScrollButton from './LocalScrollButton';
import { useSEO } from '../hooks/useSEO';

// Helper to count comments recursively
const getTotalCommentCount = (comments: Comment[]): number => {
  if (!comments) return 0;
  return comments.reduce((acc, comment) => {
    return acc + 1 + (comment.replies ? getTotalCommentCount(comment.replies) : 0);
  }, 0);
};

// Build a nested comment tree from Supabase flat rows
const buildCommentTree = (rows: any[]): Comment[] => {
    const map = new Map<string, Comment>();
    const roots: Comment[] = [];
    rows.forEach(c => {
        map.set(c.id, {
            id: c.id,
            user: c.user_name || 'Anonymous',
            avatar: c.avatar || '',
            content: c.content,
            date: c.created_at,
            replies: []
        });
    });
    rows.forEach(c => {
        const comment = map.get(c.id)!;
        if (c.parent_id && map.has(c.parent_id)) {
            map.get(c.parent_id)!.replies!.push(comment);
        } else {
            roots.push(comment);
        }
    });
    return roots;
};

// --- Member Detail Modal ---
interface MemberDetailModalProps {
    member: TeamMember;
    onClose: () => void;
    onShowArticles?: (member: TeamMember) => void;
    onSelectPost?: (post: Post) => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({ member, onClose, onSelectPost }) => {
    const { t, language } = useLanguage();
    const { insights = [] } = useData();
    const [showArticlesView, setShowArticlesView] = useState(false);

    if (!member) return null;

    const memberPosts = (insights || []).filter(post => post?.authorId === member.id);
    const postCount = memberPosts.length;
    const skills = member.skills || [];
    const experience = member.experience || [];
    const experienceKm = member.experienceKm || [];
    const socials = member.socials || {};

    return createPortal(
        <div className="fixed inset-0 z-[10002] flex items-center justify-center px-4 py-8 md:p-4 overflow-hidden">
            <div 
                className="absolute inset-0 bg-gray-950/95 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            />
            <div className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-scale-up z-[10003] flex flex-col max-h-full">
                {/* Header / Cover */}
                <div className="h-32 bg-gray-800 relative shrink-0 overflow-hidden">
                    {member.coverImage ? (
                        <img 
                            src={member.coverImage} 
                            alt="" 
                            className="w-full h-full object-cover opacity-50"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-indigo-600/20 to-purple-600/20" />
                    )}
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md z-10"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Profile Identity (non-scrollable) */}
                <div className="px-8 pt-0 pb-4 shrink-0 -mt-12 relative z-10">
                    {/* Desktop: photo | name+role | socials — Mobile: stacked */}
                    <div className="flex flex-col md:flex-row md:items-end md:gap-4">
                        <img 
                            src={member.image} 
                            alt={member.name} 
                            className="w-24 h-24 rounded-2xl border-4 border-gray-900 object-cover shadow-xl shrink-0"
                            loading="lazy"
                            decoding="async"
                        />
                        {/* Name + Role */}
                        <div className="mt-3 md:mt-0 md:mb-1 flex-1 min-w-0">
                            <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                            <p className="text-indigo-400 font-medium font-khmer">{t(member.role, member.roleKm)}</p>
                        </div>
                        {/* Social Links — far right on desktop */}
                        <div className="flex gap-3 mt-4 md:mt-0 md:mb-1 md:shrink-0">
                            {socials.facebook && (
                                <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/5">
                                    <Facebook size={18} />
                                </a>
                            )}
                            {socials.telegram && (
                                <a href={socials.telegram} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/5">
                                    <Send size={18} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="px-8 pb-8 flex-1 overflow-y-auto scrollbar-hide min-h-0">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{t('Projects', 'គម្រោង')}</p>
                            <p className="text-xl font-bold text-white">12+</p>
                        </div>
                        <button 
                            onClick={() => setShowArticlesView(true)}
                            className="bg-white/5 rounded-2xl p-4 border border-white/5 text-left hover:bg-white/10 transition-all group"
                        >
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{t('Articles', 'អត្ថបទ')}</p>
                            <p className="text-xl font-bold text-white flex items-center justify-between">
                                {postCount}
                                <ArrowRight size={18} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                            </p>
                        </button>
                    </div>

                    {showArticlesView ? (
                        /* Inline Articles View */
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-white font-bold flex items-center gap-2">
                                    <FileText size={18} className="text-indigo-400" />
                                    {t('Articles', 'អត្ថបទ')}
                                </h4>
                                <button
                                    onClick={() => setShowArticlesView(false)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs border border-white/10 transition-all"
                                >
                                    <X size={14} />
                                    {t('Back', 'ត្រឡប់')}
                                </button>
                            </div>
                            {memberPosts.length === 0 ? (
                                <p className="text-gray-500 text-sm font-khmer text-center py-6">{t('No articles yet.', 'មិនទាន់មានអត្ថបទទេ។')}</p>
                            ) : (
                                <div className="space-y-3">
                                    {memberPosts.map((post) => (
                                        <article
                                            key={post.id}
                                            className="group flex gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer"
                                            onClick={() => {
                                                if (onSelectPost) {
                                                    onClose();
                                                    onSelectPost(post);
                                                }
                                            }}
                                        >
                                            <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden">
                                                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" decoding="async" />
                                            </div>
                                            <div className="flex-1 min-w-0 py-0.5">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{post.category}</span>
                                                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                                        <Calendar size={10} />
                                                        <span>{post.date}</span>
                                                    </div>
                                                </div>
                                                <h4 className="text-white font-bold group-hover:text-indigo-400 transition-colors line-clamp-2 font-khmer text-sm">
                                                    {t(post.title, post.titleKm)}
                                                </h4>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                    {/* Skills */}
                    <div className="mb-8">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Code size={18} className="text-indigo-400" />
                            {t('Expertise', 'ជំនាញ')}
                        </h4>
                        <div className="space-y-3">
                            {skills.map((skill, i) => {
                                // Assign a pseudo-random but deterministic level (75–98) based on index
                                const level = 75 + ((i * 7 + 13) % 24);
                                const colors = [
                                    'from-indigo-500 to-indigo-400',
                                    'from-purple-500 to-purple-400',
                                    'from-pink-500 to-pink-400',
                                    'from-cyan-500 to-cyan-400',
                                    'from-blue-500 to-blue-400',
                                ];
                                const color = colors[i % colors.length];
                                return (
                                    <div key={i}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-300 text-xs font-medium">{skill}</span>
                                            <span className="text-gray-500 text-xs">{level}%</span>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000`}
                                                style={{ width: `${level}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Experience */}
                    <div>
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Briefcase size={18} className="text-indigo-400" />
                            {t('Experience', 'បទពិសោធន៍')}
                        </h4>
                        <div className="space-y-4">
                            {(language === 'km' ? experienceKm : experience).map((exp, i) => (
                                <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-indigo-500 before:rounded-full">
                                    <p className="text-gray-300 text-sm font-khmer leading-relaxed">{exp}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- Author Articles Modal ---
interface AuthorArticlesModalProps {
    author: TeamMember;
    posts: Post[];
    onClose: () => void;
    onSelectPost: (post: Post) => void;
}

export const AuthorArticlesModal: React.FC<AuthorArticlesModalProps> = ({ author, posts, onClose, onSelectPost }) => {
    const { t } = useLanguage();

    return createPortal(
        <div className="fixed inset-0 z-[10004] flex items-center justify-center p-4 overflow-hidden">
            <div 
                className="absolute inset-0 bg-gray-950/95 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            />
            <div className="relative w-full max-w-2xl bg-gray-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-scale-up z-[10005] flex flex-col max-h-[80vh]">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gray-900 z-10">
                    <div className="flex items-center gap-4">
                        <img src={author.image} alt={author.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                            <h3 className="text-lg font-bold text-white">{author.name}</h3>
                            <p className="text-xs text-gray-500 font-khmer">{t('All Articles', 'អត្ថបទទាំងអស់')}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <article 
                                key={post.id} 
                                className="group flex gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer"
                                onClick={() => onSelectPost(post)}
                            >
                                <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 min-w-0 py-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{post.category}</span>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                            <Calendar size={10} />
                                            <span>{post.date}</span>
                                        </div>
                                    </div>
                                    <h4 className="text-white font-bold group-hover:text-indigo-400 transition-colors line-clamp-2 font-khmer text-sm mb-2">
                                        {t(post.title, post.titleKm)}
                                    </h4>
                                    <p className="text-gray-400 text-[10px] leading-relaxed line-clamp-2 font-khmer">
                                        {post.excerpt}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- Article Detail Modal ---
interface ArticleDetailModalProps {
    post: Post;
    onClose: () => void;
    onAuthorClick?: (authorId: string) => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({ post, onClose, onAuthorClick }) => {
    const { t, language } = useLanguage();
    const { team = [] } = useData();
    const { currentUser } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [guestName, setGuestName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentError, setCommentError] = useState('');
    const [replyTo, setReplyTo] = useState<{id: string, name: string} | null>(null);
    const [copied, setCopied] = useState(false);
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    
    const scrollRef = useRef<HTMLDivElement>(null);
    const author = team.find(m => m.id === post.authorId);

    // SEO: update <head> meta tags while article is open so Google can index each article URL
    const articleSlug = post.slug || post.id;
    const articleUrl = `https://ponloe.org/insights/${articleSlug}`;
    const articleTitle = `${language === 'km' && post.titleKm ? post.titleKm : post.title} | Ponloe Creative`;
    const rawContent = language === 'km' && post.contentKm ? post.contentKm : post.content || '';
    const strippedContent = (() => {
        try {
            return new DOMParser().parseFromString(rawContent, 'text/html').body.textContent || '';
        } catch {
            return rawContent.replace(/<[^>]*>/g, '');
        }
    })();
    const articleDesc = post.excerpt || strippedContent.slice(0, 160);
    useSEO({
        title: articleTitle,
        description: articleDesc,
        image: post.image,
        url: articleUrl,
        type: 'article',
        article: {
            publishedTime: post.date,
            author: author?.name,
            section: post.category,
        },
        jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: language === 'km' && post.titleKm ? post.titleKm : post.title,
            description: articleDesc,
            image: post.image,
            url: articleUrl,
            datePublished: post.date,
            author: author
                ? { '@type': 'Person', name: author.name, url: `https://ponloe.org/team/${author.slug || author.id}` }
                : { '@type': 'Organization', name: 'Ponloe Creative', url: 'https://ponloe.org' },
            publisher: {
                '@type': 'Organization',
                name: 'Ponloe Creative',
                logo: { '@type': 'ImageObject', url: 'https://ponloe.org/ponloe-logo.svg' },
            },
            mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
            articleSection: post.category,
            inLanguage: ['km', 'en'],
        },
    });

    // Fetch comments: Supabase first, fall back to site-data.json
    useEffect(() => {
        const fetchComments = async () => {
            setIsLoadingComments(true);
            try {
                const supabase = getSupabaseClient();
                if (supabase) {
                    const { data, error } = await supabase
                        .from('comments')
                        .select('*')
                        .eq('post_id', post.id)
                        .order('created_at', { ascending: true });
                    if (!error && data) {
                        setComments(buildCommentTree(data));
                        return;
                    }
                    console.warn('Supabase comment fetch failed, falling back to site-data.json:', error);
                }
                // Fallback: site-data.json public URL
                setComments(await fetchPostCommentsPublic(post.id));
            } catch (err) {
                console.error('Error fetching comments:', err);
            } finally {
                setIsLoadingComments(false);
            }
        };

        if (post.id) fetchComments();
    }, [post.id]);

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        const authorName = currentUser ? (currentUser.name || 'Guest') : guestName.trim();
        if (!newComment.trim() || !authorName) return;

        setIsSubmitting(true);
        setCommentError('');

        const applyToUI = (comment: Comment) => {
            if (replyTo) {
                const updateReplies = (list: Comment[]): Comment[] =>
                    list.map(c => {
                        if (c.id === replyTo.id) return { ...c, replies: [...(c.replies || []), comment] };
                        if (c.replies?.length) return { ...c, replies: updateReplies(c.replies) };
                        return c;
                    });
                setComments(prev => updateReplies(prev));
            } else {
                setComments(prev => [...prev, comment]);
            }
        };

        try {
            // ── Priority 1: Supabase ──────────────────────────────────────────
            const supabase = getSupabaseClient();
            if (supabase) {
                const commentData = {
                    post_id: post.id,
                    user_id: currentUser ? (currentUser.id || 'anonymous') : 'guest',
                    user_name: authorName,
                    content: newComment.trim(),
                    parent_id: replyTo?.id || null
                };
                const { data, error } = await supabase
                    .from('comments')
                    .insert([commentData])
                    .select()
                    .single();
                if (!error && data) {
                    const saved: Comment = {
                        id: data.id,
                        user: data.user_name || authorName,
                        avatar: data.avatar || '',
                        content: data.content,
                        date: data.created_at || new Date().toISOString(),
                        replies: []
                    };
                    applyToUI(saved);
                    setNewComment('');
                    setReplyTo(null);
                    if (!currentUser) setGuestName('');
                    return;
                }
                console.warn('Supabase comment insert failed, trying GitHub site-data.json:', error);
            }

            // ── Priority 2: Serverless API (Vercel — token stays server-side) ──────
            const fallbackComment: Comment = {
                id: (typeof crypto !== 'undefined' && crypto.randomUUID)
                    ? crypto.randomUUID()
                    : `c_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
                user: authorName,
                avatar: '',
                content: newComment.trim(),
                date: new Date().toISOString(),
                replies: []
            };

            const savedViaAPI = await addPostCommentViaAPI(post.id, fallbackComment, replyTo?.id || null);
            if (savedViaAPI) {
                applyToUI(fallbackComment);
                setNewComment('');
                setReplyTo(null);
                if (!currentUser) setGuestName('');
                return;
            }

            // ── Priority 3: Direct GitHub (local dev fallback with localStorage token) ─
            const savedToGitHub = await addPostCommentToGitHub(post.id, fallbackComment, replyTo?.id || null);

            if (!savedToGitHub) {
                throw new Error('Both Supabase and GitHub are unavailable.');
            }

            applyToUI(fallbackComment);
            setNewComment('');
            setReplyTo(null);
            if (!currentUser) setGuestName('');
        } catch (err) {
            console.error('Error posting comment:', err);
            setCommentError(t('Failed to post comment. Please try again.', 'បរាជ័យក្នុងការផ្ញើមតិ។ សូមព្យាយាមម្ដងទៀត។'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => (
        <div className={`flex gap-3 ${isReply ? 'ml-8 mt-4' : 'mt-6'}`}>
            <div className="shrink-0">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
                    {comment.user.charAt(0)}
                </div>
            </div>
            <div className="flex-1">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-white font-bold text-sm">{comment.user}</span>
                        <span className="text-gray-500 text-[10px]">{new Date(comment.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-300 text-sm font-khmer">{comment.content}</p>
                </div>
                <div className="flex gap-4 mt-2 ml-2">
                    <button 
                        onClick={() => setReplyTo({id: comment.id, name: comment.user})}
                        className="text-[10px] font-bold text-gray-500 hover:text-indigo-400 transition-colors uppercase tracking-wider"
                    >
                        {t('Reply', 'ឆ្លើយតប')}
                    </button>
                </div>
                {comment.replies && comment.replies.map(reply => (
                    <CommentItem key={reply.id} comment={reply} isReply={true} />
                ))}
            </div>
        </div>
    );

    return createPortal(
        <div className="fixed inset-0 z-[10006] flex items-center justify-center p-0 md:p-4 overflow-hidden">
            <div 
                className="absolute inset-0 bg-gray-950/95 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            />
            <div className="relative w-full max-w-4xl h-full md:h-[95vh] bg-gray-900 md:border md:border-white/10 md:rounded-3xl shadow-2xl overflow-hidden animate-scale-up flex flex-col z-[10007]">
                {/* Close Button Mobile */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md z-50 md:hidden"
                >
                    <X size={20} />
                </button>

                <div className="flex-1 overflow-y-auto scrollbar-hide relative" ref={scrollRef}>
                    <LocalScrollButton containerRef={scrollRef} />
                    
                    {/* Hero Image */}
                    <div className="relative h-[40vh] md:h-[50vh] shrink-0">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
                        
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                    <Tag size={12} /> {post.category}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-white/10">
                                    <Calendar size={12} /> {post.date}
                                </span>
                            </div>
                            <h2 className="text-xl md:text-3xl font-bold text-white font-khmer leading-tight mb-6">{t(post.title, post.titleKm)}</h2>
                            
                            {author && (
                                <div 
                                    className="flex items-center gap-4 cursor-pointer group"
                                    onClick={() => onAuthorClick?.(author.id)}
                                >
                                    <img src={author.image} alt={author.name} className="w-12 h-12 rounded-full border-2 border-white/20 group-hover:border-indigo-400 transition-colors" loading="lazy" decoding="async" />
                                    <div>
                                        <p className="text-white font-bold group-hover:text-indigo-400 transition-colors">{author.name}</p>
                                        <p className="text-gray-400 text-xs font-khmer">{t(author.role, author.roleKm)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Article Content */}
                    <div className="px-6 md:px-10 py-10">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
                                <div className="flex gap-4">
                                    <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/5 text-sm font-bold">
                                        {copied ? <Check size={16} className="text-green-400" /> : <Share2 size={16} />}
                                        {copied ? t('Copied!', 'បានចម្លង!') : t('Share', 'ចែករំលែក')}
                                    </button>
                                </div>
                                <button onClick={onClose} className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest">
                                    {t('Close', 'បិទ')} <X size={20} />
                                </button>
                            </div>

                            <div className="prose prose-invert prose-indigo max-w-none">
                                <ContentRenderer content={t(post.content, post.contentKm || post.content)} />
                            </div>

                            {/* Comments Section */}
                            <div className="mt-20 pt-10 border-t border-white/10">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <MessageCircle size={24} className="text-indigo-400" />
                                        {t('Comments', 'មតិយោបល់')} 
                                        <span className="text-sm bg-white/5 px-2 py-1 rounded-lg text-gray-500">{getTotalCommentCount(comments)}</span>
                                    </h3>
                                </div>

                                {isLoadingComments ? (
                                    <div className="flex items-center gap-2 text-gray-500 py-10">
                                        <Loader2 className="animate-spin" size={20} />
                                        <span className="text-sm">Loading comments...</span>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {comments.length > 0 ? (
                                            comments.map(comment => (
                                                <CommentItem key={comment.id} comment={comment} />
                                            ))
                                        ) : (
                                            <div className="bg-white/5 rounded-2xl p-10 text-center border border-white/5 border-dashed">
                                                <p className="text-gray-500 text-sm font-khmer">{t('No comments yet. Be the first to share your thoughts!', 'មិនទាន់មានមតិយោបល់នៅឡើយទេ។ ក្លាយជាអ្នកដំបូងដែលចែករំលែកគំនិតរបស់អ្នក!')}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Comment Form */}
                                <div className="mt-12 bg-white/5 rounded-3xl p-6 border border-white/5">
                                    {commentError && (
                                        <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-khmer">
                                            <AlertCircle size={14} className="shrink-0" />
                                            {commentError}
                                        </div>
                                    )}
                                    {currentUser ? (
                                        <form onSubmit={handleSubmitComment}>
                                            {replyTo && (
                                                <div className="flex items-center justify-between bg-indigo-500/10 px-4 py-2 rounded-xl mb-4 border border-indigo-500/20">
                                                    <p className="text-xs text-indigo-300">Replying to <span className="font-bold">{replyTo.name}</span></p>
                                                    <button type="button" onClick={() => setReplyTo(null)} className="text-gray-500 hover:text-white"><X size={14} /></button>
                                                </div>
                                            )}
                                            <textarea 
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder={t('Write your comment...', 'សរសេរមតិយោបល់របស់អ្នក...')}
                                                className="w-full bg-transparent border-none focus:ring-0 text-white font-khmer resize-none min-h-[100px]"
                                            />
                                            <div className="flex justify-end mt-4">
                                                <button 
                                                    type="submit" 
                                                    disabled={isSubmitting || !newComment.trim()}
                                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white font-bold rounded-xl transition-all flex items-center gap-2 text-sm"
                                                >
                                                    {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                                                    {t('Post Comment', 'ផ្ញើមតិ')}
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <form onSubmit={handleSubmitComment}>
                                            {replyTo && (
                                                <div className="flex items-center justify-between bg-indigo-500/10 px-4 py-2 rounded-xl mb-4 border border-indigo-500/20">
                                                    <p className="text-xs text-indigo-300">Replying to <span className="font-bold">{replyTo.name}</span></p>
                                                    <button type="button" onClick={() => setReplyTo(null)} className="text-gray-500 hover:text-white"><X size={14} /></button>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                                                    <User size={14} />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={guestName}
                                                    onChange={(e) => setGuestName(e.target.value)}
                                                    placeholder={t('Your name', 'ឈ្មោះរបស់អ្នក')}
                                                    required
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-khmer placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
                                                />
                                            </div>
                                            <textarea
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder={t('Write your comment...', 'សរសេរមតិយោបល់របស់អ្នក...')}
                                                className="w-full bg-transparent border-none focus:ring-0 text-white font-khmer resize-none min-h-[80px]"
                                            />
                                            <div className="flex justify-end mt-3">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting || !newComment.trim() || !guestName.trim()}
                                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white font-bold rounded-xl transition-all flex items-center gap-2 text-sm"
                                                >
                                                    {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                                                    {t('Post Comment', 'ផ្ញើមតិ')}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
