// Client Types
export interface ClientDTO {
  clientId?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  emailAddress: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  nric: string;
  agentId?: string;
  accounts?: AccountDTO[];
}

// Account Types
export interface AccountDTO {
  accountId?: string;
  clientId: string;
  accountType: string;
  accountStatus: string;
  openingDate: string;
  initialDeposit: number;
  currency: string;
  branchId: string;
}

// Possible account types
export enum AccountType {
  SAVINGS = 'SAVINGS',
  CHECKING = 'CHECKING',
  BUSINESS = 'BUSINESS',
}

// Possible account statuses
export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CLOSED = 'CLOSED',
  PENDING = 'PENDING',
}

// Possible gender types
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

// For agent-management page
export interface Agent {
  id: string
  firstName: string
  lastName: string
  email: string
  status: "active" | "disabled"
}

export interface Client {
  id: string
  name: string
  email: string
  status: "active" | "inactive"
}

export interface LogEntry {
  timestamp: string
  action: string
  details: string
}
