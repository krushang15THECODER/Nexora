import React from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorLayout from '../components/ErrorLayout';

export function NotFound404() {
  const navigate = useNavigate();
  return (
    <ErrorLayout 
      code="404"
      title="RESOURCE NOT FOUND"
      description="The requested route does not exist within the current workspace."
      metadata={{
        STATUS: 'ROUTE_NOT_FOUND',
        SYSTEM: 'NOMINAL',
        REQUEST: 'TERMINATED'
      }}
      secondaryAction={{
        label: 'HOME',
        action: () => navigate('/')
      }}
    />
  );
}

export function Unauthorized401() {
  const navigate = useNavigate();
  return (
    <ErrorLayout 
      code="401"
      title="AUTHENTICATION REQUIRED"
      description="Your current session is no longer valid or authentication is required."
      metadata={{
        STATUS: 'AUTH_REQUIRED',
        SESSION: 'INVALID',
        ACTION: 'REAUTHENTICATE'
      }}
      primaryAction={{
        label: 'SIGN IN',
        action: () => navigate('/login')
      }}
      secondaryAction={{
        label: 'HOME',
        action: () => navigate('/')
      }}
    />
  );
}

export function Forbidden403() {
  return (
    <ErrorLayout 
      code="403"
      title="ACCESS RESTRICTED"
      description="This resource is not available within your current access context."
      metadata={{
        STATUS: 'ACCESS_DENIED',
        SYSTEM: 'NOMINAL',
        REQUEST: 'BLOCKED'
      }}
    />
  );
}

export function RateLimited429() {
  return (
    <ErrorLayout 
      code="429"
      title="REQUEST THROTTLED"
      description="The current request limit has been reached. Please wait before continuing."
      metadata={{
        STATUS: 'RATE_LIMITED',
        SYSTEM: 'NOMINAL',
        ACTION: 'WAIT'
      }}
    />
  );
}

export function ServerError500() {
  return (
    <ErrorLayout 
      code="500"
      title="SYSTEM ERROR"
      description="Nexora encountered an unexpected server-side failure."
      metadata={{
        STATUS: 'INTERNAL_ERROR',
        SYSTEM: 'DEGRADED',
        ACTION: 'RETRY'
      }}
      primaryAction={{
        label: 'TRY AGAIN',
        action: () => window.location.reload()
      }}
    />
  );
}

export function ServiceUnavailable503() {
  const navigate = useNavigate();
  return (
    <ErrorLayout 
      code="503"
      title="SERVICE UNAVAILABLE"
      description="Nexora cannot currently establish a connection with the required service."
      metadata={{
        STATUS: 'SERVICE_UNAVAILABLE',
        SYSTEM: 'OFFLINE',
        ACTION: 'RETRY'
      }}
      primaryAction={{
        label: 'TRY AGAIN',
        action: () => window.location.reload()
      }}
      secondaryAction={{
        label: 'HOME',
        action: () => navigate('/')
      }}
    />
  );
}

export function NetworkError() {
  return (
    <ErrorLayout 
      code="NETWORK"
      title="CONNECTION INTERRUPTED"
      description="Nexora could not reach the required service. Check your connection and try again."
      metadata={{
        STATUS: 'CONNECTION_FAILED',
        NETWORK: 'UNREACHABLE',
        ACTION: 'RETRY'
      }}
      primaryAction={{
        label: 'RETRY',
        action: () => window.location.reload()
      }}
    />
  );
}
