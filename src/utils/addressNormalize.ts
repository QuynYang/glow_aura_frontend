import type { DivisionItem } from '../services/addressService';

/** Bỏ dấu + chuẩn hóa tên hành chính VN để so khớp Nominatim/Google với API v2. */
export function normalizeDivisionName(str: string = ''): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/^(thanh pho|tinh|phuong|xa|thi tran|quan|huyen)\s+/g, '')
    .trim();
}

export function findBestDivisionMatch<T extends DivisionItem>(
  list: T[],
  candidates: Array<string | undefined | null>
): T | null {
  for (const raw of candidates) {
    if (!raw) continue;
    const target = normalizeDivisionName(raw);
    if (!target) continue;
    const exact = list.find((item) => normalizeDivisionName(item.name) === target);
    if (exact) return exact;
  }

  for (const raw of candidates) {
    if (!raw) continue;
    const target = normalizeDivisionName(raw);
    if (!target) continue;
    const fuzzy = list.find((item) => {
      const name = normalizeDivisionName(item.name);
      return name.includes(target) || target.includes(name);
    });
    if (fuzzy) return fuzzy;
  }

  return null;
}

export function buildFullAddress(parts: {
  street?: string;
  wardName?: string;
  provinceName?: string;
}): string {
  return [parts.street, parts.wardName, parts.provinceName, 'Việt Nam'].filter(Boolean).join(', ');
}
