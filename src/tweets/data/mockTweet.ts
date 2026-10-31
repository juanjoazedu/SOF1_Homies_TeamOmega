import type { Tweet } from '../types/tweet.types';

const ANA = {
  authorUid: 'u1',
  authorFullName: 'Ana Torres',
  authorUsername: 'ana_torres',
  authorPhotoURL: 'https://i.pravatar.cc/150?img=47',
};

const DIEGO = {
  authorUid: 'u2',
  authorFullName: 'Diego Ramirez',
  authorUsername: 'diego_ramirez',
  authorPhotoURL: 'https://i.pravatar.cc/150?img=12',
};

const SOFIA = {
  authorUid: 'u3',
  authorFullName: 'Sofia Martinez',
  authorUsername: 'sofia_martinez',
  authorPhotoURL: 'https://i.pravatar.cc/150?img=5',
};

const SAMPLE_VIDEO_1 = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const SAMPLE_VIDEO_2 = 'https://www.w3schools.com/html/mov_bbb.mp4';

export const mockTweets: Tweet[] = [
  {
    id: 't1',
    ...ANA,
    contentText: 'Hello, world! First tweet on Homies.',
    likesCount: 4,
    retweetsCount: 1,
    createdAt: new Date('2026-10-20T08:15:00'),
  },
  {
    id: 't2',
    ...DIEGO,
    contentText: 'Sunday hike with a view.',
    media: [
      { id: 'm1', type: 'image', url: 'https://picsum.photos/id/1018/800/500' },
    ],
    likesCount: 12,
    retweetsCount: 3,
    createdAt: new Date('2026-10-21T10:30:00'),
  },
  {
    id: 't3',
    ...SOFIA,
    contentText: 'This tweet should NOT appear in Ana\'s feed (she does not follow Sofia).',
    likesCount: 2,
    retweetsCount: 0,
    createdAt: new Date('2026-10-21T18:45:00'),
  },
  {
    id: 't4',
    ...ANA,
    contentText: 'Two photos from the trip.',
    media: [
      { id: 'm2', type: 'image', url: 'https://picsum.photos/id/1015/800/500' },
      { id: 'm3', type: 'image', url: 'https://picsum.photos/id/1016/800/500' },
    ],
    likesCount: 8,
    retweetsCount: 2,
    createdAt: new Date('2026-10-22T12:00:00'),
  },
  {
    id: 't5',
    ...DIEGO,
    contentText: 'Testing a video upload.',
    media: [
      { id: 'm4', type: 'video', url: SAMPLE_VIDEO_1 },
    ],
    likesCount: 5,
    retweetsCount: 1,
    createdAt: new Date('2026-10-23T09:20:00'),
  },
  {
    id: 't6',
    ...ANA,
    contentText: 'Coffee first, code later.',
    likesCount: 1,
    retweetsCount: 0,
    createdAt: new Date('2026-10-24T07:05:00'),
  },
  {
    id: 't7',
    ...DIEGO,
    contentText: 'Image and video in the same tweet.',
    media: [
      { id: 'm5', type: 'image', url: 'https://picsum.photos/id/1025/800/500' },
      { id: 'm6', type: 'video', url: SAMPLE_VIDEO_2 },
    ],
    likesCount: 9,
    retweetsCount: 4,
    createdAt: new Date('2026-10-25T16:40:00'),
  },
  {
    id: 't8',
    ...SOFIA,
    contentText: 'Four photos, like the original X layout.',
    media: [
      { id: 'm7', type: 'image', url: 'https://picsum.photos/id/1035/800/500' },
      { id: 'm8', type: 'image', url: 'https://picsum.photos/id/1036/800/500' },
      { id: 'm9', type: 'image', url: 'https://picsum.photos/id/1039/800/500' },
      { id: 'm10', type: 'image', url: 'https://picsum.photos/id/1043/800/500' },
    ],
    likesCount: 20,
    retweetsCount: 6,
    createdAt: new Date('2026-10-26T11:10:00'),
  },
  {
    id: 't9',
    ...ANA,
    contentText: 'Working on the routing branch today.',
    likesCount: 3,
    retweetsCount: 0,
    createdAt: new Date('2026-10-27T14:25:00'),
  },
  {
    id: 't10',
    ...DIEGO,
    contentText: 'Long text test: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
    likesCount: 0,
    retweetsCount: 0,
    createdAt: new Date('2026-10-28T08:50:00'),
  },
  {
    id: 't11',
    ...ANA,
    contentText: 'Sunset from the balcony.',
    media: [
      { id: 'm11', type: 'image', url: 'https://picsum.photos/id/1044/800/500' },
    ],
    likesCount: 15,
    retweetsCount: 2,
    createdAt: new Date('2026-10-28T18:30:00'),
  },
  {
    id: 't12',
    ...DIEGO,
    contentText: 'Weekend plans?',
    likesCount: 2,
    retweetsCount: 0,
    createdAt: new Date('2026-10-29T13:00:00'),
  },
  {
    id: 't13',
    ...ANA,
    contentText: 'Video from the concert last night.',
    media: [
      { id: 'm12', type: 'video', url: SAMPLE_VIDEO_2 },
    ],
    likesCount: 7,
    retweetsCount: 3,
    createdAt: new Date('2026-10-29T22:15:00'),
  },
  {
    id: 't14',
    ...DIEGO,
    contentText: 'Newest tweet: it should appear first in the feed.',
    likesCount: 0,
    retweetsCount: 0,
    createdAt: new Date('2026-10-30T07:00:00'),
  },
];