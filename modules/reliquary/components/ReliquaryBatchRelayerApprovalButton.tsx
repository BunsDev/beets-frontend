import { Box } from '@chakra-ui/react';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { useBatchRelayerRelicApprove } from '../lib/useBatchRelayerRelicApprove';

interface Props {
    contractToApprove?: string;
    onConfirmed?: () => void;
    onPending?: () => void;
    onSubmitting?: () => void;
    onCanceled?: () => void;
    isDisabled?: boolean;
    size?: string;
}

export function ReliquaryBatchRelayerApprovalButton({ ...rest }: Props) {
    const { approveAll, approve, ...query } = useBatchRelayerRelicApprove(true);

    return (
        <Box position="relative">
            <BeetsSubmitTransactionButton
                {...query}
                width="full"
                onClick={() => approveAll(true)}
                {...rest}
                borderColor="beets.green"
                _focus={{ boxShadow: 'none' }}
                submittingText="Confirm..."
                pendingText="Waiting..."
            >
                Approve Batch Relayer for all Relics
            </BeetsSubmitTransactionButton>
        </Box>
    );
}
