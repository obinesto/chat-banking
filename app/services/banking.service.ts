// This is a placeholder for the partner bank API call.
export const partnerBankApi = {
  createVirtualAccount: async (details: { fullName: string, bvn: string,  nin: string }) => {
    console.log('Calling Providus API placeholder with:', details);
    // I'll simulate a network delay.
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      accountNumber: generateRandomAccountNumber(),
      bankName: 'Providus Bank',
    };
  },
};

/**
 * A simple function to generate a 10-digit account number.
 * In a real-world scenario, this would be provided by the banking partner.
 */
function generateRandomAccountNumber(): string {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}