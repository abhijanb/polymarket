import { useGetPortfolioSummaryQuery } from "@/features/user/api/dashboardApi";
import { portfolioSummary as fallbackPortfolio } from "@/features/user/model/dashboardData";
import { formatCurrency } from "@/shared/lib/utils";

export function UserHome() {
  const { data: portfolioData, isLoading: portfolioLoading } = useGetPortfolioSummaryQuery();

  const portfolio = portfolioData ?? fallbackPortfolio;

  return (
    <>
      {/* Portfolio Overview */}
      <section className="terminal-bento grid grid-cols-12 mb-6">
        <div className="col-span-12 pane flex flex-col gap-4">
          {portfolioLoading ? (
            <div className="animate-pulse flex flex-col gap-3 flex-1">
              <div className="h-5 w-32 bg-surface-container-high rounded-sm" />
              <div className="h-10 w-3/4 bg-surface-container-high rounded-sm" />
              <div className="h-4 w-1/2 bg-surface-container-high rounded-sm" />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="h-16 bg-surface-container-high rounded-sm" />
                <div className="h-16 bg-surface-container-high rounded-sm" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                  account_balance_wallet
                </span>
                <span
                  className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant uppercase"
                  style={{ fontFamily: "JetBrains Mono" }}
                >
                  Portfolio Value
                </span>
              </div>
              <span
                className="text-[40px] font-bold text-on-surface leading-[1.2]"
                style={{ fontFamily: "Hanken Grotesk" }}
              >
                {formatCurrency(portfolio.totalValue)}
              </span>
              <div
                className="flex items-center gap-1 text-[14px] font-medium text-secondary"
                style={{ fontFamily: "JetBrains Mono" }}
              >
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span>+{formatCurrency(portfolio.dayChange)}</span>
                <span className="text-on-surface-variant font-normal">
                  ({portfolio.dayChangePct}%)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <span className="text-[12px] text-on-surface-variant block" style={{ fontFamily: "JetBrains Mono" }}>
                    Available Cash
                  </span>
                  <span className="text-[20px] font-bold text-on-surface" style={{ fontFamily: "Hanken Grotesk" }}>
                    {formatCurrency(portfolio.availableCash)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
