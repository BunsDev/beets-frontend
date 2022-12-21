import Card from '~/components/card/Card';
import { Button, Flex, Heading, HStack, Skeleton, Text, Tooltip, VStack } from '@chakra-ui/react';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { TokenAmountPill } from '~/components/token/TokenAmountPill';
import React, { useState } from 'react';
import { useAnimation } from 'framer-motion';
import useReliquary from '~/modules/reliquary/lib/useReliquary';
import { useReliquaryLevelUp } from '~/modules/reliquary/lib/useReliquaryLevelUp';
import { usePoolUserDepositBalance } from '~/modules/pool/lib/usePoolUserDepositBalance';
import { usePool } from '~/modules/pool/lib/usePool';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { Box, Divider } from '@chakra-ui/layout';
import { PoolUserStakedStats } from '~/modules/pool/detail/components/stats/PoolUserStakedStats';
import { InfoButton } from '~/components/info-button/InfoButton';
import TokenAvatar from '~/components/token/TokenAvatar';
import { networkConfig } from '~/lib/config/network-config';
import { useRelicDepositBalance } from '~/modules/reliquary/lib/useRelicDepositBalance';

export function RelicStats() {
    const { data, relicBalanceUSD } = useRelicDepositBalance();
    const { pool } = usePool();
    const { reliquaryService, maturityThresholds, relicPositions = [], isLoading } = useReliquary();
    const config = useNetworkConfig();

    //TODO: fix this
    const relic = relicPositions && relicPositions[0];

    return (
        <>
            <Card p="4" width="full">
                <VStack width="full" spacing="8" justifyContent="flex-start">
                    <VStack width="full" spacing="0" alignItems="flex-start">
                        <Heading lineHeight="1rem" fontWeight="semibold" size="" color="beets.base.50">
                            Relic APR
                        </Heading>
                        <HStack>
                            <div className="apr-stripes">{numeral(pool.dynamicData.apr.total).format('0.00%')}</div>
                            <AprTooltip onlySparkles data={pool.dynamicData.apr} />
                        </HStack>
                        <Text color="orange">1.8x maturity boost</Text>
                    </VStack>
                    <HStack width="full" spacing="12" alignItems="flex-start">
                        <VStack spacing="0" alignItems="flex-start">
                            <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                                Pending Rewards
                            </Text>
                            <Text color="white" fontSize="1.75rem">
                                {numberFormatUSDValue(999.99)}
                            </Text>
                        </VStack>
                    </HStack>
                </VStack>
                <Button mt="4" width="full" variant="primary">
                    Claim now
                </Button>
            </Card>
            <Card p="4" width="full">
                <VStack spacing="8">
                    <HStack width="full" spacing="12" alignItems="flex-start">
                        <VStack spacing="0" alignItems="flex-start">
                            <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                                My Liquidity
                            </Text>
                            <Text color="white" fontSize="1.75rem">
                                {numberFormatUSDValue(relicBalanceUSD)}
                            </Text>
                        </VStack>
                    </HStack>

                    <VStack width="full" spacing="3" alignItems="flex-start">
                        <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                            Token breakdown
                        </Text>
                        <HStack>
                            <TokenAmountPill
                                key={`relic-token-${config.fbeets.address}`}
                                address={config.fbeets.address}
                                amount={relic.amount}
                            />
                            <Text fontWeight="bold">OR</Text>
                            {data &&
                                data.map((token) => (
                                    <TokenAmountPill
                                        key={`relic-token-${token.address}`}
                                        address={token.address}
                                        amount={token.amount}
                                    />
                                ))}
                        </HStack>
                    </VStack>
                </VStack>
            </Card>
            <Card p="4" width="full">
                <VStack spacing="8">
                    <HStack width="full" spacing="12" alignItems="flex-start">
                        <VStack spacing="0" alignItems="flex-start">
                            <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                                Achievements
                            </Text>
                        </VStack>
                    </HStack>
                </VStack>
            </Card>
            <Card p="4" width="full">
                <VStack spacing="8">
                    <HStack width="full" spacing="12" alignItems="flex-start">
                        <VStack spacing="0" alignItems="flex-start">
                            <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                                Maturity
                            </Text>
                        </VStack>
                    </HStack>
                </VStack>
            </Card>
            <Flex width="full" alignItems="flex-start" flex={1} flexDirection="column">
                <VStack spacing="0" alignItems="flex-start" mb="4" px="2">
                    <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                        My APR
                    </Text>
                    <HStack>
                        <div className="apr-stripes">{numeral(pool.dynamicData.apr.total).format('0.00%')}</div>
                        <AprTooltip onlySparkles data={pool.dynamicData.apr} />
                    </HStack>
                </VStack>

                <Box px="2" width="full">
                    <Divider mb="4" />
                </Box>
                <VStack spacing="0" alignItems="flex-start" mb="4" px="2">
                    <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                        My liquidity
                    </Text>
                    {isLoading ? (
                        <Box>
                            <Skeleton height="34px" width="140px" mt="4px" mb="4px" />
                        </Box>
                    ) : (
                        <Text color="white" fontSize="1.75rem">
                            {numberFormatUSDValue(relicBalanceUSD)}
                        </Text>
                    )}
                </VStack>
                <VStack spacing="0" alignItems="flex-start" mb="5" px="2">
                    <InfoButton
                        labelProps={{
                            lineHeight: '1rem',
                            fontWeight: 'semibold',
                            fontSize: 'sm',
                            color: 'beets.base.50',
                        }}
                        label="My share"
                        infoText={`The size of your relic relative to all value stored in relics. Your staked share represents the percent of liquidity incentives you are entitled to.`}
                    />
                    <VStack spacing="none" alignItems="flex-start">
                        {/*isLoading ? (
                            <Skeleton height="34px" width="140px" mt="4px" mb="4px" />
                        ) : (
                            <Text color="white" fontSize="1.75rem">
                                {userShare < 0.0001 ? '< 0.01%' : numeral(userShare).format('0.00%')}
                            </Text>
                        )*/}
                        {isLoading ? (
                            <Skeleton height="16px" width="45px" />
                        ) : (
                            <Text fontSize="1rem" lineHeight="1rem">
                                {numeral(relic.amount).format('0.00a')}
                                {' / '}
                                {numeral(data).format('0.00a')}{' '}
                                <Text as="span" fontSize="md" color="beets.base.50">
                                    fBEETS
                                </Text>
                            </Text>
                        )}
                    </VStack>
                </VStack>
                <VStack spacing="0" alignItems="flex-start" mb="8" px="2" flex="1">
                    <InfoButton
                        labelProps={{
                            lineHeight: '1rem',
                            fontWeight: 'semibold',
                            fontSize: 'sm',
                            color: 'beets.base.50',
                        }}
                        label="My potential daily yield"
                        infoText="The potential daily value is an approximation based on swap fees, current token prices and your staked share. A number of external factors can influence this value from second to second."
                    />
                    {/*isLoading ? (
                        <Skeleton height="34px" width="140px" mt="4px" mb="4px" />
                    ) : (
                        <Text color="white" fontSize="1.75rem">
                            {numberFormatUSDValue(dailyYieldUSD)}
                        </Text>
                    )}
                    <Box>
                        {beetsPerDay > 0 && (
                            <HStack spacing="1" mb="0.5">
                                <TokenAvatar height="20px" width="20px" address={networkConfig.beets.address} />
                                <Tooltip
                                    label={`BEETS emissions are calculated per block, so daily emissions are an estimate based on an average block time over last 5,000 blocks. Avg block time: ${blocksData?.avgBlockTime}s.`}
                                >
                                    <Text fontSize="1rem" lineHeight="1rem">
                                        {numeral(beetsPerDay).format('0,0')} / day
                                    </Text>
                                </Tooltip>
                            </HStack>
                        )}
                        {staking.farm?.rewarders?.map((rewarder) => (
                            <HStack spacing="1" mb="0.5" key={rewarder.id}>
                                <TokenAvatar height="20px" width="20px" address={rewarder.tokenAddress} />
                                <Text fontSize="1rem" lineHeight="1rem">
                                    {numeral(parseFloat(rewarder.rewardPerSecond) * 86400 * userShare).format('0,0')} /
                                    day
                                </Text>
                            </HStack>
                        ))}
                    </Box>*/}
                </VStack>
                {/*pool.staking && (
                    <PoolUserStakedStats
                        poolAddress={pool.address}
                        staking={pool.staking}
                        totalApr={totalApr}
                        userPoolBalanceUSD={userPoolBalanceUSD}
                    />
                )*/}
                {/*<PoolDetailPossibleYieldText />*/}
            </Flex>
        </>
    );
}
