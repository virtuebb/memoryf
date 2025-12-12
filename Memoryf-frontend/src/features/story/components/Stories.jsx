import React from 'react';

function Stories(){ 
  return (
    <div className="stories-row">
      {/* story item들을 map으로 렌더 */}
      스토리 부분  : 
      <div className="story-item">user1</div>
      <div className="story-item">user2</div>
      <div className="story-item">user3</div>
    </div>
  );
}

export default Stories