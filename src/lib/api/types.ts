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
}

export interface Client {
  clientId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  nric?: string;
  agentId: string;
  verificationStatus?: string;
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

export interface Account {
  accountId: string;
  clientId: string;
  clientName: string;
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


export interface LogEntry {
  id: string;
  agentId: string;
  clientId: string;
  clientName: string;
  crudType: string;
  dateTime: string;
  attributeName?: string;
  beforeValue?: string;
  afterValue?: string;
}

export interface Transaction {
  id: string;
  clientId: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  description?: string;
  clientFirstName: string;
  clientLastName: string;
}

export interface CommunicationsEntry {
  subject: string;
  status: string;
  timestamp: string;
}

export interface AdminLogEntry {
  log_id: string;
  actor: string;
  transaction_type: string;
  action: string;
  timestamp: string;
}