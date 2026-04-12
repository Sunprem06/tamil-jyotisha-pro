import React from 'react';

interface Props {
  children: React.ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
          <div className="text-6xl mb-4">🙏</div>
          <h1 className="text-2xl font-bold font-tamil text-foreground mb-2">
            சேவை தற்காலிகமாக இல்லை
          </h1>
          <p className="text-muted-foreground font-tamil mb-6">
            {this.props.fallbackMessage || 'மீண்டும் முயற்சிக்கவும். சிக்கல் தொடர்ந்தால் பக்கத்தை புதுப்பியுங்கள்.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-tamil hover:opacity-90 transition"
          >
            பக்கம் புதுப்பி
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
