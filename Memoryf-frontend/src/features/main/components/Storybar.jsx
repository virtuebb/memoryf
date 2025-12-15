import "./StoryBar.css";

function StoryBar() {
  return (
    <div className="sidebar-section story-wrapper">
      <div className="story-bar">

        <div className="story add">
          <div className="story-circle add-circle">+</div>
          <div className="story-label">Add</div>
        </div>

        <div className="story">
          <div className="story-circle">You</div>
          <div className="story-label">You</div>
        </div>

        <div className="story">
          <div className="story-circle">M</div>
          <div className="story-label">minji</div>
        </div>

        <div className="story">
          <div className="story-circle">C</div>
          <div className="story-label">cool_guy</div>
        </div>

        <div className="story">
          <div className="story-circle">T</div>
          <div className="story-label">travel</div>
        </div>

      </div>
    </div>
  );
}

export default StoryBar;
