import { PortfolioCard } from "@/features/user/components/PortfolioCard";
import { RecentActivityList } from "@/features/user/components/RecentActivityList";
import { usePortfolio } from "@/features/user/hooks/usePortfolio";
import { useRecentOrders } from "@/features/user/hooks/useRecentOrders";

export function UserHome() {
  const { portfolio, isLoading, isUninitialized, error, refetch: refetchPortfolio } =
    usePortfolio();
  const {
    items: recent,
    totalCount,
    isLoading: recentLoading,
    isUninitialized: recentUninitialized,
    refetch: refetchRecent,
  } = useRecentOrders(5);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7">
          <PortfolioCard
            portfolio={portfolio}
            isLoading={isLoading}
            isUninitialized={isUninitialized}
            onRetry={error ? () => refetchPortfolio() : undefined}
          />
        </div>
        <div className="md:col-span-5">
          <RecentActivityList
            items={recent}
            isLoading={recentLoading}
            isUninitialized={recentUninitialized}
            totalCount={totalCount}
            limit={5}
            onRetry={() => refetchRecent()}
          />
        </div>
      </div>
    </div>
  );
}
