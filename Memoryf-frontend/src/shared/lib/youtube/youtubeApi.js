import axios from 'axios';

// YouTube Data API v3 키 (실제 사용 시 환경변수로 관리 필요)
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_URL = import.meta.env.VITE_YOUTUBE_SEARCH_URL;

if (!YOUTUBE_API_KEY || !YOUTUBE_SEARCH_URL) {
  console.error("YouTube API Key or Search URL is missing in .env");
}

/**
 * YouTube에서 곡 검색 (광고없음 키워드 포함)
 * @param {string} artist - 가수명
 * @param {string} title - 곡 제목
 * @returns {Promise} - 검색 결과 (첫 번째 videoId)
 */
export const searchYouTubeMusic = async (artist, title) => {
  // 환경변수 누락 시 바로 실패 반환해 불필요한 요청 방지
  if (!YOUTUBE_API_KEY || !YOUTUBE_SEARCH_URL) {
    return {
      success: false,
      message: 'YouTube API 설정이 없습니다. 관리자에게 문의해주세요.',
      error: new Error('Missing YouTube API configuration'),
    };
  }

  try {
    // 검색 쿼리: "가수명 곡제목 광고없음"
    const query = `${artist} ${title} 광고없음`;
    
    const response = await axios.get(YOUTUBE_SEARCH_URL, {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: 1,
        key: YOUTUBE_API_KEY,
        videoCategoryId: '10', // 음악 카테고리
      },
    });

    if (response.data.items && response.data.items.length > 0) {
      const videoId = response.data.items[0].id.videoId;
      return {
        success: true,
        videoId,
        title: response.data.items[0].snippet.title,
        thumbnail: response.data.items[0].snippet.thumbnails.default.url,
      };
    } else {
      return {
        success: false,
        message: '검색 결과가 없습니다.',
      };
    }
  } catch (error) {
    const status = error?.response?.status;
    const detail = error?.response?.data;
    // 콘솔에 과도한 스택 대신 상태/간략 정보만 출력
    console.warn('YouTube 검색 실패:', status || 'unknown', detail || error?.message);
    return {
      success: false,
      message: 'YouTube 검색 중 오류가 발생했습니다.',
      error: { status, detail, message: error?.message },
    };
  }
};

/**
 * YouTube에서 곡 검색 (대체 방법 - YouTube iframe URL 직접 생성)
 * API 키 없이도 사용 가능하지만, 첫 번째 검색 결과를 보장할 수 없음
 */
export const getYouTubeSearchUrl = (artist, title) => {
  const query = encodeURIComponent(`${artist} ${title} 광고없음`);
  return `https://www.youtube.com/results?search_query=${query}`;
};

/**
 * 멜론 차트 곡을 YouTube에서 검색
 */
export const searchMelonChartOnYouTube = async (melonSong) => {
  return await searchYouTubeMusic(melonSong.artist, melonSong.title);
};
