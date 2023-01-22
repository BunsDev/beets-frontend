import { useSwiper, useSwiperSlide } from 'swiper/react';
import { useEffect, useState } from 'react';
import { Badge, Box, Heading, HStack, Image, Skeleton, VStack, Flex, Stack } from '@chakra-ui/react';
import useReliquary from '../lib/useReliquary';
import { AnimatePresence, motion } from 'framer-motion';
import { ReliquaryFarmPosition, reliquaryService } from '~/lib/services/staking/reliquary.service';
import { relicGetMaturityProgress } from '../lib/reliquary-helpers';
import RelicLevelUpButton from './RelicLevelUpButton';
import { useQuery } from 'react-query';
import { getProvider } from '@wagmi/core';
import { useRelicDepositBalance } from '../lib/useRelicDepositBalance';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import RelicSlideApr from './RelicSlideApr';
import RelicSlideInfo from './RelicSlideInfo';
import RelicSlideMainInfo from './RelicSlideMainInfo';

export interface RelicSlideProps {
    relic: ReliquaryFarmPosition;
    openInvestModal: () => void;
    openWithdrawModal: () => void;
}

export default function RelicSlide({ relic, openInvestModal, openWithdrawModal }: RelicSlideProps) {
    const swiper = useSwiper();
    const { isActive } = useSwiperSlide();
    const [showRelicInfo, setShowRelicInfo] = useState(false);

    const {
        maturityThresholds,
        selectedRelic,
        selectedRelicId,
        isLoadingRelicPositions,
        setSelectedRelicId,
        relicPositions,
    } = useReliquary();
    const { canUpgrade } = relicGetMaturityProgress(selectedRelic, maturityThresholds);
    const [_isLoadingRelicPositions, setIsLoadingRelicPositions] = useState(false);

    // hack to get around next.js hydration issues with swiper
    useEffect(() => {
        setIsLoadingRelicPositions(isLoadingRelicPositions);
    }, [isLoadingRelicPositions]);

    const hasNoRelics = relicPositions.length === 0;

    const { data: nftURI = '' } = useQuery(['relicNFT', { selectedRelicId, isLoadingRelicPositions }], async () => {
        if (!_isLoadingRelicPositions && hasNoRelics) {
            return 'https://beethoven-assets.s3.eu-central-1.amazonaws.com/reliquary/9.png';
        }
        if (selectedRelicId) {
            return await reliquaryService.getRelicNFT({ tokenId: selectedRelicId, provider: getProvider() });
        }
    });

<<<<<<< HEAD
=======
    const handleClick = (isNext: boolean) => {
        const relicPositionIndex = relicPositions.findIndex((position) => position.relicId === relic.relicId);

        if (isNext) {
            setSelectedRelicId(relicPositions[relicPositionIndex + 1].relicId);
            swiper.slideNext();
        } else {
            setSelectedRelicId(relicPositions[relicPositionIndex - 1].relicId);
            swiper.slidePrev();
        }
    };

>>>>>>> origin/feature/reliquary
    function getContainerOpacity() {
        if (hasNoRelics) {
            return 0.25;
        }
        if (isActive) {
            return 1;
        } else {
            return 0.35;
        }
    }

    function getUnderglowClass() {
        if (isActive) return '';
        if (isActive) {
            return 'relic-glow';
        }
        return '';
    }

    return (
        <AnimatePresence>
            <VStack
                filter="auto"
                blur={hasNoRelics ? '10px' : '0'}
                as={motion.div}
                animate={{
                    opacity: getContainerOpacity(),
                    transform: isActive ? 'scale(1)' : 'scale(0.5)',
                    transition: { type: 'spring', mass: 0.1 },
                }}
                rounded="lg"
                spacing="8"
                zIndex={isActive ? 1 : -1}
            >
                <Flex justifyContent="center" width={{ base: '100%', lg: '47.5%' }} rounded="lg">
                    <HStack spacing="4" width="full" alignItems="start">
                        <Badge rounded="md" colorScheme="green" p="2">
                            <Heading textAlign="center" size="sm">
                                Level {relic?.level} - Baby Boo
                            </Heading>
                        </Badge>
                        <Badge p="2" rounded="md" colorScheme="purple">
                            <Heading size="sm">Relic #{relic?.relicId}</Heading>
                        </Badge>
                    </HStack>
                </Flex>
                <Flex position="relative" className={getUnderglowClass()} as={motion.div}>
                    {canUpgrade && isActive && (
                        <Flex
                            animate={{ opacity: 1 }}
                            initial={{ opacity: 0 }}
                            exit={{ opacity: 0 }}
                            alignItems="center"
                            justifyContent="center"
                            rounded="lg"
                            width="full"
                            height="full"
                            position="absolute"
                            bg="blackAlpha.500"
                            as={motion.div}
                            zIndex={2}
                        >
                            <RelicLevelUpButton />
                        </Flex>
                    )}

                    <Box
                        filter="auto"
                        blur={isActive && canUpgrade && !_isLoadingRelicPositions ? '10px' : '0px'}
                        style={{ marginTop: '0 !important' }}
                        rounded="lg"
                        overflow="hidden"
                    >
                        {_isLoadingRelicPositions && (
                            <Skeleton>
                                <Image height="400px" width="400px" src={nftURI} />
                            </Skeleton>
                        )}
                        {!_isLoadingRelicPositions && <Image height="400px" width="400px" src={nftURI} />}
                    </Box>
                </Flex>
                <Stack direction={{ base: 'column', lg: 'row' }} position="relative" height="310px" width="full">
                    <RelicSlideMainInfo
                        openInvestModal={openInvestModal}
                        openWithdrawModal={openWithdrawModal}
                        isLoading={_isLoadingRelicPositions}
                    />
                    <RelicSlideApr />
                    <RelicSlideInfo />
                </Stack>
            </VStack>
        </AnimatePresence>
    );
}
