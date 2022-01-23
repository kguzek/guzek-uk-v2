import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/styles.css";
import Translations from "./Translations";
import NavigationBar from "./components/Navigation/NavigationBar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import Konrad from "./pages/Konrad";
import NotFound from "./pages/NotFound";

function App() {
  // check if user has set the language before
  let userLang = localStorage.getItem("userLanguage");
  // check if the URL has the language set
  if (typeof URLSearchParams !== "undefined") {
    const queryParams = new URLSearchParams(window.location.search);
    const pageLang = queryParams.get("lang");
    if (pageLang in Translations) {
      userLang = pageLang;
    }
  } else {
    console.log("Your browser does not support URLSearchParams.");
  }
  const [language, setLanguage] = useState(userLang || "EN");
  const data = Translations[language];
  useEffect(() => {}, [language]);

  function changeLang(e) {
    e.preventDefault();
    // get the button text and remove whitespaces as well as Non-Breaking Spaces (&nbsp;)
    const lang = (e.target.textContent || e.target.innerText).replace(
      /[\s\u00A0]/,
      ""
    );
    if (!(lang in Translations)) {
      return;
    }
    // set user preferences in local storage
    localStorage.setItem("userLanguage", lang);

    // ignore the "lang" parameter in URL if it's set
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.delete("lang");
    const queryParamsString = queryParams.toString() ? `?${queryParams}` : "";
    window.history.replaceState(
      {},
      document.title,
      document.location.pathname + queryParamsString
    );
    // update page state setting
    setLanguage(lang);
  }

  return (
    <Router>
      <div className="App">
        <NavigationBar
          data={data}
          selectedLanguage={language}
          changeLang={changeLang}
        />
        <Routes>
          <Route path="/" element={<Home data={data} />} />
          <Route path="/konrad" element={<Konrad data={data} />} />
          <Route path="/error/404" element={<NotFound data={data} />} />
          <Route path="*" element={<NotFound data={data} />} />
        </Routes>
        <Footer data={data} />
      </div>
    </Router>
  );
}

export default App;
