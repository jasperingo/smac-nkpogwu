
export const generalConstraints = {
  paginationDefault: 1,
  paginationLimit: 5,
} as const;

export const userConstraints = {
  passwordMax: 30,
  passwordMin: 6,
  phoneNumberLength: 11,
  phoneNumberPrefix: '0',
} as const;
