import React from 'react';
import { ServerError500 } from '../pages/Errors';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Nexora Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="dark">
          <ServerError500 />
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
