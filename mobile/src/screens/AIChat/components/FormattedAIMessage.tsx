import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@components/common';
import { colors, spacing } from '@theme';

interface FormattedAIMessageProps {
  text: string;
}

/**
 * Format markdown text into React Native Native Text components
 * Handles headings (###), bullets (*, -), numbers (1.), bold (**text**)
 */
export const FormattedAIMessage: React.FC<FormattedAIMessageProps> = ({ text }) => {
  const lines = text.split('\n');

  // Helper to parse **bold** fragments in a single line
  const renderInlineBold = (lineText: string, isHeading = false) => {
    const parts = lineText.split(/(\*\*[^*]+\*\*)/g);

    return (
      <AppText
        variant={isHeading ? 'h3' : 'body'}
        color="main"
        style={[styles.lineText, isHeading && styles.headingText]}
      >
        {parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const boldContent = part.slice(2, -2);
            return (
              <AppText
                key={index}
                variant={isHeading ? 'h3' : 'bodyBold'}
                color="main"
                style={styles.boldText}
              >
                {boldContent}
              </AppText>
            );
          }
          return part;
        })}
      </AppText>
    );
  };

  return (
    <View style={styles.container}>
      {lines.map((line, index) => {
        const trimmed = line.trim();

        // Empty line -> vertical spacer
        if (!trimmed) {
          return <View key={index} style={styles.emptyLine} />;
        }

        // Heading: ### or ## or #
        if (trimmed.startsWith('#')) {
          const headingContent = trimmed.replace(/^#+\s*/, '');
          return (
            <View key={index} style={styles.headingBlock}>
              {renderInlineBold(headingContent, true)}
            </View>
          );
        }

        // Bullet point: - or *
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletContent = trimmed.slice(2);
          return (
            <View key={index} style={styles.bulletRow}>
              <AppText variant="body" color="primary" style={styles.bulletDot}>
                •
              </AppText>
              <View style={styles.bulletContent}>
                {renderInlineBold(bulletContent)}
              </View>
            </View>
          );
        }

        // Numbered list: 1. 2. etc.
        const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numberMatch) {
          const num = numberMatch[1];
          const content = numberMatch[2];
          return (
            <View key={index} style={styles.bulletRow}>
              <AppText variant="bodyBold" color="primary" style={styles.numberPrefix}>
                {num}.
              </AppText>
              <View style={styles.bulletContent}>
                {renderInlineBold(content)}
              </View>
            </View>
          );
        }

        // Regular paragraph
        return (
          <View key={index} style={styles.paragraphBlock}>
            {renderInlineBold(trimmed)}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  emptyLine: {
    height: 8,
  },
  lineText: {
    lineHeight: 22,
    fontSize: 15,
  },
  headingBlock: {
    marginTop: 10,
    marginBottom: 4,
  },
  headingText: {
    fontWeight: '700',
    color: colors.primary.dark,
    lineHeight: 24,
  },
  paragraphBlock: {
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 14,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 'bold',
  },
  numberPrefix: {
    width: 22,
    fontSize: 14,
    lineHeight: 22,
  },
  bulletContent: {
    flex: 1,
  },
  boldText: {
    fontWeight: '700',
    color: colors.text.main,
  },
});

