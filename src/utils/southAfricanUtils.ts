
// South African specific utilities
export const provinces = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape'
];

export const formatZAR = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2
  }).format(amount);
};

export const calculateVAT = (amount: number, includesVAT: boolean = true): { amount: number; vat: number; total: number } => {
  const vatRate = 0.15; // 15% VAT in South Africa
  
  if (includesVAT) {
    const amountExVAT = amount / (1 + vatRate);
    const vat = amount - amountExVAT;
    return {
      amount: amountExVAT,
      vat: vat,
      total: amount
    };
  } else {
    const vat = amount * vatRate;
    return {
      amount: amount,
      vat: vat,
      total: amount + vat
    };
  }
};

export const validateSAPhoneNumber = (phone: string): boolean => {
  // South African phone number validation
  const saPhoneRegex = /^(\+27|0)[1-9][0-9]{8}$/;
  return saPhoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateSAPostalCode = (postalCode: string): boolean => {
  // South African postal code is 4 digits
  const saPostalRegex = /^[0-9]{4}$/;
  return saPostalRegex.test(postalCode);
};
