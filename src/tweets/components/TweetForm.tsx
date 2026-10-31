import { useState } from 'react';

const MAX_TWEET_LENGTH = 280;

interface TweetFormProps {
  onSubmit: (text: string) => void;
}

export const TweetForm = ({ onSubmit }: TweetFormProps) => {
  const [text, setText] = useState('');

  const trimmedLength = text.trim().length;
  const isTooLong = text.length > MAX_TWEET_LENGTH;
  const isDisabled = trimmedLength === 0 || isTooLong;

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
      <label htmlFor="tweet-text">What is happening?</label>
      <textarea
        id="tweet-text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={4}
        placeholder="What is happening?"
      />

      <div className="tweet-form__footer">
        <span className={counterClass}>
          {text.length}/{MAX_TWEET_LENGTH}
        </span>

        <button type="submit" disabled={isDisabled}>
          Publicar
        </button>
      </div>
    </form>
  );
};