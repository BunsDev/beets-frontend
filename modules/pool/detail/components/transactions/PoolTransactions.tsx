import { usePool } from '~/modules/pool/lib/usePool';
import { Box, Button, HStack, Menu, MenuButton, MenuItem, MenuList, TabList, Tabs, VStack } from '@chakra-ui/react';
import { BoxProps } from '@chakra-ui/layout';
import BeetsTab from '~/components/tabs/BeetsTab';
import { useState } from 'react';
import { PoolDetailAboutThisPool } from '~/modules/pool/detail/components/PoolDetailAboutThisPool';
import { PoolSwapsTable } from '~/modules/pool/detail/components/transactions/PoolSwapsTable';
import { PoolJoinExitsTable } from '~/modules/pool/detail/components/transactions/PoolJoinExitsTable';
import { PoolUserInvestmentsTable } from '~/modules/pool/detail/components/transactions/PoolUserInvestmentsTable';
import { PoolUserSwapsTable } from '~/modules/pool/detail/components/transactions/PoolUserTransactionsTable';
import { ChevronDown } from 'react-feather';

type Props = {};

export function PoolTransactions({ ...rest }: Props & BoxProps) {
    const [activeTab, setActiveTab] = useState(0);
    const { pool } = usePool();
    const isPhantomStable = pool.__typename === 'GqlPoolPhantomStable';
    const tabs = [
        'About this pool',
        isPhantomStable ? 'Transactions' : 'Investments',
        ...(!isPhantomStable ? ['Swaps'] : []),
        `My ${isPhantomStable ? 'transactions' : 'investments'}`,
    ];

    return (
        <Box width="full" {...rest}>
            <Tabs variant="soft-rounded" onChange={setActiveTab}>
                <VStack width="full" alignItems="flex-start">
                    <Box width="full" display={{ base: 'block', md: 'none' }} mb="2">
                        <Menu matchWidth={true}>
                            <MenuButton as={Button} rightIcon={<ChevronDown />} width="full">
                                {tabs[activeTab]}
                            </MenuButton>
                            <MenuList>
                                {tabs.map((tab, index) => (
                                    <MenuItem onClick={() => setActiveTab(index)} key={index}>
                                        {tab}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    </Box>
                    <TabList mb="2" display={{ base: 'none', md: 'block' }}>
                        <HStack>
                            {tabs.map((tab, index) => (
                                <BeetsTab key={index}>{tab}</BeetsTab>
                            ))}
                        </HStack>
                    </TabList>

                    {activeTab === 0 && <PoolDetailAboutThisPool />}
                    {activeTab === 1 && (isPhantomStable ? <PoolSwapsTable /> : <PoolJoinExitsTable />)}
                    {activeTab === 2 && (isPhantomStable ? <PoolUserSwapsTable /> : <PoolSwapsTable />)}
                    {activeTab === 3 && <PoolUserInvestmentsTable />}
                </VStack>
            </Tabs>
        </Box>
    );
}
