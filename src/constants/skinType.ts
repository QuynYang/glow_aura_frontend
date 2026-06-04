/** Khớp CosmeticStore.Core.Enums.SkinType */
export const SkinType = {
  All: 0,
  Oily: 1,
  Dry: 2,
  Combination: 3,
  Sensitive: 4,
  Normal: 5,
} as const;

export type SkinType = (typeof SkinType)[keyof typeof SkinType];

export const SKIN_TYPE_LABELS: Record<SkinType, string> = {
  [SkinType.All]: 'Mọi loại da',
  [SkinType.Oily]: 'Da dầu',
  [SkinType.Dry]: 'Da khô',
  [SkinType.Combination]: 'Da hỗn hợp',
  [SkinType.Sensitive]: 'Da nhạy cảm',
  [SkinType.Normal]: 'Da thường',
};

export const SKIN_TYPE_OPTIONS = (Object.entries(SKIN_TYPE_LABELS) as [string, string][])
  .map(([value, label]) => ({
    value: Number(value) as SkinType,
    label,
  }))
  .sort((a, b) => a.value - b.value);

/** Dùng cho bộ lọc — không hiển thị All vì sản phẩm All đã phù hợp mọi loại da */
export const SKIN_TYPE_FILTER_OPTIONS = SKIN_TYPE_OPTIONS.filter((opt) => opt.value !== SkinType.All);

export function isSkinType(value: number): value is SkinType {
  return value >= SkinType.All && value <= SkinType.Normal;
}

export function normalizeSkinType(value: number | string | null | undefined): SkinType {
  if (value === null || value === undefined || value === '') return SkinType.All;

  if (typeof value === 'number' && isSkinType(value)) return value;

  const lower = String(value).toLowerCase();
  const aliasMap: Record<string, SkinType> = {
    all: SkinType.All,
    oily: SkinType.Oily,
    dry: SkinType.Dry,
    combination: SkinType.Combination,
    combo: SkinType.Combination,
    sensitive: SkinType.Sensitive,
    normal: SkinType.Normal,
  };
  if (lower in aliasMap) return aliasMap[lower];

  const parsed = Number(value);
  if (!Number.isNaN(parsed) && isSkinType(parsed)) return parsed;

  return SkinType.All;
}

export function getSkinTypeLabel(value: number | string | null | undefined): string {
  return SKIN_TYPE_LABELS[normalizeSkinType(value)];
}
