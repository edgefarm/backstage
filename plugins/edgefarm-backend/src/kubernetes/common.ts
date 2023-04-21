export interface MetadataDto {
  name: string;
  namespace?: string;
  uid: string;
  resourceVersion: string;
  creationTimestamp: string;
  labels: {
    [key: string]: string;
  };
  annotations: {
    [key: string]: string;
  };
}
