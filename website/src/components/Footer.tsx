import React from "react";
import Logo from "../media/Logo";
import "../styles/footer.css";
import { Translation } from "../misc/translations";

function Footer({ data }: { data: Translation }) {
  return (
    <footer className="centred">
      <hr />
      <Logo size={20} />
      <small>
        {data.footer.replace("{YEAR}", new Date().getFullYear().toString())}
      </small>
    </footer>
  );
}

export default Footer;
