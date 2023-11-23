export const dotToObject = (dotString: string, value: any) => {
  // convert dot notation to object to {xx:{aa:value}}
  const keys = dotString.split('.');
  return keys.reduceRight(
    (acc, key, index) => {
      if (index === keys.length - 1) {
        return { [key]: value };
      } else {
        return { [key]: acc };
      }
    },
    {} as Record<string, any>,
  );
};
