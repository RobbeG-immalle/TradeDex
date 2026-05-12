import { createClient } from '@/lib/supabase/server'
import { formatRelativeTime } from '@tradedex/utils'
import { LeaveReviewButton } from './leave-review-button'
import type { ReviewWithReviewer } from '@tradedex/types'

interface Props {
  reviewedUserId: string
  currentUserId: string | null
}

export async function ReviewList({ reviewedUserId, currentUserId }: Props) {
  const supabase = await createClient()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, reviewer:profiles!reviews_reviewer_id_fkey(username, avatar_url)')
    .eq('reviewed_id', reviewedUserId)
    .order('created_at', { ascending: false })
    .limit(20)

  const canReview =
    currentUserId !== null &&
    currentUserId !== reviewedUserId &&
    !reviews?.some((r) => r.reviewer_id === currentUserId)

  const positives = reviews?.filter((r) => r.type === 'POSITIVE').length ?? 0
  const negatives = reviews?.filter((r) => r.type === 'NEGATIVE').length ?? 0
  const total = reviews?.length ?? 0

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Reviews</h2>
          {total > 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {positives} positive · {negatives} negative · {total} total
            </p>
          )}
        </div>
        {canReview && <LeaveReviewButton reviewedUserId={reviewedUserId} />}
      </div>

      {!reviews || reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-8 text-center text-slate-400">
          <p className="text-3xl mb-2">⭐</p>
          <p>No reviews yet</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {reviews.map((review) => {
            const reviewer = Array.isArray(review.reviewer) ? review.reviewer[0] : review.reviewer
            return (
              <li
                key={review.id}
                className="rounded-xl border border-slate-200 dark:border-slate-700 p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">
                    {review.type === 'POSITIVE' ? '👍' : review.type === 'NEGATIVE' ? '👎' : '😐'}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{reviewer?.username ?? 'Unknown'}</span>
                      <span className="text-xs text-slate-400">
                        {formatRelativeTime(review.created_at)}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
