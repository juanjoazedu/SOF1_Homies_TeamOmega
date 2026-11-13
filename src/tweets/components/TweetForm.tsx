import { useId, useState } from 'react';

const MAX_TWEET_LENGTH = 280;

interface TweetFormProps {
  onSubmit: (text: string) => void;
  isSubmitting?: boolean;
  initialText?: string;
  submitLabel?: string;
  submittingLabel?: string;
  onCancel?: () => void;
}

export const TweetForm = ({
  onSubmit,
  isSubmitting = false,
  initialText = '',
  submitLabel = 'Post',
  submittingLabel = 'Posting...',
  onCancel,
}: TweetFormProps) => {
  const textId = useId();
  const [text, setText] = useState(initialText);

  const trimmedText = text.trim();
  const isTooLong = text.length > MAX_TWEET_LENGTH;
  const isUnchanged = trimmedText === initialText.trim();
  const isDisabled = trimmedText.length === 0 || isTooLong || isUnchanged || isSubmitting;

  const counterClass = isTooLong
    ? 'tweet-form__counter tweet-form__counter--error'
    : 'tweet-form__counter';

  return (
    <form
      className="tweet-form"
      onSubmit={(event) => {
        event.preventDefault();
        if (isDisabled) return;
        onSubmit(text);
      }}
    >
      <label htmlFor={textId}>What is happening?</label>
      <textarea
        id={textId}
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={4}
        placeholder="What is happening?"
      />

      <div className="tweet-form__footer">
        <span className={counterClass}>
          {text.length}/{MAX_TWEET_LENGTH}
        </span>

        {onCancel && (
          <button
            type="button"
            className="tweet-form__cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}

        <button type="submit" disabled={isDisabled}>
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
};