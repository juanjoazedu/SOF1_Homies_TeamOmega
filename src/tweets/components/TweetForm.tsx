import {
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import { getFileError, isVideoFile, MAX_TWEET_MEDIA } from '../../shared/utils/mediaFiles';
import type { MediaType, TweetDraft, TweetMedia } from '../types/tweet.types';

const MAX_TWEET_LENGTH = 280;

interface FilePreview {
  id: string;
  file: File;
  url: string;
}

interface MediaThumbProps {
  type: MediaType;
  url: string;
  isDisabled: boolean;
  onRemove: () => void;
}

const MediaThumb = ({
  type,
  url,
  isDisabled,
  onRemove,
}: MediaThumbProps) => (
  <div className="tweet-form__thumb">
    {type === 'video' ? <video src={url} muted /> : <img src={url} alt="" />}
    <button
      type="button"
      className="tweet-form__remove-media"
      aria-label="Remove file"
      onClick={onRemove}
      disabled={isDisabled}
    >
      ×
    </button>
  </div>
);

interface TweetFormProps {
  onSubmit: (draft: TweetDraft) => void;
  isSubmitting?: boolean;
  initialText?: string;
  initialMedia?: TweetMedia[];
  submitLabel?: string;
  submittingLabel?: string;
  onCancel?: () => void;
}

export const TweetForm = ({
  onSubmit,
  isSubmitting = false,
  initialText = '',
  initialMedia = [],
  submitLabel = 'Post',
  submittingLabel = 'Posting...',
  onCancel,
}: TweetFormProps) => {
  const textId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrls = useRef<string[]>([]);

  const [text, setText] = useState(initialText);
  const [media, setMedia] = useState(initialMedia);
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [fileError, setFileError] = useState('');

  useEffect(() => () => {
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const mediaCount = media.length + previews.length;
  const trimmedText = text.trim();
  const isTooLong = text.length > MAX_TWEET_LENGTH;
  const isEmpty = trimmedText.length === 0 && mediaCount === 0;
  const hasMediaChanges = previews.length > 0 || media.length !== initialMedia.length;
  const isUnchanged = trimmedText === initialText.trim() && !hasMediaChanges;
  const isDisabled = isEmpty || isTooLong || isUnchanged || isSubmitting;

  const counterClass = isTooLong
    ? 'tweet-form__counter tweet-form__counter--error'
    : 'tweet-form__counter';

  const addFiles = (fileList: FileList | null) => {
    const files = Array.from(fileList ?? []);
    const errors = files.map((file) => getFileError(file)).filter(Boolean);

    if (errors.length > 0) {
      setFileError(errors[0]);
      return;
    }

    if (mediaCount + files.length > MAX_TWEET_MEDIA) {
      setFileError(`You can add up to ${MAX_TWEET_MEDIA} photos or videos.`);
      return;
    }

    const newPreviews = files.map((file) => {
      const url = URL.createObjectURL(file);
      objectUrls.current.push(url);
      return { id: crypto.randomUUID(), file, url };
    });

    setFileError('');
    setPreviews((current) => [...current, ...newPreviews]);
  };

  const removeMedia = (id: string) => {
    setMedia((current) => current.filter((item) => item.id !== id));
  };

  const removePreview = (preview: FilePreview) => {
    URL.revokeObjectURL(preview.url);
    setPreviews((current) => current.filter((item) => item.id !== preview.id));
  };

  return (
    <form
      className="tweet-form"
      onSubmit={(event) => {
        event.preventDefault();
        if (isDisabled) return;
        onSubmit({ text, media, files: previews.map((preview) => preview.file) });
      }}
    >
      <label htmlFor={textId}>What is happening?</label>
      <textarea
        id={textId}
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={4}
        placeholder="What is happening?"
        autoFocus
      />

      {mediaCount > 0 && (
        <div className="tweet-form__media">
          {media.map((item) => (
            <MediaThumb
              key={item.id}
              type={item.type}
              url={item.url}
              isDisabled={isSubmitting}
              onRemove={() => removeMedia(item.id)}
            />
          ))}
          {previews.map((preview) => (
            <MediaThumb
              key={preview.id}
              type={isVideoFile(preview.file) ? 'video' : 'image'}
              url={preview.url}
              isDisabled={isSubmitting}
              onRemove={() => removePreview(preview)}
            />
          ))}
        </div>
      )}

      {fileError && <p className="tweet-form__error" role="alert">{fileError}</p>}

      <div className="tweet-form__footer">
        <input
          ref={fileInputRef}
          className="tweet-form__file-input"
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(event) => {
            const input = event.currentTarget;
            addFiles(input.files);
            input.value = '';
          }}
        />
        <button
          type="button"
          className="tweet-form__media-button"
          aria-label="Add photos or videos"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSubmitting || mediaCount >= MAX_TWEET_MEDIA}
        >
          <span className="tweet-icon tweet-icon--media" aria-hidden="true" />
        </button>

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
