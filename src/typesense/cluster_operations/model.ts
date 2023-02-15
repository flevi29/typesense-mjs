type OperationName = "vote" | "snapshot" | "cache/clear" | string;
type SuccessResponse = { success: boolean };
type SnapshotQuery = { snapshot_path: string };

type OperationSchema<ON extends OperationName> = ON extends "vote" | "snapshot"
  ? SuccessResponse
  : unknown;
type QueryRecord<TOpName extends OperationName> = TOpName extends "vote"
  ? undefined
  : TOpName extends "snapshot" ? SnapshotQuery
  : Record<string, string | number | boolean> | undefined;

type StatsResponse = {
  "latency_ms": Record<string, number>;
  "requests_per_second": Record<string, number>;
};

type MetricsResponse = {
  system_cpu1_active_percentage: string;
  system_cpu2_active_percentage: string;
  system_cpu3_active_percentage: string;
  system_cpu4_active_percentage: string;
  system_cpu_active_percentage: string;
  system_disk_total_bytes: string;
  system_disk_used_bytes: string;
  system_memory_total_bytes: string;
  system_memory_used_bytes: string;
  system_network_received_bytes: string;
  system_network_sent_bytes: string;
  typesense_memory_active_bytes: string;
  typesense_memory_allocated_bytes: string;
  typesense_memory_fragmentation_ratio: string;
  typesense_memory_mapped_bytes: string;
  typesense_memory_metadata_bytes: string;
  typesense_memory_resident_bytes: string;
  typesense_memory_retained_bytes: string;
};

type DebugResponseSchema = {
  state: number;
  version: string;
};

type ConfigOptions = { "log-slow-requests-time-ms": number };

export type {
  ConfigOptions,
  DebugResponseSchema,
  MetricsResponse,
  OperationName,
  OperationSchema,
  QueryRecord,
  StatsResponse,
  SuccessResponse,
};
