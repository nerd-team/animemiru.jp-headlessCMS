export {
  DEFAULT_AUTHOR_PROFILE,
  DEFAULT_AUTHOR_SLUG,
  type AuthorProfile,
} from '@/lib/authorProfile'

/** @deprecated use fetchAuthorBySlug */
export { DEFAULT_AUTHOR_PROFILE as EDITOR_AUTHOR } from '@/lib/authorProfile'

export { fetchAuthorBySlug as getAuthorBySlug } from '@/lib/fetchAuthorBySlug'
