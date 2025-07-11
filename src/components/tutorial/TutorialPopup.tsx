import React from 'react';

interface TutorialPopupProps {
  position: 'shop' | 'evolution';
  message: string;
  isVisible: boolean;
  onClose?: () => void;
}

export const TutorialPopup: React.FC<TutorialPopupProps> = ({
  position,
  message,
  isVisible,
  onClose
}) => {
  if (!isVisible) return null;

  // Position the popup based on the target area
  const getPopupStyle = () => {
    const baseStyle = {
      position: 'fixed' as const,
      background: 'rgba(64, 64, 64, 0.9)',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: 'normal',
      maxWidth: '280px',
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
      border: '2px solid #3b82f6',
      cursor: onClose ? 'pointer' : 'default',
      transition: 'all 0.3s ease-in-out',
      transform: 'scale(1)',
      fontFamily: 'Arial, sans-serif'
    };

    if (position === 'shop') {
      return {
        ...baseStyle,
        left: '400px', // Position next to shop panel (shop is 370px wide)
        top: '40%',
        transform: 'translateY(-50%)',
        maxWidth: '320px'
      };
    } else if (position === 'evolution') {
      return {
        ...baseStyle,
        right: '400px', // Position next to evolution panel
        top: '45%',
        transform: 'translateY(-50%)'
      };
    }

    return baseStyle;
  };

  return (
    <>
      <div
        style={getPopupStyle()}
        onClick={onClose || undefined}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.01)';
          e.currentTarget.style.background = 'rgba(80, 80, 80, 0.95)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.background = 'rgba(64, 64, 64, 0.9)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ fontSize: '16px', marginTop: '2px' }}>💡</span>
          <div style={{ opacity: 0.8, lineHeight: '1.3', fontSize: '15px', whiteSpace: 'pre-line' }}>
            {message.split('\n').map((line, index) => (
              <div key={index} style={{ marginBottom: index === message.split('\n').length - 2 ? '12px' : '0px' }}>
                {line.split(' ').map((word, wordIndex) => {
                  // Handle punctuation by checking the word without trailing punctuation
                  const cleanWord = word.replace(/[.,!?]$/, '');
                  
                  if (cleanWord === 'Generators') {
                    return (
                      <span key={wordIndex} style={{ fontWeight: 'bold', color: '#4ade80' }}>
                        {word}{' '}
                      </span>
                    );
                  }
                  if (cleanWord === 'Evolution') {
                    return (
                      <span key={wordIndex} style={{ fontWeight: 'bold', color: '#4ade80' }}>
                        {word}{' '}
                      </span>
                    );
                  }
                  if (cleanWord === 'Levels') {
                    return (
                      <span key={wordIndex} style={{ fontWeight: 'bold', color: '#fbbf24' }}>
                        {word}{' '}
                      </span>
                    );
                  }
                  if (cleanWord === 'Upgrades') {
                    return (
                      <span key={wordIndex} style={{ fontWeight: 'bold', color: '#60a5fa' }}>
                        {word}{' '}
                      </span>
                    );
                  }
                  if (cleanWord === 'How' || cleanWord === 'far' || cleanWord === 'can' || cleanWord === 'you' || cleanWord === 'go') {
                    return (
                      <span key={wordIndex} style={{ fontWeight: 'bold', color: '#fbbf24' }}>
                        {word}{' '}
                      </span>
                    );
                  }
                  return word + ' ';
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      

    </>
  );
}; 