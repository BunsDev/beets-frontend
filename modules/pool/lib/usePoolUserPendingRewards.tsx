import { useStakingPendingRewards } from '~/lib/global/useStakingPendingRewards';
import { useGetTokens } from '~/lib/global/useToken';
import { sumBy, uniq } from 'lodash';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { usePool } from '~/modules/pool/lib/usePool';
import { createContext, ReactNode, useContext } from 'react';
import useStakingMintableRewards from '~/lib/global/useStakingMintableRewards';
import { GqlPoolStaking } from '~/apollo/generated/graphql-codegen-generated';

export function _usePoolUserPendingRewards() {
    const networkConfig = useNetworkConfig();
    const { pool } = usePool();
    const { hasBpt, isLoading: balancesLoading } = usePoolUserBptBalance();
    const { priceForAmount } = useGetTokens();
    const farm = pool.staking?.farm;
    const gauge = pool.staking?.gauge;

    const { data, isLoading, ...rest } = useStakingPendingRewards(
        pool.staking && hasBpt ? [pool.staking] : [],
        'usePoolUserPendingRewards',
    );

    const { claimableBALForGauges, isLoading: isLoadingClaimableBAL } = useStakingMintableRewards(
        pool.staking && hasBpt ? [pool.staking] : [],
    );

    const hasBeetsRewards =
        (data?.pendingRewards || []).filter(
            (item) => item.address === networkConfig.beets.address && parseFloat(item.amount) > 0,
        ).length > 0;

    const pendingRewardsTotalUSD = sumBy(data?.pendingRewards || [], priceForAmount);
    const rewardTokens = uniq([
        ...(hasBeetsRewards ? [networkConfig.beets.address] : []),
        ...(farm?.rewarders || []).map((rewarder) => rewarder.tokenAddress),
        ...(gauge?.rewards || []).map((reward) => reward.tokenAddress),
    ]);

    const pendingRewards: TokenAmountHumanReadable[] = rewardTokens.map((rewardToken) => {
        const pending = (data?.pendingRewards || []).find((data) => data.address === rewardToken);
        return pending || { address: rewardToken, amount: '0' };
    });

    const hasPendingRewards = pendingRewards.filter((item) => parseFloat(item.amount) > 0).length > 0;

    const claimableAmountBal = pendingRewards.find(
        (reward) => reward.address === networkConfig.balancer.balToken,
    )?.amount;
    const hasPendingBalRewards = parseFloat(claimableAmountBal || '0') > 0;
    const nonBALRewards = pendingRewards.filter((p) => p.address !== networkConfig.balancer.balToken);
    const hasPendingNonBALRewards = sumBy(nonBALRewards, (r) => parseFloat(r.amount)) > 0;

    // TODO: check if this can be removed when relayer v6 is released
    const pendingBALUSD = priceForAmount({
        address: networkConfig.balancer.balToken,
        amount: claimableAmountBal || '0',
    });

    return {
        pendingRewards,
        pendingRewardsTotalUSD,
        pendingBALUSD,
        hasPendingRewards,
        hasPendingBalRewards,
        hasPendingNonBALRewards,
        claimableBALForGauges,
        ...rest,
        isLoading: isLoading || balancesLoading || isLoadingClaimableBAL,
    };
}

export const PoolUserPendingRewardsContext = createContext<ReturnType<typeof _usePoolUserPendingRewards> | null>(null);

export function PoolUserPendingRewardsProvider(props: { children: ReactNode }) {
    const value = _usePoolUserPendingRewards();

    return (
        <PoolUserPendingRewardsContext.Provider value={value}>{props.children}</PoolUserPendingRewardsContext.Provider>
    );
}

export function usePoolUserPendingRewards() {
    return useContext(PoolUserPendingRewardsContext) as ReturnType<typeof _usePoolUserPendingRewards>;
}
