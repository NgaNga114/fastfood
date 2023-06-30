import {
  Precondition,
  SetOptions,
  WhereFilterOp, // ex: <. <=, == ...
  OrderByDirection, // ex: 'desc' | 'asc'
  DocumentData
} from "@google-cloud/firestore";

// enum

export enum IsTypeQuery {
  document = "document",
  collection = "collection"
}

// interface

export interface GetMethodParams {
  path: string;
  type: "document" | "collection";
  structuredQuery?: QueryStructure;
}

export interface AddMethodParams {
  path: string;
  data: DocumentData;
}

export interface SetMethodParams {
  path: string;
  data: DocumentData;
  options?: SetOptions;
}

export interface UpdateMethodParams {
  path: string;
  data: DocumentData;
}

export interface PutMethodStorageParams {
  path: string;
  data: Blob | Uint8Array | ArrayBuffer;
}

export interface QueryStructure {
  where?: { fieldPath: string; opStr: WhereFilterOp; value: any }[];
  orderBy?: { fieldPath: string; directionStr?: OrderByDirection }[];
  limit?: { value: number | string };
  offset?: { value: number };
  startAfter?: { value: any };
  endAt?: { value: any };
  endBefore?: { value: any };
}
