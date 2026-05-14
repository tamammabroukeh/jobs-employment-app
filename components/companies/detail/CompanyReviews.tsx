'use client';

import { useState } from 'react';
import { Typography, ReusableButton } from '@/components/Reusable-Components';
import { useCompaniesTranslations } from '@/hooks/use-translations';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Review {
  id: string;
  rating: number;
  userName: string;
  userAvatar?: string;
  date: string;
  position: string;
  recommend: boolean;
  ceoApproval: boolean;
  subratings: {
    compensation: number;
    culture: number;
    workLife: number;
    diversity: number;
    management: number;
  };
  agrees: number;
  disagrees: number;
}

interface CompanyReviewsProps {
  companyId: string;
  overallRating: number;
  totalRatings: number;
  wouldRecommend: number;
  ceoPerformance: number;
  categoryRatings: {
    compensation: number;
    culture: number;
    workLife: number;
    diversity: number;
    management: number;
  };
  reviews: Review[];
}

export default function CompanyReviews({
  companyId,
  overallRating,
  totalRatings,
  wouldRecommend,
  ceoPerformance,
  categoryRatings,
  reviews,
}: CompanyReviewsProps) {
  const t = useCompaniesTranslations();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  // Pagination
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = reviews.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddReview = () => {
    router.push(`/companies/rate?id=${companyId}`);
  };

  const getCategoryPercentage = (rating: number) => {
    return ((rating / 5) * 100).toFixed(0);
  };

  return (
    <div className="space-y-8">
      {/* Add Review Button */}
      <div className="flex justify-end">
        <ReusableButton variant="primary" size="large" onClick={handleAddReview}>
          <i className="fa-solid fa-plus mr-2" />
          {t('detail.reviews.addReview')}
        </ReusableButton>
      </div>

      {/* Overall Rating Section */}
      <div className="auth-card p-8">
        <Typography variant="h3" className="text-foreground mb-6">
          {t('detail.reviews.overallRating')}
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Rating Score */}
          <div className="text-center">
            <Typography variant="h1" className="text-primary mb-2">
              {overallRating.toFixed(2)}
            </Typography>
            <div className="flex justify-center items-center gap-1 mb-2">
              {[...Array(5)].map((_, index) => (
                <i
                  key={index}
                  className={`fa-solid fa-star text-2xl ${
                    index < Math.floor(overallRating) ? 'text-warning' : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <Typography variant="small" className="text-muted-foreground">
              ({totalRatings} {t('detail.reviews.totalRatings')})
            </Typography>
          </div>

          {/* Stats */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <Typography variant="small" className="text-muted-foreground mb-2">
                {t('detail.reviews.wouldRecommend')}
              </Typography>
              <Typography variant="h4" className="text-foreground">
                {wouldRecommend}%
              </Typography>
            </div>
            <div>
              <Typography variant="small" className="text-muted-foreground mb-2">
                {t('detail.reviews.ceoPerformance')}
              </Typography>
              <Typography variant="h4" className="text-foreground">
                {ceoPerformance}%
              </Typography>
            </div>
          </div>
        </div>

        {/* Ratings By Category */}
        <div className="mt-8 pt-8 border-t border-border">
          <Typography variant="h4" className="text-foreground mb-6">
            {t('detail.reviews.ratingsByCategory')}
          </Typography>
          <div className="space-y-4">
            {Object.entries(categoryRatings).map(([key, rating]) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-2">
                  <Typography variant="small" className="text-foreground">
                    {rating.toFixed(2)} {t(`detail.reviews.categories.${key}`)}
                  </Typography>
                  <Typography variant="small" className="text-muted-foreground">
                    {getCategoryPercentage(rating)}%
                  </Typography>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${getCategoryPercentage(rating)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Reviews */}
      <div>
        <Typography variant="h3" className="text-foreground mb-6">
          {t('detail.reviews.userReviews')}
        </Typography>

        {reviews.length === 0 ? (
          <div className="auth-card p-12 text-center">
            <i className="fa-solid fa-star text-6xl text-muted-foreground mb-4" />
            <Typography variant="h3" className="text-foreground mb-2">
              {t('detail.reviews.noReviews')}
            </Typography>
            <Typography variant="p" className="text-muted-foreground">
              {t('detail.reviews.noReviewsDescription')}
            </Typography>
          </div>
        ) : (
          <div className="space-y-6">
            {currentReviews.map((review) => (
              <div key={review.id} className="auth-card p-6">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {review.userAvatar ? (
                        <Image src={review.userAvatar} alt={review.userName} width={48} height={48} />
                      ) : (
                        <i className="fa-solid fa-user text-muted-foreground text-xl" />
                      )}
                    </div>
                    <div>
                      <Typography variant="h5" className="text-foreground">
                        {review.userName}
                      </Typography>
                      <Typography variant="small" className="text-muted-foreground">
                        {review.position}
                      </Typography>
                    </div>
                  </div>
                  <Typography variant="small" className="text-muted-foreground">
                    {review.date}
                  </Typography>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, index) => (
                    <i
                      key={index}
                      className={`fa-solid fa-star ${
                        index < review.rating ? 'text-warning' : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>

                {/* Badges */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    {review.recommend ? (
                      <i className="fa-solid fa-check text-success" />
                    ) : (
                      <i className="fa-solid fa-times text-destructive" />
                    )}
                    <Typography variant="small" className="text-muted-foreground">
                      {t('detail.reviews.recommend')}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    {review.ceoApproval ? (
                      <i className="fa-solid fa-check text-success" />
                    ) : (
                      <i className="fa-solid fa-times text-destructive" />
                    )}
                    <Typography variant="small" className="text-muted-foreground">
                      {t('detail.reviews.ceoApproval')}
                    </Typography>
                  </div>
                </div>

                {/* Subratings */}
                <div className="bg-muted/30 rounded-lg p-4 mb-4">
                  <Typography variant="small" className="text-muted-foreground mb-3">
                    {t('detail.reviews.subratings')}
                  </Typography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {Object.entries(review.subratings).map(([key, rating]) => (
                      <div key={key}>
                        <Typography variant="xsmall" className="text-muted-foreground mb-1">
                          {t(`detail.reviews.categories.${key}`)}
                        </Typography>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, index) => (
                            <i
                              key={index}
                              className={`fa-solid fa-star text-xs ${
                                index < rating ? 'text-warning' : 'text-muted-foreground/30'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interaction Buttons */}
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-success transition-colors">
                    <i className="fa-solid fa-thumbs-up" />
                    <Typography variant="small">{t('detail.reviews.agree')}</Typography>
                    <Typography variant="small">({review.agrees})</Typography>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors">
                    <i className="fa-solid fa-thumbs-down" />
                    <Typography variant="small">{t('detail.reviews.disagree')}</Typography>
                    <Typography variant="small">({review.disagrees})</Typography>
                  </button>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <ReusableButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="default"
                  iconOnly
                  icon={<i className="fa-solid fa-chevron-left" />}
                />

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <ReusableButton
                    key={page}
                    onClick={() => handlePageChange(page)}
                    variant={currentPage === page ? 'primary' : 'default'}
                  >
                    {page}
                  </ReusableButton>
                ))}

                <ReusableButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="default"
                  iconOnly
                  icon={<i className="fa-solid fa-chevron-right" />}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
