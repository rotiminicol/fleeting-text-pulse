
export const generatePhoneNumber = (countryCode: string): string => {
  const countryPrefixes: { [key: string]: { prefix: string; format: () => string } } = {
    US: {
      prefix: '+1',
      format: () => {
        const area = Math.floor(Math.random() * (999 - 200) + 200);
        const exchange = Math.floor(Math.random() * (999 - 200) + 200);
        const number = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        return `+1 (${area}) ${exchange}-${number}`;
      }
    },
    UK: {
      prefix: '+44',
      format: () => {
        const area = Math.floor(Math.random() * (9999 - 1000) + 1000);
        const number = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
        return `+44 ${area} ${number}`;
      }
    },
    CA: {
      prefix: '+1',
      format: () => {
        const area = Math.floor(Math.random() * (999 - 200) + 200);
        const exchange = Math.floor(Math.random() * (999 - 200) + 200);
        const number = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        return `+1 (${area}) ${exchange}-${number}`;
      }
    },
    AU: {
      prefix: '+61',
      format: () => {
        const area = Math.floor(Math.random() * 9) + 1;
        const number = Math.floor(Math.random() * 99999999).toString().padStart(8, '0');
        return `+61 ${area} ${number}`;
      }
    },
    DE: {
      prefix: '+49',
      format: () => {
        const area = Math.floor(Math.random() * (9999 - 100) + 100);
        const number = Math.floor(Math.random() * 9999999).toString().padStart(7, '0');
        return `+49 ${area} ${number}`;
      }
    },
    FR: {
      prefix: '+33',
      format: () => {
        const first = Math.floor(Math.random() * 9) + 1;
        const groups = Array(4).fill(0).map(() => 
          Math.floor(Math.random() * 100).toString().padStart(2, '0')
        );
        return `+33 ${first} ${groups.join(' ')}`;
      }
    },
    JP: {
      prefix: '+81',
      format: () => {
        const area = Math.floor(Math.random() * (999 - 10) + 10);
        const number = Math.floor(Math.random() * 99999999).toString().padStart(8, '0');
        return `+81 ${area} ${number}`;
      }
    },
    IN: {
      prefix: '+91',
      format: () => {
        const first = Math.floor(Math.random() * 4) + 6; // Mobile numbers start with 6-9
        const number = Math.floor(Math.random() * 999999999).toString().padStart(9, '0');
        return `+91 ${first}${number}`;
      }
    }
  };

  const country = countryPrefixes[countryCode];
  if (!country) {
    // Default US format
    const area = Math.floor(Math.random() * (999 - 200) + 200);
    const exchange = Math.floor(Math.random() * (999 - 200) + 200);
    const number = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `+1 (${area}) ${exchange}-${number}`;
  }

  return country.format();
};

export const formatPhoneNumber = (number: string): string => {
  // Remove all non-digits
  const cleaned = number.replace(/\D/g, '');
  
  // Format based on length and patterns
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    // US/Canada format
    const area = cleaned.slice(1, 4);
    const exchange = cleaned.slice(4, 7);
    const num = cleaned.slice(7);
    return `+1 (${area}) ${exchange}-${num}`;
  }
  
  return number; // Return original if no formatting rule matches
};
