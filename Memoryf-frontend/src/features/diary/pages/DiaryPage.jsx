import DiaryEditor from "../components/DiaryEdit";
import DiaryList from "../components/DiaryList";
import "../css/DiaryPage.css";

function DiaryPage() {
  return (
    <section className="diary-page">
      <DiaryEditor />
      <DiaryList />
    </section>
  );
}

export default DiaryPage;
