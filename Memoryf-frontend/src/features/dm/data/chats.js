export const chatRoomsSeed = [
  {
    id: 1,
    userId: 'jenny.kim',
    userName: 'Jenny Kim',
    lastMessage: '다음주에 들어주세요 관람해요!',
    time: '오후 4:33',
    unread: 2,
    avatar: '👤',
    messages: [
      { id: 1, text: '안녕하세요!', time: '오후 4:30', isMine: false },
      { id: 2, text: '네 안녕하세요', time: '오후 4:31', isMine: true },
      { id: 3, text: '다음주에 들어주세요 관람해요!', time: '오후 4:33', isMine: false },
    ],
  },
  {
    id: 2,
    userId: 'cool.boy.99',
    userName: '@cool_boy.99',
    lastMessage: '진짜 축하해🎉',
    time: '어제',
    unread: 0,
    avatar: '👤',
    messages: [
      { id: 1, text: '들었어!', time: '어제 3:20', isMine: false },
      { id: 2, text: '진짜 축하해🎉', time: '어제 3:21', isMine: false },
    ],
  },
  {
    id: 3,
    userId: 'minji.luv',
    userName: 'minji_luv',
    lastMessage: '커피는 다음주에 가자~',
    time: '1월 10',
    unread: 1,
    avatar: '👤',
    messages: [
      { id: 1, text: '이번주 어때?', time: '1월 10 오후 2:00', isMine: false },
      { id: 2, text: '미안 바빠ㅠㅠ', time: '1월 10 오후 2:15', isMine: true },
      { id: 3, text: '커피는 다음주에 가자~', time: '1월 10 오후 2:20', isMine: false },
    ],
  },
  {
    id: 4,
    userId: 'travel.ha',
    userName: 'travel.ha',
    lastMessage: '이번엔이 사진 너무 예뻐요.',
    time: '3월 15',
    unread: 0,
    avatar: '👤',
    messages: [
      { id: 1, text: '이번엔이 사진 너무 예뻐요.', time: '3월 15 오전 10:30', isMine: false },
    ],
  },
];

export const pendingChatsSeed = [
  {
    id: 'pending-1',
    userId: 'sunny.day',
    userName: 'sunny.day',
    lastMessage: '대화 없음',
    time: '대기',
    unread: 0,
    avatar: '👤',
    messages: [],
    isPending: true,
  },
  {
    id: 'pending-2',
    userId: 'new.friend.01',
    userName: 'new_friend.01',
    lastMessage: '대기 중',
    time: '대기',
    unread: 0,
    avatar: '👤',
    messages: [],
    isPending: true,
  },
];

