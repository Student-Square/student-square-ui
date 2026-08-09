export type FinanceCurrency = "BDT" | "USD" | "GBP";

export type FinanceEntry = {
  id: string;
  slNo: number;
  entryDate: string;
  itemName: string;
  quantity: number;
  unitCost: number;
  currency: FinanceCurrency | string;
  moneyIn: number;
  moneyOut: number;
  balance: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    memberId: string | null;
    email: string;
  };
};

export type FinanceEntryInput = {
  entryDate: string;
  itemName: string;
  quantity: number;
  unitCost: number;
  currency: FinanceCurrency;
  moneyIn: number;
  moneyOut: number;
};

export type PaginatedFinance = {
  data: FinanceEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
