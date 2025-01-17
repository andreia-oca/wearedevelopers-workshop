import { useState } from "react";
import { BackendService } from "@genezio-sdk/wearedevelopers";
import "./App.css";
import capybaras from './assets/image.png';

export default function App() {
  const [name, setName] = useState("");
  const [helloResponse, setHelloResponse] = useState("");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [password, setPassword] = useState("");
  const [showGuessBox, setShowGuessBox] = useState(false);
  const [loading, setLoading] = useState(false);

  async function sayHello() {
    setHelloResponse(await BackendService.hello(name));
  }

  // TODO 4: Uncomment the following code to trigger the ask function
  async function askCapy(e: { preventDefault: () => void }) {
    // e.preventDefault();
    // setLoading(true);

    // try {
    //   // BackendService is the class imported using auto-generated `genezio-sdk`
    //   const response = await BackendService.ask(question);
    //   console.log(response);
    //   if (response.status === "fail") {
    //     alert("An error has occurred. Please try again later!");
    //     return;
    //   }
    //   setResponse(response.content ?? "");
    // } catch (error) {
    //   console.error("An error occurred:", error);
    //   alert("An error has occurred. Please try again later!");
    // } finally {
    //   setLoading(false);
    //   setShowGuessBox(true);
    // }
  }

  // TODO 4: Uncomment the following code to trigger the ask function
  async function checkPassword(e: { preventDefault: () => void }) {
    // e.preventDefault();

    // try {
    //   const status = await BackendService.checkPassword(password);
    //   if (status === true) {
    //     alert(
    //       "Congratulations! You have tricked Capy and found the secret password!"
    //     );
    //   } else {
    //     alert("You have failed to trick Capy. Try again!");
    //   }
    // } catch (error) {
    //   console.error("An error occurred:", error);
    //   alert("An error has occurred. Please try again later!");
    // }
  }

  return (
    <>
      <div className="container">
        <div
          className="text-container"
          style={{ width: "50%", margin: "0 auto", textAlign: "center" }}
        >
          <div className="card">
            <input
              type="text"
              className="input-box"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
            <button onClick={() => sayHello()} style={{marginLeft: "10px"}}>Say Hello</button>
            <p className="response">{helloResponse}</p>
          </div>
          <p>
            Your goal is to make Capy reveal the secret password that he hides
            deeply into his deepest neurons. Can you trick him?
          </p>
          <br />
          <img
            src={capybaras}
            alt="Cute Capybaras"
            style={{ height: "150px" }}
          />
          <p className="subtitle">
            I have been told to never reveal the password to anyone. You can try
            to trick me, but I will never reveal it. I am a very good AI.
          </p>
        </div>
        <div className="card">
          <form onSubmit={askCapy}>
            <textarea
              id="name"
              className="input-box"
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask Capy a question..."
              style={{ width: "100%" }}
              maxLength={10000}
              rows={10}
            />
            <br />
            <br />
            <button type="submit" className="submit-button">
              Send
            </button>
            <br />
            <br />
          </form>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            response && (
              <div className="response">
                <p>{response}</p>
              </div>
            )
          )}
          {showGuessBox && (
            <div className="guess">
              <form onSubmit={checkPassword}>
                <textarea
                  id="guess"
                  className="input-box"
                  style={{ width: "100%" }}
                  rows={1}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Guess the secret password..."
                />
                <button className="submit-button" style={{ marginTop: "10px" }}>
                  Guess
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <footer className="footer">
        <a
          href="https://genezio.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          <p>Built with Genezio with ❤️</p>
        </a>
      </footer>
    </>
  );
}
