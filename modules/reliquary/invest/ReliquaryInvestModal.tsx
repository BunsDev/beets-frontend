import { Modal, ModalCloseButton } from '@chakra-ui/modal';
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    ButtonProps,
    Heading,
    IconButton,
    ModalOverlay,
    useDisclosure,
    Text,
} from '@chakra-ui/react';
import { ChevronLeft } from 'react-feather';
import { ReliquaryInvestPreview } from '~/modules/reliquary/invest/components/ReliquaryInvestPreview';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animate, AnimatePresence, motion, useAnimation } from 'framer-motion';
import { BeetsModalBody, BeetsModalContent, BeetsModalHeader } from '~/components/modal/BeetsModal';
import useReliquary from '~/modules/reliquary/lib/useReliquary';
import { ReliquaryInvestTypeChoice } from './components/ReliquaryInvestTypeChoice';
import { ReliquaryInvestCustom } from './components/ReliquaryInvestCustom';
import { ReliquaryInvestProportional } from './components/ReliquaryInvestProportional';
import { useReliquaryInvestState } from './lib/useReliquaryInvestState';

interface Props {
    createRelic?: boolean;
    activatorLabel?: string;
    activatorProps?: ButtonProps;
    noActivator?: boolean;
    isVisible?: boolean;
    onClose?: () => void;
}

function getInvertedTransform(startBounds: DOMRect, endBounds: DOMRect) {
    return {
        x: startBounds.x - endBounds.x,
        y: startBounds.y - endBounds.y,
        scaleX: startBounds.width / endBounds.width,
        scaleY: startBounds.height / endBounds.height,
    };
}

export function ReliquaryInvestModal({
    createRelic = false,
    activatorLabel,
    activatorProps = {},
    noActivator,
    onClose: _onClose,
    isVisible = false,
}: Props) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalState, setModalState] = useState<'start' | 'proportional' | 'custom' | 'preview'>('start');
    const [type, setInvestType] = useState<'proportional' | 'custom' | null>(null);
    const initialRef = useRef(null);
    const [investComplete, setInvestComplete] = useState(false);
    const { selectedRelic, setCreateRelic } = useReliquary();
    const containerControls = useAnimation();
    const modalContainerRef = useRef<HTMLDivElement | null>(null);
    const lastModalBounds = useRef<DOMRect | null>(null);
    const { clearInvestState } = useReliquaryInvestState();

    function onModalOpen() {
        if (createRelic) {
            setCreateRelic(true);
        } else {
            setCreateRelic(false);
        }
        onOpen();
    }

    function onModalClose() {
        if (investComplete) {
            setInvestType(null);
            setCreateRelic(false);
        }
        setModalState('start');
        clearInvestState();
        onClose();
        _onClose && _onClose();
    }

    useEffect(() => {
        if (isVisible) {
            onModalOpen();
        } else {
            onModalClose();
        }
    }, [isVisible]);

    useLayoutEffect(() => {
        setTimeout(async () => {
            if (isOpen) {
                if (modalContainerRef.current) {
                    containerControls.set({
                        opacity: 0,
                        transform: 'scale(.75)',
                    });
                }
                await containerControls.start({
                    opacity: 1,
                    transform: 'scale(1)',
                });

                const bounds = modalContainerRef.current?.getBoundingClientRect();
                if (bounds) {
                    lastModalBounds.current = bounds;
                }
            } else {
                containerControls.start({
                    opacity: 0,
                    transform: 'scale(0.75)',
                });
            }
        }, 0);
    }, [isOpen]);

    useLayoutEffect(() => {
        if (modalContainerRef.current) {
            const bounds = modalContainerRef.current.getBoundingClientRect();
            if (lastModalBounds.current) {
                const invertedTransform = getInvertedTransform(lastModalBounds.current, bounds);
                animate(invertedTransform.scaleY, 1, {
                    onUpdate: (t) => {
                        if (modalContainerRef.current) {
                            modalContainerRef.current.style.transform = `scaleY(${t})`;
                        }
                    },
                });
            }
            lastModalBounds.current = bounds;
        }
    }, [modalState]);

    return (
        <Box width="full">
            {!noActivator && (
                <Button variant="primary" onClick={onModalOpen} width="full" {...activatorProps}>
                    Get maBEETS
                </Button>
            )}
            <Modal motionPreset="none" isOpen={isOpen} onClose={onModalClose} size="lg" initialFocusRef={initialRef}>
                <ModalOverlay bg="blackAlpha.900" />
                <AnimatePresence exitBeforeEnter>
                    <BeetsModalContent position="relative" isTransparent={true}>
                        <Box
                            as={motion.div}
                            width="full"
                            height="full"
                            position="absolute"
                            top="0"
                            left="0"
                            right="0"
                            zIndex={-1}
                            animate={containerControls}
                            ref={modalContainerRef}
                            rounded="md"
                            transformOrigin="top"
                            background="gray.700"
                        >
                            <Box transformOrigin="top" width="full" height="full" background="blackAlpha.400">
                                <Box width="full" height="full" className="bg" />
                            </Box>
                        </Box>
                        <ModalCloseButton />
                        {modalState !== 'start' ? (
                            <IconButton
                                aria-label={'back-button'}
                                icon={<ChevronLeft />}
                                variant="ghost"
                                p="0"
                                width="32px"
                                height="32px"
                                minWidth="32px"
                                position="absolute"
                                top="12px"
                                left="12px"
                                onClick={() => {
                                    if (modalState === 'proportional' || modalState === 'custom') {
                                        setModalState('start');
                                    } else if (modalState === 'preview') {
                                        if (type === 'proportional') {
                                            setModalState('proportional');
                                        } else if (type === 'custom') {
                                            setModalState('custom');
                                        }
                                    }
                                }}
                            />
                        ) : null}
                        <BeetsModalHeader>
                            {modalState === 'start' ? (
                                <>
                                    <Heading size="md" noOfLines={1}>
                                        Get {createRelic ? ' ' : 'more '}maBEETS
                                    </Heading>
                                    <Text fontSize="1rem" fontWeight="normal">
                                        Placeholder for a short (2 lines?) explainer. Can be different for create new
                                        relic and deposit into existing relic
                                    </Text>
                                </>
                            ) : null}
                            {modalState === 'proportional' ? (
                                <Heading size="md" marginLeft="8" textAlign="left">
                                    Proportional investment
                                </Heading>
                            ) : null}
                        </BeetsModalHeader>
                        <BeetsModalBody p="0">
                            {modalState === 'start' ? (
                                <motion.div
                                    style={{ minHeight: '200px' }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, transition: { delay: 0.25 } }}
                                    exit={{ opacity: 0 }}
                                >
                                    {!createRelic && selectedRelic && (
                                        <Box px="4">
                                            <Alert status="warning" mb="4">
                                                <AlertIcon />
                                                Investing more funds into your relic will affect your level up progress.
                                            </Alert>
                                        </Box>
                                    )}
                                    <ReliquaryInvestTypeChoice
                                        onShowProportional={() => {
                                            setInvestType('proportional');
                                            setModalState('proportional');
                                            clearInvestState();
                                        }}
                                        onShowCustom={() => {
                                            setInvestType('custom');
                                            setModalState('custom');
                                            clearInvestState();
                                        }}
                                    />
                                </motion.div>
                            ) : null}

                            {modalState === 'proportional' ? (
                                <motion.div
                                    style={{ minHeight: '620px' }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, transition: { delay: 0.25 } }}
                                    exit={{ opacity: 0 }}
                                >
                                    <ReliquaryInvestProportional
                                        onShowPreview={() => {
                                            setInvestType('proportional');
                                            setModalState('preview');
                                        }}
                                    />
                                </motion.div>
                            ) : null}
                            {modalState === 'custom' ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, transition: { delay: 0.25 } }}
                                    exit={{ opacity: 0 }}
                                >
                                    <ReliquaryInvestCustom
                                        onShowPreview={() => {
                                            setInvestType('custom');
                                            setModalState('preview');
                                        }}
                                    />
                                </motion.div>
                            ) : null}
                            {modalState === 'preview' ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <ReliquaryInvestPreview
                                        onInvestComplete={() => {
                                            setInvestComplete(true);
                                        }}
                                        onClose={onModalClose}
                                    />
                                </motion.div>
                            ) : null}
                        </BeetsModalBody>
                    </BeetsModalContent>
                </AnimatePresence>
            </Modal>
        </Box>
    );
}
