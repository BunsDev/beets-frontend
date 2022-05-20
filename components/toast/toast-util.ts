export type ToastTransactionType = 'SWAP' | 'JOIN' | 'EXIT';
export type ToastTransactionStatus = 'PENDING' | 'CONFIRMED' | 'ERROR';

export function toastGetTransactionStatusHeadline(type: ToastTransactionType, status: ToastTransactionStatus) {
    if (type === 'JOIN') {
        switch (status) {
            case 'PENDING':
                //return i18next.t('Toast - Headline - Invest pending', 'Invest pending');
                return 'Invest pending';
            case 'CONFIRMED':
                //return i18next.t('Toast - Headline - Invest confirmed', 'Invest confirmed');
                return 'Invest confirmed';
            case 'ERROR':
                //return i18next.t('Toast - Headline - Invest error', 'Invest error');
                return 'Invest error';
        }
    } else if (type === 'EXIT') {
        switch (status) {
            case 'PENDING':
                //return i18next.t('Toast - Headline - Withdraw pending', 'Withdraw pending');
                return 'Withdraw pending';
            case 'CONFIRMED':
                //return i18next.t('Toast - Headline - Withdraw confirmed', 'Withdraw confirmed');
                return 'Withdraw confirmed';
            case 'ERROR':
                //return i18next.t('Toast - Headline - Withdraw error', 'Withdraw error');
                return 'Withdraw error';
        }
    } else if (type === 'SWAP') {
        switch (status) {
            case 'PENDING':
                //return i18next.t('Toast - Headline - Trade pending', 'Trade pending');
                return 'Trade pending';
            case 'CONFIRMED':
                //return i18next.t('Toast - Headline - Trade confirmed', 'Trade confirmed');
                return 'Trade confirmed';
            case 'ERROR':
                //return i18next.t('Toast - Headline - Trade error', 'Trade error');
                return 'Trade error';
        }
    }

    return 'Missing headline';
}
