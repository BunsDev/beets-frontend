import { useGetTokens } from '~/lib/global/useToken';
import { createContext, ReactNode, useContext, useEffect } from 'react';
import { AmountHumanReadable, TokenAmountHumanReadable, TokenBase } from '~/lib/services/token/token-types';
import { useBalances } from '~/lib/util/useBalances';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { parseUnits } from 'ethers/lib/utils';

export const UserBalancesContext = createContext<ReturnType<typeof _useUserBalances> | null>(null);

export function _useUserBalances(addresses: string[], additionalTokens?: TokenBase[]) {
    const { tokens: whitelistedTokens } = useGetTokens();
    const { userAddress, isLoading: isUserAccountLoading } = useUserAccount();

    const tokens = [...whitelistedTokens, ...(additionalTokens || [])].filter((token) =>
        addresses.includes(token.address),
    );
    const { data, isLoading, refetch, isError, error, isRefetching } = useBalances(userAddress || null, tokens);

    function getUserBalance(address: string): AmountHumanReadable {
        return data?.find((balance) => balance.address === address)?.amount || '0';
    }

    function isAmountLessThanEqUserBalance(amount: TokenAmountHumanReadable): boolean {
        if (amount.amount === '' || parseFloat(amount.amount) === 0) {
            return true;
        }

        const token = tokens.find((token) => token.address === amount.address);

        if (!token) {
            return false;
        }

        const userBalance = getUserBalance(amount.address);
        const userBalanceScaled = parseUnits(userBalance, token.decimals);
        const amountScaled = parseUnits(amount.amount, token.decimals);

        return userBalanceScaled.gte(amountScaled);
    }

    useEffect(() => {
        if (userAddress) {
            refetch().catch();
        }
    }, [userAddress]);

    return {
        userBalances: data,
        getUserBalance,
        isAmountLessThanEqUserBalance,
        refetch,
        isLoading: isLoading || isUserAccountLoading,
        isError,
        error,
        isRefetching,
    };
}

export function UserBalancesProvider(props: { children: ReactNode }) {
    const { tokens } = useGetTokens();
    const tokenAddresses = tokens.map((token) => token.address);

    const balances = _useUserBalances(tokenAddresses);

    return <UserBalancesContext.Provider value={balances}>{props.children}</UserBalancesContext.Provider>;
}

export const useUserBalances = () => useContext(UserBalancesContext) as ReturnType<typeof _useUserBalances>;
