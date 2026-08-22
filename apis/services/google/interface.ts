// Google Integration API Interfaces

export interface IGoogleStatusResponse {
  connected: boolean;
  email?: string;
}

export interface IGoogleConnectResponse {
  auth_url: string;
}

export interface IGoogleDisconnectResponse {
  message: string;
}
