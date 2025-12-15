import { useState } from "react";
import "./Guestbook.css";

function Guestbook() {
  const [message, setMessage] = useState("");
  const [guestbook, setGuestbook] = useState([
    {
      id: 1,
      name: "guest_user",
      text: "Your photos are so aesthetic today 💖",
      date: "2023.12.10",
    },
    {
      id: 2,
      name: "minji_luv",
      text: "Let’s go to that café together next time ☕",
      date: "2023.12.09",
    },
  ]);

  const handleSubmit = () => {
    if (!message.trim()) return;

    setGuestbook([
      {
        id: Date.now(),
        name: "anonymous",
        text: message,
        date: new Date().toISOString().slice(0, 10),
      },
      ...guestbook,
    ]);
    setMessage("");
  };

  return (
    <section className="guestbook card">
      {/* 헤더 */}
      <div className="guestbook-header">
        <h3>💌 Guestbook</h3>
        <span className="count">{guestbook.length}</span>
      </div>

      {/* 입력 */}
      <div className="guestbook-form">
        <textarea
          placeholder="따뜻한 한마디를 남겨주세요…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={120}
        />
        <button onClick={handleSubmit}>등록</button>
      </div>

      {/* 리스트 */}
      <ul className="guestbook-list">
        {guestbook.map((item) => (
          <li key={item.id}>
            <div className="meta">
              <span className="name">{item.name}</span>
              <span className="date">{item.date}</span>
            </div>
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Guestbook;
