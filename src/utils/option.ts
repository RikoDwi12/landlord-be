export type Option<V> = { label: string; value: V };

export const constToOption = <V extends string>(
  consts: Record<V, string>,
): Option<V>[] => {
  return Object.entries(consts).map(([value, label]) => ({
    value: value as V,
    label: label as string,
  }));
};
