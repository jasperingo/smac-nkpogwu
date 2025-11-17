'use client'

import RetriableError from '@/components/retriable-error';

export default function AdminProgramError({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }) {
  return <RetriableError error={error} reset={reset} />
}
