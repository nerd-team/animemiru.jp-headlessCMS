import config from '@payload-config'
import { getPayload } from 'payload'

const EDITOR_ACCOUNTS = [
  {
    email: 'shogo@nerd.co.jp',
    passwordEnv: 'EDITOR_PASSWORD_SHOGO',
    defaultPassword: 'pass1234',
    name: 'shogo',
  },
  {
    email: 'factory-admin@nerd.co.jp',
    passwordEnv: 'EDITOR_PASSWORD_FACTORY',
    defaultPassword: 'pass1234!!',
    name: 'factory-admin',
  },
] as const

const SHARED_PROFILE = {
  displayName: 'animemiru編集部',
  authorSlug: 'editor',
  description:
    'アニメミル編集部。アニメ好きのためのアニメ好きによるエンタメマガジンをお届けします。キャラクターランキング・考察・ネタバレ解説などを執筆しています。',
  jobTitle: '編集者',
  twitter: 'https://twitter.com/animemiru_media',
  facebook: 'https://facebook.com/animemiru',
  instagram: 'https://www.instagram.com/animemiru/',
  homepage: 'https://animemiru.jp',
}

export async function seedEditorUsers() {
  const payload = await getPayload({ config })
  const created: string[] = []
  const skipped: string[] = []

  for (const account of EDITOR_ACCOUNTS) {
    const existing = await payload.find({
      collection: 'users',
      limit: 1,
      overrideAccess: true,
      where: { email: { equals: account.email } },
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'users',
        id: existing.docs[0].id,
        data: {
          ...SHARED_PROFILE,
          name: account.name,
        },
        overrideAccess: true,
      })
      skipped.push(account.email)
      continue
    }

    const password =
      process.env[account.passwordEnv] || account.defaultPassword

    await payload.create({
      collection: 'users',
      data: {
        email: account.email,
        password,
        ...SHARED_PROFILE,
        name: account.name,
      },
      overrideAccess: true,
    })
    created.push(account.email)
  }

  return {
    message: 'Editor users seeded',
    created,
    updated: skipped,
    displayName: SHARED_PROFILE.displayName,
    authorSlug: SHARED_PROFILE.authorSlug,
  }
}
