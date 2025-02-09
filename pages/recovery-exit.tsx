import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { GetPoolFilters, GetPools } from '~/apollo/generated/operations';
import { GetPoolsQuery, GetPoolsQueryVariables } from '~/apollo/generated/graphql-codegen-generated';
import { DEFAULT_POOL_LIST_QUERY_VARS, PoolListProvider } from '~/modules/pools/usePoolList';
import Head from 'next/head';
import { PageMasthead } from '~/components/masthead/PageMasthead';
import NextImage from 'next/image';
import InvestMastheadImage from '~/assets/images/invest-masthead-image.png';
import InvestMastheadOpImage from '~/assets/images/invest-masthead-image-OP.png';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { UserTokenBalancesProvider } from '~/lib/user/useUserTokenBalances';
import { LinearPoolList } from '~/modules/linear-pools/LinearPoolList';
import { RecoveryExitContent } from '~/modules/recovery-exit/RecoveryExitContent';

function LinearPools() {
    const { chainId } = useNetworkConfig();

    const TITLE = 'Beethoven X | Recovery exit';

    return (
        <>
            <Head>
                <title>{TITLE}</title>
                <meta name="title" content={TITLE} />
                <meta property="og:title" content={TITLE} />
                <meta property="twitter:title" content={TITLE} />
            </Head>
            <PoolListProvider>
                <UserTokenBalancesProvider>
                    <PageMasthead title="Recovery exit" image={null} />
                    <RecoveryExitContent />
                </UserTokenBalancesProvider>
            </PoolListProvider>
        </>
    );
}

export async function getStaticProps() {
    const client = initializeApolloClient();

    return loadApolloState({
        client,
        pageSetup: async () => {
            await client.query<GetPoolsQuery, GetPoolsQueryVariables>({
                query: GetPools,
                variables: DEFAULT_POOL_LIST_QUERY_VARS,
            });

            await client.query({ query: GetPoolFilters });
        },
    });
}

export default LinearPools;
