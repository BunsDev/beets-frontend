import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { useGetTokens } from '~/lib/global/useToken';
import numeral from 'numeral';
import { usePoolUserBalances } from '~/modules/pool/lib/usePoolUserBalances';
import { usePool } from '~/modules/pool/lib/usePool';
import { tokenFormatAmount } from '~/lib/services/token/token-util';

interface Props {}

function PoolTokensInWallet({}: Props) {
    const { formattedPrice } = useGetTokens();
    const { userPercentShare } = usePoolUserBalances();
    const { poolTokensWithoutPhantomBpt } = usePool();

    return (
        <Container bg="gray.900" shadow="lg" rounded="lg" padding="4" mb={12} maxW="350">
            <Heading fontSize="md" mb={4}>
                My pool balance
            </Heading>
            {poolTokensWithoutPhantomBpt.map((poolToken, index) => {
                const userBalance = parseFloat(poolToken.balance) * userPercentShare;

                return (
                    <Box key={`token-${index}`}>
                        <Flex mb={2} alignItems="center">
                            <Box>
                                {poolToken.symbol} - {tokenFormatAmount(userBalance)}
                                <br />
                                {formattedPrice({ address: poolToken.address, amount: `${userBalance}` })}
                            </Box>
                        </Flex>
                    </Box>
                );
            })}
        </Container>
    );
}

export default PoolTokensInWallet;
