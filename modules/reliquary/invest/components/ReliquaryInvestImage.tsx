import { Box } from '@chakra-ui/react';
import React from 'react';
import Image from 'next/image';
import { useCurrentStep } from '../../lib/useReliquaryCurrentStep';
import styles from '~/styles/Reliquary.module.css';
import Background from '~/assets/images/reliquary/background.png';
import ReliquaryInvest from '~/assets/images/reliquary/complete.png';
import ApproveVault from '~/assets/images/reliquary/approve-vault.png';
import ApproveRelayer from '~/assets/images/reliquary/approve-relayer.png';
import ApproveRelic from '~/assets/images/reliquary/approve-relic.png';
import MigrateLegacy from '~/assets/images/reliquary/migrate-legacy.png';
import ApproveBeets from '~/assets/images/reliquary/approve-beets.png';
import ApproveWftm from '~/assets/images/reliquary/approve-wftm.png';
import { AnimatePresence, motion } from 'framer-motion';

export function ReliquaryInvestImage() {
    const { currentStep } = useCurrentStep();

    function getCurrentStepImage(currentStep: string | null) {
        switch (currentStep) {
            case 'wFTM':
                return ApproveWftm;
            case 'BEETS':
                return ApproveBeets;
            case 'unstake':
                return MigrateLegacy;
            case 'batch-relayer-reliquary':
                return ApproveRelayer;
            case 'batch-relayer':
                return ApproveRelic;
            case 'approve-vault':
                return ApproveVault;
            case 'reliquary-migrate':
            case 'reliquary-invest':
            default:
                return ReliquaryInvest;
        }
    }

    return (
        <>
            <Box mt="4">
                <div className={styles.container}>
                    <div className={styles.overlapGrid}>
                        <Image src={Background} alt="background" />
                        <AnimatePresence initial={false}>
                            <motion.div
                                key={currentStep}
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -300, opacity: 0 }}
                                transition={{
                                    x: { type: 'spring', stiffness: 90, damping: 15 },
                                    opacity: { duration: 0.25 },
                                }}
                            >
                                {currentStep && <Image src={getCurrentStepImage(currentStep)} alt="reliquary" />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </Box>
        </>
    );
}
